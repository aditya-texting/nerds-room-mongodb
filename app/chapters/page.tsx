'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Search, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const chapters = [
  {
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    members: 400,
    image: 'https://images.unsplash.com/photo-1590766740616-95a78a390224?w=600&h=400&fit=crop',
  },
  {
    name: 'Bangalore',
    state: 'Karnataka',
    members: 0,
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&h=400&fit=crop',
  },
  {
    name: 'Noida',
    state: 'Uttar Pradesh',
    members: 0,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop',
  },
  {
    name: 'Delhi',
    state: 'New Delhi',
    members: 0,
    image: 'https://images.unsplash.com/photo-1597040663342-45b6ba68fa28?w=600&h=400&fit=crop',
  },
  {
    name: 'Kolkata',
    state: 'West Bengal',
    members: 0,
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&h=400&fit=crop',
  },
];

export default function ChaptersPage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredChapters = chapters.filter(
    (ch) =>
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-48 pb-14 overflow-hidden bg-white">
        {/* Decorative skyline background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <Image
            src="/events-hero-bg.jpg"
            alt="Skyline Background"
            fill
            className="object-cover object-bottom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-black tracking-tight"
          >
            <span className="text-gray-900">City </span>
            <span className="text-[#00308F]">Chapters</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-500 font-medium mt-3 text-sm sm:text-base italic"
          >
            Growing stronger in cities near you.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 max-w-md mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search chapters by name, city or lead..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 bg-white text-sm text-gray-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00308F]/15 focus:border-[#00308F]/30 transition-all shadow-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chapters Grid */}
      <section className="pb-24 px-4">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          {filteredChapters.map((chapter, i) => (
            <Link key={chapter.name} href={`/chapters/${chapter.name}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-400 hover:-translate-y-1 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={chapter.image}
                    alt={chapter.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* City name watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-white/20 text-5xl sm:text-6xl font-black uppercase tracking-widest select-none">
                      {chapter.name}
                    </span>
                  </div>

                  {/* VIEW Button */}
                  <div className="absolute top-3 right-3">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00308F] text-white text-xs font-bold shadow-md hover:bg-[#002266] transition-colors pointer-events-none">
                      VIEW <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 pt-3.5">
                  <h3 className="text-base font-bold text-gray-900">{chapter.name}</h3>
                  <div className="flex flex-col gap-1 mt-1.5">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs font-medium">{chapter.state}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs font-medium">{chapter.members} members</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredChapters.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-slate-400 text-lg font-medium">No chapters found for &quot;{searchQuery}&quot;</p>
            <p className="text-slate-400 text-sm mt-2">Try a different city or state name.</p>
          </motion.div>
        )}
      </section>
    </div>
  );
}
