"use client"
import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const columns = [
  // Col 1
  [
    { aspect: 'aspect-square', images: ['https://picsum.photos/seed/c1a1/400/400', 'https://picsum.photos/seed/c1a2/400/400'] },
    { aspect: 'aspect-[4/3]', images: ['https://picsum.photos/seed/c1b1/400/300', 'https://picsum.photos/seed/c1b2/400/300'] },
  ],
  // Col 2
  [
    { aspect: 'aspect-[4/5]', images: ['https://picsum.photos/seed/c2a1/400/500', 'https://picsum.photos/seed/c2a2/400/500'] },
    { aspect: 'aspect-square', images: ['https://picsum.photos/seed/c2b1/400/400', 'https://picsum.photos/seed/c2b2/400/400'] },
    { aspect: 'aspect-square', images: ['https://picsum.photos/seed/c2c1/400/400', 'https://picsum.photos/seed/c2c2/400/400'] },
  ],
  // Col 3
  [
    { aspect: 'aspect-[9/16]', images: ['https://picsum.photos/seed/c3a1/400/711', 'https://picsum.photos/seed/c3a2/400/711'] },
  ],
  // Col 4 (Center)
  [
    { aspect: 'aspect-[9/16]', images: ['https://picsum.photos/seed/c4a1/400/711', 'https://picsum.photos/seed/c4a2/400/711'] },
  ],
  // Col 5
  [
    { aspect: 'aspect-[9/16]', images: ['https://picsum.photos/seed/c5a1/400/711', 'https://picsum.photos/seed/c5a2/400/711'] },
  ],
  // Col 6
  [
    { aspect: 'aspect-square', images: ['https://picsum.photos/seed/c6a1/400/400', 'https://picsum.photos/seed/c6a2/400/400'] },
    { aspect: 'aspect-[4/3]', images: ['https://picsum.photos/seed/c6b1/400/300', 'https://picsum.photos/seed/c6b2/400/300'] },
    { aspect: 'aspect-square', images: ['https://picsum.photos/seed/c6c1/400/400', 'https://picsum.photos/seed/c6c2/400/400'] },
  ],
  // Col 7
  [
    { aspect: 'aspect-[4/5]', images: ['https://picsum.photos/seed/c7a1/400/500', 'https://picsum.photos/seed/c7a2/400/500'] },
    { aspect: 'aspect-square', images: ['https://picsum.photos/seed/c7b1/400/400', 'https://picsum.photos/seed/c7b2/400/400'] },
  ]
];

function AutoSlidingImage({ slotData, index }: { slotData: any, index: number }) {
  const [currentIdx, setCurrentIdx] = React.useState(0);

  React.useEffect(() => {
    // Add staggered delay based on index so they don't all change at the exact same time
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slotData.images.length);
    }, 3000 + (index * 500)); // Staggered interval

    return () => clearInterval(interval);
  }, [slotData.images.length, index]);

  return (
    <div className={`relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border-4 border-white ${slotData.aspect}`}>
      <AnimatePresence>
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slotData.images[currentIdx]}
            alt="Gallery Image"
            fill
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function PhotoGallery() {
  return (
    <section className="pt-4 pb-8 bg-white relative overflow-hidden">
      {/* Gallery Grid */}
      <div className="w-full max-w-[1600px] mx-auto px-4 mb-0">
        <div className="flex gap-4 md:gap-6 justify-center items-center h-[500px] md:h-[700px] overflow-hidden">
          {columns.map((col, colIdx) => {
            // Arch logic: center is highest, edges are lowest
            let marginClass = 'mt-8'; // default for 2 and 4
            if (colIdx === 3) marginClass = '-mt-12'; // Center (highest)
            if (colIdx === 1 || colIdx === 5) marginClass = 'mt-24 hidden md:flex'; // mid-outer
            if (colIdx === 0 || colIdx === 6) marginClass = 'mt-40 hidden xl:flex'; // edges (lowest)

            return (
            <div 
              key={colIdx} 
              className={`flex flex-col gap-4 md:gap-6 w-full max-w-[220px] ${marginClass}`}
            >
              {col.map((slot, slotIdx) => (
                <AutoSlidingImage key={`${colIdx}-${slotIdx}`} slotData={slot} index={colIdx * 10 + slotIdx} />
              ))}
            </div>
            );
          })}
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center relative z-10 px-4 -mt-12 md:-mt-24">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
          Photo Gallery
        </h2>
        <p className="text-slate-500 font-medium text-lg md:text-xl">
          A glimpse into our most memorable moments
        </p>
      </div>
    </section>
  );
}
