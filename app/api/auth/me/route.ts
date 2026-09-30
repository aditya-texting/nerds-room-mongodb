import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt, connectToDatabase } from '@/src/core';
import User from '@/src/models/User';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    const user = await User.findById(payload.userId).select(
      'name email role userType status organisationName jobRole phone createdAt updatedAt'
    ).lean();
    if (user) {
        user.id = user._id.toString();
        delete user._id;
    }

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error('Me API error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
