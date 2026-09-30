'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

const chapters = [
  "DELHI.",
  "KOLKATA.",
  "LUCKNOW.",
  "BANGALORE.",
  "NOIDA.",
];

export function Chapters() {
  return (
    <section className="py-20 bg-white relative overflow-hidden border-b border-gray-100">
      <div className="container mx-auto px-4 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
          <span className="text-gray-900">Our </span>
          <span className="text-[#00308F]">Chapters</span>
        </h2>
        <p className="text-slate-500 font-medium mt-3 text-sm md:text-base">
          Growing stronger in cities near you
        </p>
      </div>

      <div className="relative flex overflow-x-hidden">
        {/* Left and Right gradients for fading effect */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-left whitespace-nowrap flex items-center py-4">
          {[...chapters, ...chapters, ...chapters, ...chapters].map((chapter, index) => (
            <span
              key={index}
              className="mx-8 md:mx-12 text-3xl md:text-[40px] font-black text-slate-800 tracking-tight"
            >
              {chapter}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
