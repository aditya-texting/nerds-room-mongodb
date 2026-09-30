import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/core';
import User from '@/src/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const phone = req.nextUrl.searchParams.get('phone');

    if (!phone || phone.length < 5) {
      return NextResponse.json({ message: 'Valid phone number is required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ phone }).select('_id');

    return NextResponse.json({ exists: !!existingUser }, { status: 200 });
  } catch (error: any) {
    console.error('Check phone error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
