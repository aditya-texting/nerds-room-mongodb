import { Users, Code, Globe2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function WhyNerdsRoom() {
  return (
    <section className="py-24 bg-background relative overflow-hidden" id="why-nerds-room">
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Image with frame */}
          <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden group">
            <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-multiply" />
            <Image 
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80" 
              alt="Nerds Room Community" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Floating Glass Card */}
            <div className="absolute bottom-8 left-8 right-8 bg-background/80 backdrop-blur-xl border border-border p-6 rounded-2xl z-20 shadow-2xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
              <p className="font-bold text-foreground text-lg mb-2">Built by Students, for Students</p>
              <p className="text-sm text-muted-foreground">Join the fastest growing tech community focused on real-world building.</p>
            </div>
          </div>

          {/* Right: Content & Stats */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-sm font-bold text-secondary border border-secondary/20">
              WHO WE ARE
            </div>
            
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
              Empowering the Next <br className="hidden lg:block"/> Generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary dark:from-primary dark:to-secondary">Builders.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nerds Room is a student-driven technology community where innovation meets collaboration. We believe in learning by doing, breaking things to understand them, and building solutions for real-world problems.
            </p>

            <div className="grid grid-cols-2 gap-8 py-8 border-y border-border/50">
              <div>
                <div className="flex items-center gap-3 mb-2 text-primary">
                  <Users className="w-5 h-5" />
                  <span className="font-bold text-3xl text-foreground">5000+</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Members</p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2 text-secondary">
                  <Code className="w-5 h-5" />
                  <span className="font-bold text-3xl text-foreground">50+</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Hackathons</p>
              </div>
            </div>

            <div>
              <Link
                href="/about-us"
                className="inline-flex h-12 items-center justify-center rounded-md bg-secondary text-secondary-foreground px-8 text-base font-bold shadow-lg shadow-secondary/20 transition-all hover:bg-secondary/90 hover:-translate-y-1"
              >
                Learn More About Us
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
