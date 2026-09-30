import * as React from 'react';
import { FaTelegramPlane, FaInstagram, FaLinkedinIn, FaDiscord, FaWhatsapp } from 'react-icons/fa';

const socialLinks = [
  {
    name: "Join us on Telegram",
    icon: <FaTelegramPlane className="w-4 h-4" />,
    href: "https://t.me/nerdsroom",
  },
  {
    name: "Follow us on Instagram",
    icon: <FaInstagram className="w-4 h-4" />,
    href: "https://www.instagram.com/nerds.room/",
  },
  {
    name: "Follow us on LinkedIn",
    icon: <FaLinkedinIn className="w-4 h-4" />,
    href: "https://www.linkedin.com/company/nerds-room/"
  },
  {
    name: "Join us on Discord",
    icon: <FaDiscord className="w-4 h-4" />,
    href: "https://discord.gg/nerdsroom",
  },
  {
    name: "Join our WhatsApp Channel",
    icon: <FaWhatsapp className="w-4 h-4" />,
    href: "#",
  }
];

export function JoinCommunity() {
  return (
    <section className="py-20 bg-[#f4f7f0] flex flex-col items-center justify-center text-center">
      <div className="container mx-auto px-4 w-full max-w-[1400px]">
        <h2 className="text-4xl md:text-5xl font-black text-[#00308F] tracking-tight mb-4">
          Join our Community
        </h2>
        <p className="text-slate-600 font-medium mb-10">
          Connect with builders, designers, and innovators
        </p>

        {/* Changed to flex-col on mobile, flex-row on desktop without wrapping so they stay in one line */}
        <div className="flex flex-col xl:flex-row justify-center items-center gap-3 md:gap-4 w-full">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
            >
              {link.icon}
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
