"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isEventsPage = pathname?.startsWith('/events');
  const isChaptersPage = pathname?.startsWith('/chapters');
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';
  const isHomePage = pathname === '/';

  return (
    <>
      {!isDashboard && <Header />}
      <main className={`flex-1 flex flex-col ${!isDashboard && !isEventsPage && !isChaptersPage && !isAuthPage && !isHomePage ? 'pt-20' : ''}`}>
        {children}
      </main>
      {!isDashboard && <Footer />}
    </>
  );
}
