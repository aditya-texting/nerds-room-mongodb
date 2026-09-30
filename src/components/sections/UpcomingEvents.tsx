'use client';

import * as React from 'react';
import { EventCard } from '@/src/components/ui/EventCard';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { useEvents } from '@/src/modules/events/hooks/useEvents';
import { Loader2 } from 'lucide-react';

export function UpcomingEvents() {
  const { data, isLoading } = useEvents({ limit: 5 });
  const events = data?.data || [];

  return (
    <section id="events" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center mb-12 gap-4">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl font-black tracking-tight text-[#00308F]">
              Upcoming Events<span className="text-[#84CC16]">.</span>
            </h2>
            <p className="text-slate-600 mt-3 text-lg max-w-xl mx-auto font-medium">
              Join the next big hackathon and build something extraordinary.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#00308F]" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-medium">
            No upcoming events at the moment. Check back soon!
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {events.map((event: any, idx: number) => {
              const startDate = new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const mappedType = event.locationType === 'ONLINE' ? 'Online' : event.locationType === 'OFFLINE' ? 'Offline' : 'Hybrid';
              
              return (
                <motion.div
                  key={event.slug}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="min-w-[320px] max-w-[360px] snap-center shrink-0"
                >
                  <EventCard 
                    slug={event.slug}
                    title={event.name}
                    date={startDate}
                    type={mappedType}
                    location={event.locationAddress || undefined}
                    image={event.coverImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60'}
                    registrations={event._count?.eventRegistrations || 0}
                    description={event.description?.replace(/<[^>]+>/g, '').substring(0, 100) + '...'}
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <a
            href="/events"
            className="inline-flex h-12 items-center justify-center rounded-md bg-secondary px-8 text-base font-medium text-secondary-foreground shadow transition-colors hover:bg-secondary/80"
          >
            View All Events <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
