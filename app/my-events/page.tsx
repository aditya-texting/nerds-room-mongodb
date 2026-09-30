import { CalendarClock, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'My Events – Coming Soon | NerdsRom',
  description: 'Your events page is coming soon.',
};

export default function MyEventsPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        {/* Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <CalendarClock className="w-12 h-12 text-primary" />
          </div>
          <span className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </span>
        </div>

        {/* Badge */}
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
          Coming Soon
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3 leading-tight">
          My Events is <br className="hidden sm:block" />
          On Its Way
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed mb-8">
          Soon you&apos;ll be able to see all the events you&apos;ve registered for, track your team applications, and manage your participation — all in one place.
        </p>

        {/* Progress bar animation */}
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: '45%', animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }}
          />
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/events"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
          >
            Browse Events
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
