'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Users, ArrowLeft, ArrowUpRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Mock data to match what we have in the main chapters page
const chaptersData: Record<string, any> = {
  lucknow: {
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    members: 400,
    image: 'https://images.unsplash.com/photo-1590766740616-95a78a390224?w=1920&h=1080&fit=crop',
  },
  bangalore: {
    name: 'Bangalore',
    state: 'Karnataka',
    members: 0,
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1920&h=1080&fit=crop',
  },
  noida: {
    name: 'Noida',
    state: 'Uttar Pradesh',
    members: 0,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&h=1080&fit=crop',
  },
  delhi: {
    name: 'Delhi',
    state: 'New Delhi',
    members: 0,
    image: 'https://images.unsplash.com/photo-1597040663342-45b6ba68fa28?w=1920&h=1080&fit=crop',
  },
  kolkata: {
    name: 'Kolkata',
    state: 'West Bengal',
    members: 0,
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=1920&h=1080&fit=crop',
  },
};

export default function ChapterDetailPage() {
  const params = useParams();
  const chapterNameRaw = Array.isArray(params?.chapterName) ? params.chapterName[0] : params?.chapterName;
  const chapterKey = chapterNameRaw ? (chapterNameRaw as string).toLowerCase() : '';
  
  const chapter = chaptersData[chapterKey] || {
    name: chapterNameRaw,
    state: 'India',
    members: 0,
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&h=1080&fit=crop', // fallback city image
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={chapter.image}
            alt={chapter.name}
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60" />
          
          {/* Fading bottom edge into background color */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />
        </div>

        {/* Huge background watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 opacity-20">
          <h1 className="text-[15vw] font-black text-white whitespace-nowrap tracking-widest uppercase">
            {chapter.name}
          </h1>
        </div>

        <div className="container mx-auto px-4 relative z-20 pt-20">
          <div className="max-w-4xl">
            {/* Back Link */}
            <Link 
              href="/chapters" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-xs font-bold tracking-widest uppercase mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Chapters
            </Link>

            {/* Badge */}
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-[#A3E635] text-[#166534] text-xs font-bold uppercase tracking-wider">
                City Chapter
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight mb-6">
              {chapter.name}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10">
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-5 h-5" />
                <span className="text-base font-medium">{chapter.state}</span>
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/40" />
              <div className="flex items-center gap-2 text-white/90">
                <Users className="w-5 h-5" />
                <span className="text-base font-medium">{chapter.members} members</span>
              </div>
            </div>

            {/* CTA */}
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#A3E635] text-[#166534] font-bold text-sm hover:bg-[#84CC16] transition-colors shadow-[0_0_20px_rgba(163,230,53,0.3)]">
              JOIN OUR CHAPTER <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 relative z-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-black text-gray-900 mb-10">
            Upcoming Events
          </h2>

          {/* Empty State */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No upcoming events at this time.
            </h3>
            <p className="text-slate-500 font-medium">
              Check back soon — we're cooking up something epic.
            </p>
          </motion.div>

          {/* Chapter Info Sections */}
          <div className="mt-16 flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow"
            >
              <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">About Us</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow"
            >
              <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">How We Gather</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow"
            >
              <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Our Values</h3>
            </motion.div>
          </div>

          {/* Bottom Back Button */}
          <div className="mt-20 flex justify-center">
            <Link 
              href="/chapters"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00308F] text-white font-bold text-sm hover:bg-[#002266] transition-colors shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" /> BACK TO CHAPTERS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
