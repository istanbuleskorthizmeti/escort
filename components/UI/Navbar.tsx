"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Home, MapPin, ShieldCheck, Send, Menu, X, Trophy } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Ana Sayfa", href: "/", icon: Home },
    { name: "İlçeler", href: "/ilan/istanbul-escort", icon: MapPin },
    { name: "Katılım", href: "/katilim", icon: ShieldCheck },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-700 ${scrolled ? 'bg-black/80 backdrop-blur-3xl border-b border-rose-600/30 py-4 shadow-2xl shadow-rose-600/10' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* 💎 BRAND IDENTITY */}
        <Link href="/" className="group flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase leading-none group-hover:scale-105 transition-transform duration-500">DRKCNAY ELITE</span>
            <span className="text-3xl md:text-4xl font-black italic tracking-tighter text-rose-600 uppercase leading-none group-hover:scale-105 transition-transform duration-500">ESCORT</span>
          </div>
          <div className="text-[9px] font-black tracking-[0.5em] text-zinc-600 uppercase mt-2 group-hover:text-rose-600/50 transition-colors">DRKCNAY ELITE ESCORT AJANSI // VIP REHBER</div>
        </Link>


        {/* 🔱 DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
            >
              <link.icon className="w-4 h-4 text-zinc-800 group-hover:text-rose-600 transition-colors" />
              <span>{link.name}</span>
            </Link>
          ))}

          <Link
            href="https://t.me/istanbulescorthizmeti"
            target="_blank"
            className="rose-button px-10 py-4 rounded-full text-[11px] font-black flex items-center gap-3 shadow-glow-rose"
          >
            <Send className="w-4 h-4" />
            TELEGRAM ACCESS
          </Link>
        </nav>

        {/* 📱 MOBILE TOGGLE */}
        <button
          className="lg:hidden p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-white active:scale-90 transition-all shadow-xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} className="text-rose-600" /> : <Menu size={28} />}
        </button>
      </div>

      {/* 🔮 MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full glass-card border-t border-rose-600/20 p-10 flex flex-col gap-8 animate-fade-in-up">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-5 text-2xl font-black uppercase tracking-tighter text-zinc-300 hover:text-rose-600 transition-colors"
            >
              <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl">
                <link.icon className="w-6 h-6 text-rose-600" />
              </div>
              <span>{link.name}</span>
            </Link>
          ))}
          <Link
            href="https://t.me/istanbulescorthizmeti"
            className="rose-button p-8 rounded-[2rem] text-xl font-black flex items-center justify-center gap-4 mt-4 shadow-glow-rose"
          >
            <Send className="w-6 h-6" />
            VİTRİNE GİRİŞ YAP
          </Link>
        </div>
      )}
    </header>
  );
}
