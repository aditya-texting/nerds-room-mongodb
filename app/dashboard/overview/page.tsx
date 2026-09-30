import { connectToDatabase } from "@/src/core";
import { verifyJwt } from "@/src/core";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import User from "@/src/models/User";
import Event from "@/src/models/Event";

export default async function DashboardHomePage() {
  await connectToDatabase();
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) {
    redirect('/login');
  }

  const payload = verifyJwt(token);
  if (!payload?.userId) {
    redirect('/login');
  }

  const user = await User.findById(payload.userId).lean();

  if (!user || (user.role !== 'ADMIN' && user.role !== 'ORGANIZER')) {
    redirect('/');
  }

  // Fetch stats
  const totalUsers = await User.countDocuments({ role: 'PARTICIPANT' });
  const totalOrganizers = await User.countDocuments({ role: 'ORGANIZER' });
  const totalEvents = await Event.countDocuments();

  // Working professional vs students
  const workingProfessionals = await User.countDocuments({
    userType: 'WORKING_PROFESSIONAL', role: 'PARTICIPANT'
  });
  
  const students = await User.countDocuments({
    userType: 'COLLEGE_STUDENT', role: 'PARTICIPANT'
  });
  
  const otherUsers = await User.countDocuments({
    userType: 'OTHER', role: 'PARTICIPANT'
  });

  const stats = {
    totalUsers,
    totalEvents,
    totalOrganizers,
    demographics: [
      { name: 'Working Professionals', value: workingProfessionals },
      { name: 'Students', value: students },
      { name: 'Others', value: otherUsers }
    ],
    roles: [
      { name: 'Participants', value: totalUsers },
      { name: 'Organizers', value: totalOrganizers }
    ]
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Overview Dashboard</h1>
      <DashboardClient stats={stats} />
    </div>
  );
}
