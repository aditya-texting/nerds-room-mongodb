import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt, connectToDatabase } from '@/src/core';
import User from '@/src/models/User';
import { sendOrganizerPendingEmail } from '@/src/core/mail';
import { z } from 'zod';

const onboardingSchema = z.object({
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  userType: z.enum(['COLLEGE_STUDENT', 'WORKING_PROFESSIONAL', 'OTHER']),
  role: z.enum(['PARTICIPANT', 'ORGANIZER']),
  organisationName: z.string().optional(),
  jobRole: z.string().optional(),
});

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload?.userId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { phone, userType, role, organisationName, jobRole } = parsed.data;

    // ORGANIZER → pending admin approval
    const newStatus = role === 'ORGANIZER' ? 'PENDING' : 'ACTIVE';

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { phone, userType, role, organisationName, jobRole, status: newStatus },
      { new: true }
    ).select('name email role status');
    if (updatedUser) {
        updatedUser.id = updatedUser._id.toString();
        delete updatedUser._id;
    }

    // Send "pending review" email to organizers
    if (role === 'ORGANIZER') {
      sendOrganizerPendingEmail(updatedUser.email, updatedUser.name); // fire & forget
    }

    const isOrganizer = role === 'ORGANIZER';

    return NextResponse.json(
      {
        message: isOrganizer
          ? 'Profile saved! Your organizer request is under review. We will reach out within 24–48 hours.'
          : 'Welcome to NerdsRoom! Your profile is all set.',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
