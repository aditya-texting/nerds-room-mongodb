import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/core';
import User from '@/src/models/User';
import { sendForgotPasswordEmail } from '@/src/core/mail';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security, just say OTP sent if we wanted to be super secure.
      // But for better UX, we'll return an error.
      return NextResponse.json({ message: 'User with this email not found' }, { status: 404 });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await User.findByIdAndUpdate(user._id, {
      resetOtp: otp,
      resetOtpExpiry: otpExpiry,
    });

    // Send Email
    await sendForgotPasswordEmail(user.email, user.name, otp);

    return NextResponse.json({ message: 'OTP sent successfully to your email.' }, { status: 200 });
  } catch (error: any) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ message: 'Failed to send OTP' }, { status: 500 });
  }
}
