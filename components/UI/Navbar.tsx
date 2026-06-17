"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ThemeEngine } from "../../lib/theme-engine";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [brandName, setBrandName] = useState("DRKCNAY VIP ESCORT AJANSI");
  const [slogan, setSlogan] = useState("VIP ESCORT HİZMETLERİ // VIP REHBER");
  const [logoIndex, setLogoIndex] = useState(0);
  const [primaryColor, setPrimaryColor] = useState("#d4af37");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Resolve dynamic brand branding on mount
    const host = window.location.hostname;
    const theme = ThemeEngine.getTheme(host);
    setBrandName(theme.brandName);
    setSlogan(theme.slogan);
    setPrimaryColor(theme.primaryColor || "#d4af37");

    // Hash host to get a unique logo index (0-3)
    let hash = 0;
    for (let i = 0; i < host.length; i++) {
      hash = (hash << 5) - hash + host.charCodeAt(i);
      hash |= 0;
    }
    setLogoIndex(Math.abs(hash) % 4);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const firstWord = brandName.split(' ')[0] || "VIP";
  const restWords = brandName.split(' ').slice(1).join(' ') || "REHBER";

  const renderLogo = () => {
    switch (logoIndex) {
      case 0:
        return (
          <svg className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-500 group-hover:rotate-12 shrink-0" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" fill={`${primaryColor}15`} />
            <path d="M3 20h18" />
          </svg>
        );
      case 1:
        return (
          <svg className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-500 group-hover:scale-110 shrink-0" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={`${primaryColor}15`} />
            <circle cx="12" cy="11" r="3" />
          </svg>
        );
      case 2:
        return (
          <svg className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-500 group-hover:scale-110 shrink-0" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12l4 6-10 12L2 9z" fill={`${primaryColor}15`} />
            <path d="M11 3l-4 6 5 12 5-12-4-6" />
            <path d="M2 9h20" />
          </svg>
        );
      case 3:
      default:
        return (
          <svg className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-500 group-hover:rotate-45 shrink-0" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={`${primaryColor}15`} />
          </svg>
        );
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-700 ${scrolled ? 'bg-black/80 backdrop-blur-3xl border-b border-(--primary-color)/30 py-4 shadow-2xl' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">

        {/* 💎 BRAND IDENTITY - CENTERED */}
        <Link href="/" className="group flex items-center gap-4 text-center">
          {renderLogo()}
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-4xl font-black italic tracking-tighter text-white uppercase leading-none group-hover:scale-[1.02] transition-transform duration-500">{firstWord}</span>
              <span className="text-2xl md:text-4xl font-black italic tracking-tighter text-(--primary-color) uppercase leading-none group-hover:scale-[1.02] transition-transform duration-500">{restWords}</span>
            </div>
            <div className="text-[9px] font-black tracking-[0.4em] text-zinc-500 uppercase mt-2 group-hover:text-(--primary-color)/70 transition-colors">{slogan}</div>
          </div>
        </Link>

      </div>
    </header>
  );
}
