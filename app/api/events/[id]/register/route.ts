import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/core";
import { verifyJwt } from "@/src/core/jwt";
import { cookies } from "next/headers";
import Event from "@/src/models/Event";
import EventRegistration from "@/src/models/EventRegistration";
import EventRegistrationAnswer from "@/src/models/EventRegistrationAnswer";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const body = await req.json();
    const { answers } = body; // Array of { fieldId: string, value: string }

    // Check if event exists
    const event = await Event.findById(eventId).lean();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if already registered
    const existingRegistration = await EventRegistration.findOne({
      eventId,
      userId: payload.userId,
    });

    if (existingRegistration) {
      return NextResponse.json({ error: "You are already registered for this event." }, { status: 400 });
    }

    const newReg = await EventRegistration.create({
      eventId,
      userId: payload.userId,
      status: "REGISTERED",
    });

    if (answers && Array.isArray(answers) && answers.length > 0) {
      const answerData = answers.map((ans: any) => ({
        registrationId: newReg._id,
        fieldId: ans.fieldId,
        value: Array.isArray(ans.value) ? ans.value.join(", ") : String(ans.value),
      }));

      await EventRegistrationAnswer.insertMany(answerData);
    }

    const regResponse = newReg.toObject();
    regResponse.id = regResponse._id.toString();
    delete regResponse._id;

    return NextResponse.json({ message: "Successfully registered!", registration: regResponse }, { status: 201 });
  } catch (error: any) {
    console.error("Error registering for event:", error);
    return NextResponse.json({ error: error.message || "Failed to register for event" }, { status: 500 });
  }
}
