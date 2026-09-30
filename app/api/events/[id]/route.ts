import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/core";
import { verifyJwt } from "@/src/core";
import { cookies } from "next/headers";
import User from "@/src/models/User";
import Event from "@/src/models/Event";
import EventTimeline from "@/src/models/EventTimeline";
import EventFormField from "@/src/models/EventFormField";
import TeamRegistration from "@/src/models/TeamRegistration";
import EventRegistration from "@/src/models/EventRegistration";
import Application from "@/src/models/Application";
import Team from "@/src/models/Team";

// Fetch Single Event
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const event: any = await Event.findById(id).lean();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    event.id = event._id.toString();
    delete event._id;

    // Fetch related data
    const eventTimeline = await EventTimeline.find({ eventId: id }).sort({ sortOrder: 1 }).lean();
    const formFields = await EventFormField.find({ eventId: id }).sort({ order: 1 }).lean();

    event.eventTimeline = eventTimeline.map((item: any) => ({ ...item, id: item._id.toString() }));
    event.formFields = formFields.map((item: any) => ({ ...item, id: item._id.toString() }));

    return NextResponse.json({ data: event }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

// Update Event
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    let user = null;
    if (token) {
      const payload = verifyJwt(token);
      if (payload?.userId) {
        user = await User.findById(payload.userId).lean();
      }
    }

    if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const data = await req.json();

    const {
      name,
      description,
      startDate,
      endDate,
      locationType,
      locationAddress,
      locationUrl,
      participationType,
      minTeamSize,
      maxTeamSize,
      status,
      isFeatured,
      tags,
      formFields, // Array of dynamic form fields
      timeline, // Array of timeline events
      coverImageUrl
    } = data;

    // Verify Event exists and User has permission
    const existingEvent = await Event.findById(id).lean();
    
    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (user.role === "ORGANIZER" && existingEvent.createdBy.toString() !== user._id.toString()) {
       return NextResponse.json({ error: "Unauthorized. You did not create this event." }, { status: 403 });
    }

    const updatedEvent: any = await Event.findByIdAndUpdate(id, {
      name,
      description,
      coverImageUrl: coverImageUrl || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      locationType: locationType,
      locationAddress,
      locationUrl,
      participationType: participationType,
      minTeamSize: minTeamSize ? parseInt(minTeamSize) : null,
      maxTeamSize: maxTeamSize ? parseInt(maxTeamSize) : null,
      status: status,
      isFeatured: Boolean(isFeatured),
      tags: tags || []
    }, { new: true }).lean();

    // Delete existing relations and recreate to avoid complex diffing logic
    await EventFormField.deleteMany({ eventId: id });
    if (formFields && formFields.length > 0) {
      await EventFormField.insertMany(formFields.map((field: any, index: number) => ({
        eventId: id,
        fieldName: field.fieldName,
        fieldType: field.fieldType,
        isRequired: Boolean(field.isRequired),
        options: field.options || [],
        order: index
      })));
    }

    await EventTimeline.deleteMany({ eventId: id });
    if (timeline && timeline.length > 0) {
      await EventTimeline.insertMany(timeline.map((t: any, index: number) => ({
        eventId: id,
        title: t.title,
        description: t.description || null,
        startTime: new Date(t.startTime),
        sortOrder: index
      })));
    }

    updatedEvent.id = updatedEvent._id.toString();
    delete updatedEvent._id;

    return NextResponse.json({ data: updatedEvent }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

// Delete Event
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    let user = null;
    if (token) {
      const payload = verifyJwt(token);
      if (payload?.userId) {
        user = await User.findById(payload.userId).lean();
      }
    }

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Only admins can delete events." }, { status: 403 });
    }

    const { id } = await params;

    const event = await Event.findById(id).lean();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Manual cleanup of nested dependent records
    await EventTimeline.deleteMany({ eventId: id });
    await EventFormField.deleteMany({ eventId: id });
    await TeamRegistration.deleteMany({ eventId: id });
    await EventRegistration.deleteMany({ eventId: id });
    await Application.deleteMany({ eventId: id });
    await Team.deleteMany({ eventId: id });

    await Event.findByIdAndDelete(id);

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: error.message || "Failed to delete event" }, { status: 500 });
  }
}
