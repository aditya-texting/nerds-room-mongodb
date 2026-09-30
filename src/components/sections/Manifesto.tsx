import * as React from 'react';
import Image from 'next/image';

export function Manifesto() {
  return (
    <section className="pt-24 pb-8 bg-white relative flex justify-center px-4">
      <div className="max-w-3xl w-full bg-white rounded-3xl p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
          Dear Future Innovator,
        </h2>
        
        <div className="space-y-6 text-slate-700 text-base md:text-lg leading-relaxed">
          <p>
            The world is moving faster than ever. Standard education isn't keeping up. The old paths are crumbling.
          </p>
          
          <p className="font-bold text-slate-900">
            The truth is:
          </p>
          
          <p>
            No one knows exactly what the future looks like. But we know who will build it.
          </p>
          
          <p>
            At Nerds Room, we aren't just a community; we are an engine. An engine that turns raw potential into shipping products. We believe that the most valuable thing we can do is help each other create.
          </p>
          
          <p>
            We are here to make sense of this new era, one line of code at a time.
          </p>
          
          <p>
            Welcome to Nerds Room. Let's build the future we want to live in.
          </p>
        </div>

        <div className="mt-12 flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100">
            <Image
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shubhi"
              alt="Shubhi"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-orange-500 text-[15px]">Shubhi</h4>
            <p className="text-xs text-slate-500 font-medium">Founder</p>
          </div>
        </div>
      </div>
    </section>
  );
}
