'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X, Bell, User, CalendarDays, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuthContext } from '@/src/providers/auth-provider';
import { apiClient } from '@/src/core/axios';
import toast from 'react-hot-toast';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Events', href: '/events' },
  { name: 'Chapters', href: '/chapters' },
  { name: 'Who We Are', href: '/#who-we-are' },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [activeHash, setActiveHash] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, clearUser } = useAuthContext();

  React.useEffect(() => {
    setMounted(true);
    setActiveHash(window.location.hash);
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {}
    clearUser();
    setDropdownOpen(false);
    toast.success('Logged out successfully');
    router.push('/');
  };

  // User initials avatar
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[760px] z-50 transition-all duration-300">
      <div className="relative h-[60px] flex items-center justify-between bg-white rounded-full px-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group mr-2">
          {/* Logo Icon */}
          <div className="relative flex items-center justify-center w-11 h-11 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden ml-1">
            <Image 
              src="/logo.jpg" 
              alt="NerdsRoom Logo" 
              fill
              className="object-cover"
              sizes="44px"
              priority
            />
          </div>
          {/* Logo Text */}
          <span className="font-heading font-black text-[22px] tracking-tighter text-[#00308F] hidden sm:block mt-1">
            nerds room<span className="text-[#84CC16]">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10 font-semibold text-[#00308F]">
          {navLinks.map((link) => {
            const isActive = link.href === '/'
              ? pathname === '/' && !activeHash
              : link.href.startsWith('#')
                ? activeHash === link.href
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setActiveHash(link.href.startsWith('#') ? link.href : '')}
                className={`relative text-[16px] tracking-tight transition-colors hover:text-[#84CC16] ${
                  isActive ? 'text-[#84CC16]' : ''
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              {/* User Avatar + Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-secondary transition-colors group"
                  aria-label="User menu"
                >
                  {/* Avatar circle with initials */}
                  <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">{initials}</span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-foreground/90 group-hover:text-white transition-colors max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground group-hover:text-white transition-all duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-52 bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-border/60">
                        <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>

                      {/* Menu items */}
                      <div className="py-1.5">
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          <User className="w-4 h-4 text-muted-foreground" />
                          My Profile
                        </Link>

                        <Link
                          href="/my-events"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          <CalendarDays className="w-4 h-4 text-muted-foreground" />
                          My Events
                        </Link>

                        {(user?.role === 'ORGANIZER' || user?.role === 'ADMIN') && (
                          user?.role === 'ORGANIZER' && user?.status === 'PENDING' ? (
                            <div className="flex items-center justify-between px-4 py-2.5 text-sm text-muted-foreground/60 cursor-not-allowed">
                              <span className="flex items-center gap-3">
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                              </span>
                              <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded border border-amber-500/20">Pending</span>
                            </div>
                          ) : (
                            <Link
                              href="/dashboard"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-secondary transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                              Dashboard
                            </Link>
                          )
                        )}

                      </div>

                      {/* Logout */}
                      <div className="border-t border-border/60 py-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* Guest — Sign In button replacing Partner button */
            <Link
              href="/login"
              className="hidden sm:inline-flex h-[40px] items-center justify-center rounded-xl bg-[#00308F] px-8 text-[16px] font-bold text-white shadow-sm hover:bg-[#002266] active:scale-95 transition-all duration-200"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {(user?.role === 'ORGANIZER' || user?.role === 'ADMIN') && (
                user?.role === 'ORGANIZER' && user?.status === 'PENDING' ? (
                  <span className="text-lg font-medium text-muted-foreground/60 cursor-not-allowed flex items-center gap-2">
                    Dashboard <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded border border-amber-500/20">Pending Approval</span>
                  </span>
                ) : (
                  <Link href="/dashboard" className="text-lg font-medium text-primary hover:text-primary/80" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                )
              )}

              {isAuthenticated && user ? (
                <>
                  <Link href="/profile" className="text-lg font-medium text-foreground hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                    My Profile
                  </Link>
                  <Link href="/my-events" className="text-lg font-medium text-foreground hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                    My Events
                  </Link>
                  <button onClick={handleLogout} className="text-left text-lg font-medium text-red-500 hover:text-red-400">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#00308F] px-6 text-base font-bold text-white shadow-sm hover:bg-[#002266] active:scale-[0.98] transition-all duration-200 mt-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
