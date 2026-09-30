import Link from 'next/link';
import { ArrowLeft, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-grid-pattern relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-accent/20 rounded-full blur-[128px] -z-10" />
      
      <div className="text-center space-y-6 relative z-10 p-4">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 shadow-[0_0_50px_-12px_rgba(34,197,94,0.3)]">
            <Terminal className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-heading">
          System Not Found
        </h2>
        
        <p className="text-muted-foreground max-w-md mx-auto text-lg">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable in this directory.
        </p>
        
        <div className="pt-8">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Return to Base
          </Link>
        </div>
      </div>
    </div>
  );
}
