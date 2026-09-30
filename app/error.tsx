'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid-pattern relative overflow-hidden">
      {/* Red error background gradient */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[128px] -z-10" />
      
      <div className="text-center space-y-6 relative z-10 p-4 max-w-lg mx-auto">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 shadow-[0_0_50px_-12px_rgba(239,68,68,0.3)] animate-pulse">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 font-heading">
          Runtime Exception
        </h1>
        
        <h2 className="text-xl font-medium text-foreground">
          Something went wrong in the system.
        </h2>
        
        <div className="p-4 bg-zinc-950/80 rounded-md border border-white/5 font-mono text-sm text-left shadow-inner overflow-hidden mt-6">
          <p className="text-red-400 truncate">
            &gt; {error.message || 'Internal Server Error'}
          </p>
        </div>
        
        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex h-12 items-center justify-center rounded-md bg-red-600 px-8 text-base font-medium text-white shadow transition-colors hover:bg-red-700"
          >
            <RefreshCcw className="mr-2 w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-background px-8 text-base font-medium shadow-sm transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <Home className="mr-2 w-4 h-4" /> Return to Base
          </Link>
        </div>
      </div>
    </div>
  );
}
