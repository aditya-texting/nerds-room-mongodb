'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTelegramPlane, FaInstagram, FaLinkedinIn, FaDiscord, FaWhatsapp } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-[#1e1e21] text-white pt-20 pb-8 mt-4 rounded-t-[3rem] shadow-2xl relative z-10 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Logo and Tagline (Col span 4) */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-32">
                <Image
                  src="/logo.jpg"
                  alt="Nerds Room Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xs font-medium">
              Empowering developers to build, learn, and grow together in the tech community.
            </p>
          </div>

          {/* About (Col span 2) */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <h4 className="font-bold text-white text-base">About</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-300">
              <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#events" className="hover:text-white transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* Resources (Col span 3) */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <h4 className="font-bold text-white text-base">Resources</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-300">
              <li><Link href="#who-we-are" className="hover:text-white transition-colors">Who We Are</Link></li>
              <li><Link href="#gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="#testimonials" className="hover:text-white transition-colors">Testimonials</Link></li>
            </ul>
          </div>

          {/* Join the Movement (Col span 3) */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <h4 className="font-bold text-white text-base">Join the Movement</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-300">
              <li>
                <a href="#" className="flex items-center gap-3 hover:text-white transition-colors">
                  <FaWhatsapp className="w-4 h-4" />
                  Join our WhatsApp Channel
                </a>
              </li>
              <li>
                <a href="https://discord.gg/nerdsroom" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                  <FaDiscord className="w-4 h-4" />
                  Join us on Discord
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/nerds.room/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                  <FaInstagram className="w-4 h-4" />
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/nerds-room/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                  <FaLinkedinIn className="w-4 h-4" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://t.me/nerdsroom" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                  <FaTelegramPlane className="w-4 h-4" />
                  Join us on Telegram
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
          <p>© Nerds Room. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
