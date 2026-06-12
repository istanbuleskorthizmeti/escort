"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ThemeEngine } from "../../lib/theme-engine";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [brandName, setBrandName] = useState("DRKCNAY ELITE");
  const [slogan, setSlogan] = useState("VIP ESCORT HİZMETLERİ // VIP REHBER");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Resolve dynamic brand branding on mount
    const host = window.location.hostname;
    const theme = ThemeEngine.getTheme(host);
    setBrandName(theme.brandName);
    setSlogan(theme.slogan);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const firstWord = brandName.split(' ')[0] || "VIP";
  const restWords = brandName.split(' ').slice(1).join(' ') || "REHBER";

  return (
    <header className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-700 ${scrolled ? 'bg-black/80 backdrop-blur-3xl border-b border-[var(--primary-color)]/30 py-4 shadow-2xl' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">

        {/* 💎 BRAND IDENTITY - CENTERED */}
        <Link href="/" className="group flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none group-hover:scale-105 transition-transform duration-500">{firstWord}</span>
            <span className="text-3xl md:text-5xl font-black italic tracking-tighter text-[var(--primary-color)] uppercase leading-none group-hover:scale-105 transition-transform duration-500">{restWords}</span>
          </div>
          <div className="text-[10px] font-black tracking-[0.5em] text-zinc-500 uppercase mt-3 group-hover:text-[var(--primary-color)]/70 transition-colors">{slogan}</div>
        </Link>

      </div>
    </header>
  );
}
