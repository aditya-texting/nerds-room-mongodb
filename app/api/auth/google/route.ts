import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { signJwt, ENV, connectToDatabase } from '@/src/core';
import User from '@/src/models/User';
import { cookies } from 'next/headers';

const client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { credential: accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ message: 'Google Token is missing' }, { status: 400 });
    }

    // Fetch user profile using access token
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userInfoResponse.ok) {
      return NextResponse.json({ message: 'Invalid Google Token' }, { status: 401 });
    }

    const payload = await userInfoResponse.json();
    if (!payload || !payload.email) {
      return NextResponse.json({ message: 'Invalid Google User Data' }, { status: 401 });
    }

    const { email, name, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Auto-create user if they don't exist
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        passwordHash: '', // Google users don't have a password
        userType: 'OTHER',
        role: 'PARTICIPANT',
        status: 'ACTIVE',
        emailVerified: true,
      });
    }

    if (user.status === 'PENDING') {
      return NextResponse.json({ message: 'Your account is pending admin approval.' }, { status: 403 });
    }

    if (user.status === 'BANNED') {
      return NextResponse.json({ message: 'Your account has been banned. Contact support.' }, { status: 403 });
    }

    // Generate JWT Token
    const token = signJwt({
      userId: user._id.toString(),
      role: user.role,
    });

    // Set HTTPOnly Cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json(
      {
        message: 'Login successful',
        isNewUser: user.userType === 'OTHER',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return NextResponse.json({ message: 'Failed to authenticate with Google' }, { status: 500 });
  }
}
