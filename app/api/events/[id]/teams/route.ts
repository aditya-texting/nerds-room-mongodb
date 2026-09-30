import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/core';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';
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
    const { name } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 });
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
    // Find all teams for this event
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

    // Generate unique join code
    const joinCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    // Create team and leader member
    const newTeam = await Team.create({
      eventId: eventId,
      name: name.trim(),
      joinCode: joinCode,
      createdBy: userId,
      minMembers: event.minTeamSize || 1,
      maxMembers: event.maxTeamSize || 4,
      status: "OPEN",
    });

    await TeamMember.create({
      teamId: newTeam._id,
      userId: userId,
      role: "LEADER",
      status: "ACTIVE",
    });

    const createdTeam = newTeam.toObject();
    createdTeam.id = createdTeam._id.toString();
    delete createdTeam._id;

    return NextResponse.json({ message: "Team created successfully", team: createdTeam }, { status: 201 });
  } catch (error: any) {
    console.error("CREATE TEAM ERROR:", error?.message, error?.code, error);
    return NextResponse.json({ error: "Failed to create team", detail: error?.message }, { status: 500 });
  }
}
