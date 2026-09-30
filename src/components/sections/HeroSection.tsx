'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Terminal as TerminalIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Removed dynamic terminal steps in favor of exact static UI

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-24 lg:pb-32 overflow-hidden bg-grid-pattern">
      {/* Background gradients */}
      {/* Soft white glow behind text to wash out the grid */}
      <div className="absolute top-1/3 left-[-10%] w-[800px] h-[800px] bg-white rounded-full blur-[100px] -translate-y-1/2 -z-10" />
      {/* Lime glow behind terminal */}
      <div className="absolute top-1/2 right-[10%] w-[500px] h-[500px] bg-[#84CC16]/10 rounded-full blur-[120px] -translate-y-1/2 -z-10" />

      <div className="container mx-auto max-w-[1100px] px-6 md:px-8 flex flex-col lg:flex-row gap-8 lg:gap-4 items-center justify-between text-center lg:text-left relative z-10 mt-16 lg:mt-20">
        {/* Left Column: Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 flex-1 flex flex-col items-center lg:items-start max-w-[550px] relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#84CC16]/30 bg-[#84CC16]/10 text-sm font-bold text-secondary tracking-widest shadow-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#84CC16] shadow-[0_0_8px_2px_rgba(132,204,22,0.6)]" />
            THINK • CREATE • REPEAT
          </div>
          
          <h1 className="font-heading text-6xl md:text-7xl lg:text-[85px] font-black leading-[0.9] tracking-tighter flex flex-col mt-4">
            <span className="text-secondary">THINK.</span>
            <span className="text-[#84CC16] drop-shadow-[0_0_25px_rgba(132,204,22,0.6)] relative z-10">CREATE.</span>
            <span className="text-[#84CC16]">REPEAT.</span>
          </h1>
          
          <div className="space-y-4 max-w-[480px] mt-6">
            <p className="text-lg md:text-[20px] font-medium text-slate-700 leading-snug">
              A student-driven technology community creating real-world learning opportunities through hackathons, tech events, and hands-on initiatives.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-extrabold text-secondary border-[3px] border-secondary shadow-[4px_4px_0px_0px_rgba(0,48,143,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              JOIN COMMUNITY
            </Link>
            <Link
              href="#partner"
              className="inline-flex h-12 items-center justify-center rounded-xl border-[3px] border-secondary bg-white px-8 text-base font-extrabold text-secondary hover:bg-secondary/10 transition-colors"
            >
              PARTNER WITH US
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Terminal */}
        <div className="relative w-full lg:w-1/2 perspective-1000 mt-12 lg:mt-0 flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, rotateY: -10, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-[#061434] rounded-2xl shadow-[0_0_80px_-15px_rgba(0,48,143,0.3)] overflow-hidden flex flex-col font-mono w-full max-w-[480px]"
              >
                {/* Terminal Header */}
                <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-white/5 mx-2">
                  <div className="flex items-center text-[#6B7A99] text-[13px] gap-2 font-mono">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#84CC16]"></span>
                    nerds_room ~ terminal
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                </div>
                {/* Terminal Body */}
                <div className="px-8 py-6 text-sm whitespace-pre-wrap font-medium tracking-tight leading-relaxed text-left">
                  <div className="mb-3">
                    <span className="text-[#3B82F6]">user@nerdsroom:~$</span> <span className="text-zinc-100">npm install future</span>
                  </div>
                  <div className="mb-3 text-[#6B7A99] flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Installing packages...
                  </div>
                  <div className="mb-4 text-[#6B7A99]">
                    Found 5000+ builders
                  </div>
                  <div className="mb-3">
                    <span className="text-[#3B82F6]">user@nerdsroom:~$</span> <span className="text-zinc-100 font-bold">init_innovation.sh</span>
                  </div>
                  <div className="text-[#84CC16]">
                    &gt;&gt; Executing limitless potential... <span className="animate-pulse">_</span>
                  </div>
                </div>
              </motion.div>
        </div>
      </div>
    </section>
  );
}
