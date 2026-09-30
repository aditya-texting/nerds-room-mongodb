import React from "react";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/src/core";
import Event from "@/src/models/Event";
import EventTimeline from "@/src/models/EventTimeline";
import EventRegistration from "@/src/models/EventRegistration";
import EventFormField from "@/src/models/EventFormField";
import { Calendar, MapPin, Users, CheckCircle, Clock } from "lucide-react";
import EventRegistrationButton from "@/src/modules/events/components/EventRegistrationButton";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;

  await connectToDatabase();

  const event: any = await Event.findOne({ slug }).lean();

  if (!event || event.status !== "PUBLISHED") {
    notFound();
  }

  const timelines = await EventTimeline.find({ eventId: event._id }).sort({ sortOrder: 1 }).lean();
  const formFields = await EventFormField.find({ eventId: event._id }).sort({ order: 1 }).lean();
  
  event.eventTimeline = timelines;
  event.formFields = formFields;
  event.id = event._id.toString();

  const { cookies } = await import("next/headers");
  const { verifyJwt } = await import("@/src/core/jwt");
  
  let isRegistered = false;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (token) {
      const payload = verifyJwt(token);
      if (payload?.userId) {
        const registration = await EventRegistration.findOne({
          eventId: event._id,
          userId: payload.userId
        });
        isRegistered = !!registration;
      }
    }
  } catch (e) {
    // Ignore invalid tokens
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-[#f4f7f0]">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] md:h-[600px] bg-secondary/10 overflow-hidden">
        <img 
          src={"https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"} 
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f4f7f0] via-[#f4f7f0]/90 to-black/20" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto px-4 w-full pb-4">
            <div className="flex flex-wrap gap-2 mb-6">
              {event.tags.map((tag: any) => (
                <span key={tag} className="px-3 py-1 bg-[#84CC16] text-[#00308F] text-xs font-black rounded-full uppercase tracking-wider shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-[#00308F] mb-4 leading-tight tracking-tight">
              {event.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-slate-700 font-bold mt-6">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                <Calendar className="w-5 h-5 text-orange-500" />
                <span>{formatDateTime(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                <span className="truncate max-w-[200px] md:max-w-md">
                  {event.locationType === "ONLINE" ? (
                    event.locationUrl ? (
                      <a href={event.locationUrl} target="_blank" rel="noreferrer" className="hover:underline hover:text-[#00308F] transition text-[#84CC16]">Online (Meeting Link)</a>
                    ) : "Online"
                  ) : (
                    event.locationUrl ? (
                      <a href={event.locationUrl} target="_blank" rel="noreferrer" className="hover:underline hover:text-[#00308F] transition text-[#84CC16]" title={event.locationAddress || "View Map"}>
                        {event.locationAddress || "View Map"}
                      </a>
                    ) : (
                      event.locationAddress || "TBA"
                    )
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                <Users className="w-5 h-5 text-orange-500" />
                <span>
                  {event.participationType === "INDIVIDUAL" ? "Individual" : `Teams of ${event.minTeamSize}-${event.maxTeamSize}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content — sidebar stacks below on mobile, beside on lg+ */}
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-12 lg:pt-8 lg:pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: main content */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-10 lg:space-y-16 order-2 lg:order-1">
          {/* Description */}
          <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <h2 className="text-3xl font-black mb-6 text-[#00308F] tracking-tight">About the Event</h2>
            <div 
              className="prose prose-base sm:prose-lg max-w-none prose-a:text-[#84CC16] prose-a:font-bold prose-headings:text-[#00308F] prose-headings:font-black prose-p:text-slate-600 prose-strong:text-slate-900 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </section>

          {/* Timeline - Always visible, awesome design */}
          {event.eventTimeline && event.eventTimeline.length > 0 && (
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#84CC16]/5 rounded-full blur-3xl -z-10" />
              
              <h2 className="text-2xl font-black mb-10 text-[#00308F] flex items-center gap-3">
                <div className="p-2.5 bg-orange-500/10 rounded-xl">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                Event Schedule
              </h2>
              
              <div className="relative ml-4 md:ml-6 space-y-8 pb-4">
                {/* Awesome gradient vertical line */}
                <div className="absolute top-4 bottom-0 left-[3px] w-[3px] bg-gradient-to-b from-[#84CC16] via-slate-200 to-transparent rounded-full" />
                
                {event.eventTimeline.map((phase: any, index: number) => {
                  const now = new Date();
                  const nextPhase = event.eventTimeline[index + 1];
                  const phaseStartTime = new Date(phase.startTime);
                  let isActive = false;
                  let isPast = false;

                  if (phase.endTime) {
                    const phaseEndTime = new Date(phase.endTime);
                    isActive = now >= phaseStartTime && now <= phaseEndTime;
                    isPast = now > phaseEndTime;
                  } else if (nextPhase) {
                    const nextPhaseStartTime = new Date(nextPhase.startTime);
                    isActive = now >= phaseStartTime && now < nextPhaseStartTime;
                    isPast = now >= nextPhaseStartTime;
                  } else {
                    const endDate = new Date(event.endDate);
                    isActive = now >= phaseStartTime && now <= endDate;
                    isPast = now > endDate;
                  }

                  return (
                    <div key={phase._id.toString()} className="relative pl-10 md:pl-14 group">
                      {/* Stunning Timeline Dot with Glow */}
                      <div className={`absolute -left-[5px] top-4 w-5 h-5 rounded-full border-[4px] bg-white transition-all duration-500 z-10 ${isActive ? 'border-[#84CC16] shadow-[0_0_15px_rgba(132,204,22,0.6)] scale-125' : isPast ? 'border-[#00308F]' : 'border-slate-300 group-hover:border-[#84CC16]/50'}`} />
                      
                      {/* Card Content - White bg with blue curve on the side */}
                      <div className={`w-full pl-6 p-4 md:p-5 rounded-[24px] border transition-all duration-500 relative overflow-hidden ${isActive ? 'border-[#84CC16]/50 bg-white shadow-[0_10px_40px_-10px_rgba(132,204,22,0.2)] hover:shadow-[0_10px_40px_-5px_rgba(132,204,22,0.3)]' : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-xl hover:-translate-y-1'}`}>
                        
                        {/* The Blue Curve on the side */}
                        <div className={`absolute top-0 bottom-0 left-0 w-3 rounded-r-2xl transition-colors duration-500 ${isActive ? 'bg-[#84CC16]' : 'bg-[#00308F]'}`} />

                        {isActive && (
                          <div className="absolute top-0 right-0 w-24 h-24 bg-[#84CC16]/10 rounded-bl-full -z-10" />
                        )}
                        
                        <div className="flex flex-col gap-2 mb-2">
                          {isActive && (
                            <span className="inline-flex w-fit items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#84CC16]">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84CC16] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#84CC16]"></span>
                              </span>
                              Happening Now
                            </span>
                          )}
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-4">
                            <h3 className={`font-black text-lg tracking-tight transition-colors ${isActive ? 'text-[#00308F]' : 'text-slate-800 group-hover:text-[#00308F]'}`}>{phase.title}</h3>
                            
                            <time className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isActive ? 'bg-orange-500/10 text-orange-600' : 'bg-slate-50 border border-slate-100 text-slate-500 group-hover:text-orange-500'}`}>
                              <Clock className="w-3.5 h-3.5" />
                              {formatDateTime(phase.startTime)} 
                              {phase.endTime && ` - ${formatDateTime(phase.endTime)}`}
                            </time>
                          </div>
                        </div>
                        {phase.description && <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-2xl mt-1">{phase.description}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar — comes first on mobile (order-1), then right on lg */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 order-1 lg:order-2">
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] lg:sticky lg:top-28">
            <h3 className="text-2xl font-black mb-2 text-[#00308F]">Ready to join?</h3>
            <p className="text-slate-500 font-medium text-sm mb-6 leading-relaxed">
              Secure your spot now. Registration is open until <br />
              <span className="font-bold text-slate-900">{formatDateTime(event.endDate)}</span>.
            </p>
            
            <EventRegistrationButton event={event} isRegistered={isRegistered} />
            
            <div className="mt-8 pt-8 border-t border-slate-100 space-y-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#84CC16]/10 rounded-2xl shrink-0">
                  <CheckCircle className="w-6 h-6 text-[#84CC16]" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">Participation</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {event.participationType === "INDIVIDUAL" ? "Individual entries only." : `Form a team of ${event.minTeamSize} to ${event.maxTeamSize} members.`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#00308F]/10 rounded-2xl shrink-0">
                  <MapPin className="w-6 h-6 text-[#00308F]" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">Location</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 capitalize">
                    {event.locationType.toLowerCase()}
                  </p>
                  {event.locationUrl && event.locationType !== "OFFLINE" && (
                    <a href={event.locationUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#84CC16] hover:underline mt-1 inline-block">Join Virtual Room &rarr;</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
