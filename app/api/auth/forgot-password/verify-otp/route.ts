import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/core';
import User from '@/src/models/User';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.resetOtp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP. Please try again.' }, { status: 400 });
    }

    if (!user.resetOtpExpiry || user.resetOtpExpiry < new Date()) {
      return NextResponse.json({ message: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ message: 'Failed to verify OTP' }, { status: 500 });
  }
}
