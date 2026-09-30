import Image from 'next/image';
import { Terminal, Users, Cpu, Rocket } from 'lucide-react';

export function AboutHero() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wide uppercase">
              <Terminal className="w-4 h-4" />
              The Nerds Room Story
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
              Building the Future of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-accent">Tech Communities.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              We started with a simple belief: the best way to learn is to build, and the best way to build is together. Today, Nerds Room is the central hub for the most innovative minds on the internet.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 pt-6">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Community First</h4>
                  <p className="text-sm text-muted-foreground mt-1">Built by developers, for developers, putting community above all.</p>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Cpu className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Innovation Core</h4>
                  <p className="text-sm text-muted-foreground mt-1">Driving technological advancement through collaborative building.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image/Visual Content */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border/50 bg-secondary/50 backdrop-blur-sm p-2">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image 
                  src="/about-us-hero.jpg" 
                  alt="Nerds Room Innovation Lab" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {/* Overlay gradient for dark mode aesthetics */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent mix-blend-multiply" />
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-background/80 backdrop-blur-md border border-border shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Innovate with us</p>
                    <p className="text-xs text-muted-foreground">The future is being built here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
