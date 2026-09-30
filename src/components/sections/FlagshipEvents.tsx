'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { MapPin } from 'lucide-react';

const events = [
  {
    id: 1,
    title: "Zero to Agent: Noida",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
    registrations: 396,
    attendees: 39,
    location: "Noida",
    bgColor: "bg-[#FFF9E6]"
  },
  {
    id: 2,
    title: "Nerds Meetup",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80",
    registrations: 1188,
    attendees: 55,
    location: "Gurugram",
    bgColor: "bg-[#E6F0FF]"
  },
  {
    id: 3,
    title: "Build with Cognee",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80",
    registrations: 237,
    attendees: 31,
    location: "PW IOI, Noida",
    bgColor: "bg-[#E6FFE6]"
  },
  {
    id: 4,
    title: "Web3 Builders Jam",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80",
    registrations: 512,
    attendees: 120,
    location: "Delhi",
    bgColor: "bg-[#F3E8FF]"
  },
  {
    id: 5,
    title: "AI Hackathon 2024",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80",
    registrations: 1450,
    attendees: 300,
    location: "Bangalore",
    bgColor: "bg-[#FFE4E6]"
  },
  {
    id: 6,
    title: "Designathon",
    image: "https://images.unsplash.com/photo-1492501553920-540736e4f323?w=600&auto=format&fit=crop&q=80",
    registrations: 890,
    attendees: 150,
    location: "Kolkata",
    bgColor: "bg-[#E0F2FE]"
  }
];

function Counter({ target, duration = 2 }: { target: number, duration?: number }) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  // Re-trigger animation when target changes (due to slide change)
  React.useEffect(() => {
    let startTimestamp: number;
    let animationFrame: number;
    
    setCount(0); // Reset count on target change

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * target));
      
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    
    animationFrame = window.requestAnimationFrame(step);

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}+</span>;
}

export function FlagshipEvents() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(events.length / itemsPerPage);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + itemsPerPage) % events.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const visibleEvents = events.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Our Flagship Events
          </h2>
          <p className="text-slate-500 font-medium">
            Our signature experiences that define excellence
          </p>
        </div>

        <div className="grid relative min-h-fit">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ gridArea: '1 / 1' }}
              className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 w-full py-12"
            >
              {visibleEvents.map((event, index) => {
                const isCenter = index === 1;
                return (
                  <div
                    key={event.id}
                    className={`relative w-full max-w-[320px] rounded-[24px] p-3 pt-6 pb-6 shadow-xl ${event.bgColor} border border-black/5 transform transition-transform ${isCenter ? 'md:translate-y-12' : 'md:-translate-y-6'}`}
                  >
                    <h3 className="text-xl font-bold text-slate-900 text-center mb-4 px-2 line-clamp-1">
                      {event.title}
                    </h3>
                    
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Floating Badges */}
                      <div className="absolute -bottom-2 -right-2 flex flex-col gap-2 p-4">
                        <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg border border-slate-100 flex items-center gap-1.5 ml-auto translate-x-2">
                          <span className="text-[#10b981] font-bold">
                            <Counter target={event.registrations} />
                          </span>
                          <span className="text-slate-600 text-sm font-medium">Registrations</span>
                        </div>
                        <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg border border-slate-100 flex items-center gap-1.5 ml-auto translate-x-2">
                          <span className="text-[#10b981] font-bold">
                            <Counter target={event.attendees} />
                          </span>
                          <span className="text-slate-600 text-sm font-medium">Attendees</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-slate-700 mt-8">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-semibold">{event.location}</span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
          
        {/* Slider indicator */}
        <div className="flex items-center justify-center gap-2 mt-20 relative z-10">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-500 ${
                Math.floor(currentIndex / itemsPerPage) === idx 
                ? 'w-10 bg-[#84CC16]' 
                : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
