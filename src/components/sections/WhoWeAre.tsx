'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    title: "Career Boost Workshop: Noida",
    subtitle: "GFG Office, Noida"
  },
  {
    src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    title: "Nerds Meetup",
    subtitle: "Gurugram"
  },
  {
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    title: "24-Hour Hackathon",
    subtitle: "Delhi NCR"
  }
];

export function WhoWeAre() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="who-we-are" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-[1250px]">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Animated Image Frame */}
          <div className="relative p-6 lg:p-8">
            {/* Dark Blue rotated background block */}
            <div className="absolute inset-2 bg-[#00308F] rounded-lg transform -rotate-2 scale-[0.98]"></div>
            
            {/* Image Container */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 border-[3px] border-[#00308F] shadow-2xl z-10 transform rotate-1 transition-transform hover:scale-[1.02]">
              <AnimatePresence>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <Image 
                    src={images[currentIndex].src}
                    alt={images[currentIndex].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Dark gradient at bottom for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  
                  {/* Image Caption */}
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="font-extrabold text-[17px] tracking-tight">{images[currentIndex].title}</h4>
                    <p className="text-[12px] text-gray-300 mt-1">{images[currentIndex].subtitle}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: Text Content */}
          <div className="space-y-10 lg:pl-4">
            <div className="space-y-4">
              <h2 className="font-heading text-5xl md:text-[68px] font-black text-[#00308F] leading-[1.05] tracking-[-0.03em]">
                WHO WE<br />ARE
              </h2>
              {/* Lime Green Line */}
              <div className="w-[180px] h-[6px] bg-[#84CC16]" />
            </div>

            <div className="space-y-6 max-w-[540px]">
              <div className="pl-5 border-l-[3px] border-[#00308F]">
                <p className="text-[16.5px] font-bold leading-relaxed text-[#1e293b]">
                  We are tired of boring corporate conferences. We wanted a space where the energy is practical, the people are building, and the ideas are raw.
                </p>
              </div>

              <p className="text-[16px] font-medium text-[#475569] leading-relaxed">
                From 24-hour hackathons to intense ideation jams, we've brought together hundreds of students across NCR to build things that actually matter.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-start gap-16 pt-4">
              <div className="text-center flex flex-col items-center">
                <div className="text-4xl md:text-[44px] font-black text-[#00308F] tracking-tight leading-none">8+</div>
                <div className="text-[9px] font-extrabold tracking-[0.15em] text-slate-500 mt-3 uppercase">Events Hosted</div>
              </div>
              <div className="w-[1px] h-10 bg-slate-200"></div>
              <div className="text-center flex flex-col items-center">
                <div className="text-4xl md:text-[44px] font-black text-[#00308F] tracking-tight leading-none">6,040+</div>
                <div className="text-[9px] font-extrabold tracking-[0.15em] text-slate-500 mt-3 uppercase">Builders</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
