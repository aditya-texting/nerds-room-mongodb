import { NextResponse } from 'next/server';
import { signJwt, ENV, connectToDatabase } from '@/src/core';
import User from '@/src/models/User';
import { cookies } from 'next/headers';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Backend-only schema — no confirmPassword (that's a frontend concern)
const backendRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = backendRegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const { name, email, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email is already registered' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      userType: 'OTHER',      // Updated in /onboarding
      role: 'PARTICIPANT',    // Updated in /onboarding
      status: 'ACTIVE',
    });

    // Auto-login: set JWT cookie so user lands directly on /onboarding
    const token = signJwt({ userId: newUser._id.toString(), role: newUser.role });
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json(
      { message: 'Account created successfully!', data: null },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
