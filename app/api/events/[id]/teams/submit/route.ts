import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/core';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import Team from '@/src/models/Team';
import TeamMember from '@/src/models/TeamMember';
import TeamRegistration from '@/src/models/TeamRegistration';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id: eventId } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    const userId = decoded.userId;

    // Find the user's active team for this event
    const eventTeams = await Team.find({ eventId }).select('_id').lean();
    const eventTeamIds = eventTeams.map(t => t._id);

    const teamMember: any = await TeamMember.findOne({
      userId: userId,
      teamId: { $in: eventTeamIds },
      status: "ACTIVE"
    }).lean();

    if (!teamMember) {
      return NextResponse.json({ error: "You are not in a team for this event." }, { status: 400 });
    }

    if (teamMember.role !== "LEADER") {
      return NextResponse.json({ error: "Only the Team Leader can submit the application." }, { status: 403 });
    }

    const team: any = await Team.findById(teamMember.teamId).lean();
    const memberCount = await TeamMember.countDocuments({ teamId: team._id, status: "ACTIVE" });

    if (memberCount < team.minMembers) {
      return NextResponse.json({
        error: `Need at least ${team.minMembers} members. Currently have ${memberCount}.`
      }, { status: 400 });
    }

    // Check if already submitted
    const existing = await TeamRegistration.findOne({
      teamId: team._id, eventId: eventId
    });

    if (existing) {
      if (existing.status === "SUBMITTED" || existing.status === "CONFIRMED") {
        return NextResponse.json({ error: "Team application already submitted." }, { status: 400 });
      }
      // Re-submit if DRAFT/CANCELLED
      const updated = await TeamRegistration.findByIdAndUpdate(existing._id, { status: "SUBMITTED", registeredBy: userId }, { new: true });
      const updatedObj = updated.toObject();
      updatedObj.id = updatedObj._id.toString();
      delete updatedObj._id;
      return NextResponse.json({ message: "Team application submitted successfully!", registration: updatedObj }, { status: 200 });
    }

    // Create the TeamRegistration
    const newRegistration = await TeamRegistration.create({
      teamId: team._id,
      eventId: eventId,
      registeredBy: userId,
      status: "SUBMITTED"
    });
    
    const registrationObj = newRegistration.toObject();
    registrationObj.id = registrationObj._id.toString();
    delete registrationObj._id;

    return NextResponse.json({ message: "Team application submitted successfully!", registration: registrationObj }, { status: 201 });
  } catch (error: any) {
    console.error("SUBMIT TEAM APPLICATION ERROR:", error?.message, error?.code);
    return NextResponse.json({ error: "Failed to submit application", detail: error?.message }, { status: 500 });
  }
}
