import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/core';
import User from '@/src/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ message: 'Email, OTP, and new password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.resetOtp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }

    if (!user.resetOtpExpiry || user.resetOtpExpiry < new Date()) {
      return NextResponse.json({ message: 'OTP has expired. Please generate a new one.' }, { status: 400 });
    }

    // OTP is valid. Hash new password.
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update user password and clear OTP fields
    await User.findByIdAndUpdate(user._id, {
      passwordHash,
      resetOtp: null,
      resetOtpExpiry: null,
    });

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ message: 'Failed to reset password' }, { status: 500 });
  }
}
