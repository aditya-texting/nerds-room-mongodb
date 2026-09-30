import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/core';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import Team from '@/src/models/Team';
import TeamMember from '@/src/models/TeamMember';
import TeamRegistration from '@/src/models/TeamRegistration';
import User from '@/src/models/User';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id: eventId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ team: null }, { status: 200 });
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
      userId = decoded.userId;
    } catch (err) {
      return NextResponse.json({ team: null }, { status: 200 });
    }

    const eventTeams = await Team.find({ eventId }).select('_id').lean();
    const eventTeamIds = eventTeams.map(t => t._id);

    const teamMember: any = await TeamMember.findOne({
      userId: userId,
      teamId: { $in: eventTeamIds },
      status: "ACTIVE"
    }).lean();

    if (!teamMember) {
      return NextResponse.json({ team: null }, { status: 200 });
    }

    const team: any = await Team.findById(teamMember.teamId).lean();
    
    // Get team members
    const members = await TeamMember.find({ teamId: team._id, status: "ACTIVE" }).lean();
    const userIds = members.map(m => m.userId);
    const users = await User.find({ _id: { $in: userIds } }).select('name email _id').lean();
    
    team.teamMembers = members.map((m: any) => {
      const user = users.find((u: any) => u._id.toString() === m.userId.toString());
      return {
        ...m,
        id: m._id.toString(),
        user: user ? { ...user, id: user._id.toString() } : null
      };
    });

    const registrations = await TeamRegistration.find({ eventId, teamId: team._id }).sort({ registeredAt: -1 }).limit(1).lean();
    const registration = registrations[0] ?? null;
    
    team.id = team._id.toString();
    delete team._id;

    return NextResponse.json({ 
      team: team, 
      role: teamMember.role,
      registration: registration
    }, { status: 200 });
  } catch (error: any) {
    console.error("GET MY TEAM ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}
