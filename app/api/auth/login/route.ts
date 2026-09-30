import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { signJwt, ENV, connectToDatabase } from '@/src/core';
import { loginSchema } from '@/src/modules/auth/validations';
import User from '@/src/models/User';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // 1. Validate Input
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid credentials', errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // 2. Fetch User
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 3. Status Checks
    if (user.status === 'PENDING') {
      return NextResponse.json(
        { message: 'Your account is pending admin approval.' },
        { status: 403 }
      );
    }

    if (user.status === 'BANNED') {
      return NextResponse.json(
        { message: 'Your account has been banned. Contact support.' },
        { status: 403 }
      );
    }

    // 4. Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 5. Generate JWT Token
    const token = signJwt({
      userId: user._id.toString(),
      role: user.role,
    });

    // 6. Set HTTPOnly Cookie
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
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
