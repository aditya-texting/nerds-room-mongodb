import Link from 'next/link';
import { ArrowRight, TerminalSquare } from 'lucide-react';

export function JoinCommunityCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary to-accent rounded-[100%] blur-[100px] opacity-20 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-secondary/80 backdrop-blur-xl border border-border/60 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-br-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/20 rounded-tl-full blur-2xl" />

          <TerminalSquare className="w-12 h-12 text-primary mx-auto mb-6" />
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
            Ready to Build the Future?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of developers, designers, and innovators. Whether you're looking to participate in your first hackathon or host a global competition, Nerds Room is your launchpad.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold text-lg hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Join for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/#events" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-secondary border border-border/60 text-foreground font-bold text-lg hover:bg-secondary/60 hover:border-border transition-all duration-200"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
