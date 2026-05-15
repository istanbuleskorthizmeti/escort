"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-700 ${scrolled ? 'bg-black/80 backdrop-blur-3xl border-b border-rose-600/30 py-4 shadow-2xl shadow-rose-600/10' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">

        {/* 💎 BRAND IDENTITY - CENTERED */}
        <Link href="/" className="group flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none group-hover:scale-105 transition-transform duration-500">DRKCNAY ELITE</span>
            <span className="text-3xl md:text-5xl font-black italic tracking-tighter text-rose-600 uppercase leading-none group-hover:scale-105 transition-transform duration-500">ESCORT</span>
          </div>
          <div className="text-[10px] font-black tracking-[0.5em] text-zinc-500 uppercase mt-3 group-hover:text-rose-600/70 transition-colors">DRKCNAY ELITE ESCORT HİZMETLERİ // VIP REHBER</div>
        </Link>

      </div>
    </header>
  );
}
