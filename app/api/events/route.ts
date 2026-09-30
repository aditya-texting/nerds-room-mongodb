import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/core";
import { verifyJwt } from "@/src/core";
import { cookies } from "next/headers";
import User from "@/src/models/User";
import Event from "@/src/models/Event";
import EventRegistration from "@/src/models/EventRegistration";
import EventFormField from "@/src/models/EventFormField";
import EventTimeline from "@/src/models/EventTimeline";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status"); 
    const search = searchParams.get("search");
    const locationType = searchParams.get("locationType");
    const isFeatured = searchParams.get("isFeatured");
    const category = searchParams.get("category");

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    let user = null;
    if (token) {
      const payload = verifyJwt(token);
      if (payload?.userId) {
        user = await User.findById(payload.userId).lean();
      }
    }
    
    // Base filter
    const where: any = {};

    if (status) {
      where.status = status;
    } else if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER")) {
      // Public view: only show PUBLISHED events
      where.status = "PUBLISHED";
    }

    if (search) {
      where.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      where.tags = { $in: [category.toLowerCase().trim()] };
    }

    if (locationType) {
      where.locationType = locationType;
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    } else if (isFeatured === 'false') {
      where.isFeatured = false;
    }

    const events = await Event.find(where)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ isFeatured: -1, startDate: 1 })
      .lean();

    const total = await Event.countDocuments(where);

    // Calculate dynamic event status and get registrations count
    const now = new Date();
    const formattedEvents = await Promise.all(events.map(async (event: any) => {
      let dynamicStatus = "UPCOMING";
      if (now >= event.startDate && now <= event.endDate) {
        dynamicStatus = "LIVE";
      } else if (now > event.endDate) {
        dynamicStatus = "CLOSED";
      }

      const registrationsCount = await EventRegistration.countDocuments({ eventId: event._id });

      event.id = event._id.toString();
      delete event._id;

      return {
        ...event,
        dynamicStatus,
        _count: {
          eventRegistrations: registrationsCount
        }
      };
    }));

    return NextResponse.json({
      data: formattedEvents,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      timeline // Array of timeline events
    } = data;

    // Generate unique slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const newEvent = await Event.create({
      name,
      slug,
      description,
      coverImageUrl: data.coverImageUrl || null,
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
      tags: Array.isArray(tags) ? tags.map((t: string) => t.toLowerCase().trim()) : [],
      createdBy: user._id
    });

    if (formFields && formFields.length > 0) {
      await EventFormField.insertMany(formFields.map((field: any, index: number) => ({
        eventId: newEvent._id,
        fieldName: field.fieldName,
        fieldType: field.fieldType,
        isRequired: Boolean(field.isRequired),
        options: field.options || [],
        order: index
      })));
    }

    if (timeline && timeline.length > 0) {
      await EventTimeline.insertMany(timeline.map((t: any, index: number) => ({
        eventId: newEvent._id,
        title: t.title,
        description: t.description || null,
        startTime: new Date(t.startTime),
        endTime: t.endTime ? new Date(t.endTime) : null,
        sortOrder: index
      })));
    }

    const createdEvent = newEvent.toObject();
    createdEvent.id = createdEvent._id.toString();
    delete createdEvent._id;

    return NextResponse.json({ data: createdEvent }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
