'use client';

import * as React from 'react';
import Image from 'next/image';

const partners = [
  { name: 'Github', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  { name: 'Vercel', logo: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png' },
  { name: 'Supabase', logo: 'https://supabase.com/_next/image?url=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F54469796&w=96&q=75' },
  { name: 'TailwindCSS', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg' },
  { name: 'Next.js', logo: 'https://cdn.worldvectorlogo.com/logos/next-js.svg' },
  { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original-wordmark.svg' },
];

export function TrustedPartners() {
  return (
    <section className="py-12 border-y border-border/50 bg-secondary/5 dark:bg-secondary/10 overflow-hidden relative">
      <div className="container mx-auto px-4 text-center mb-8">
        <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Supported by Leading Tech
        </p>
      </div>

      {/* Infinite scrolling marquee */}
      <div className="flex relative w-[200%] md:w-full overflow-hidden">
        <div className="flex w-max min-w-full justify-around items-center gap-16 md:gap-24 animate-[marquee-left_30s_linear_infinite]">
          {[...partners, ...partners].map((partner, idx) => (
            <div
              key={`${partner.name}-${idx}`}
              className="flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
            >
              <div className="relative w-32 h-12">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
