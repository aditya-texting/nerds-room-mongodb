import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/core';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import Event from '@/src/models/Event';
import Team from '@/src/models/Team';
import TeamMember from '@/src/models/TeamMember';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id: eventId } = await params;
    const body = await request.json();
    const { joinCode } = body;

    if (!joinCode || joinCode.trim() === '') {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    const userId = decoded.userId;

    // Verify Event exists and is a team event
    const event = await Event.findById(eventId).lean();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.participationType === "INDIVIDUAL") {
      return NextResponse.json({ error: "This event does not allow teams." }, { status: 400 });
    }

    // Check if user is already in a team for this event
    const eventTeams = await Team.find({ eventId }).select('_id').lean();
    const eventTeamIds = eventTeams.map(t => t._id);

    const existingMember = await TeamMember.findOne({
      userId: userId,
      teamId: { $in: eventTeamIds },
      status: "ACTIVE"
    });

    if (existingMember) {
      return NextResponse.json({ error: "You are already in a team for this event." }, { status: 400 });
    }

    // Find Team by Join Code
    const team: any = await Team.findOne({
      eventId: eventId,
      joinCode: joinCode.trim().toUpperCase()
    });

    if (!team) {
      return NextResponse.json({ error: "Invalid invite code or team does not exist for this event." }, { status: 404 });
    }

    if (team.status !== "OPEN") {
      return NextResponse.json({ error: `Team is currently ${team.status.toLowerCase()}.` }, { status: 400 });
    }

    const activeMembersCount = await TeamMember.countDocuments({ teamId: team._id, status: "ACTIVE" });

    if (activeMembersCount >= team.maxMembers) {
      return NextResponse.json({ error: "This team has reached the maximum number of members." }, { status: 400 });
    }

    await TeamMember.create({
      teamId: team._id,
      userId: userId,
      role: "MEMBER",
      status: "ACTIVE",
    });

    const newMemberCount = activeMembersCount + 1;
    let newStatus = team.status;

    if (newMemberCount >= team.maxMembers) {
      newStatus = "FULL";
      await Team.findByIdAndUpdate(team._id, { status: "FULL" });
    }

    return NextResponse.json({ message: "Successfully joined team", teamId: team._id.toString(), status: newStatus }, { status: 200 });
  } catch (error: any) {
    console.error("JOIN TEAM ERROR:", error);
    return NextResponse.json({ error: "Failed to join team" }, { status: 500 });
  }
}
