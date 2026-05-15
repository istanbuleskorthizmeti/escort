"use client";

import { useEffect, useState } from "react";
import { Shield, Globe, Zap, CheckCircle } from "lucide-react";

export function PanicButton() {

  const handlePanic = () => {
    // Instant redirect to a safe site for privacy
    window.location.href = "https://www.accuweather.com/en/tr/istanbul/318251/weather-forecast/318251";
  };

  return (
    <button
      onClick={handlePanic}
      className="fixed bottom-8 left-8 z-100 bg-black/80 backdrop-blur-3xl border border-zinc-900 p-5 rounded-full hover:bg-rose-600 transition-all duration-700 group shadow-[0_0_50px_rgba(225,29,72,0.3)] hover:scale-110 active:scale-90 animate-slow-glow"
      title="Güvenli Çıkış (Hızlı Kapatma)"
    >
      <Shield className="w-6 h-6 text-rose-600 group-hover:text-white transition-all duration-500" />
    </button>
  );
}

export function GlobalBadge() {
  return (
    <div className="flex items-center gap-4 bg-black/60 backdrop-blur-3xl border border-zinc-900 px-6 py-3 rounded-full text-[10px] font-black tracking-[0.3em] text-zinc-100 uppercase italic shadow-glow-sm">
      <Globe className="w-4 h-4 text-rose-600 animate-pulse" />
      <span className="opacity-80">Escort Protocol: Global Destek</span>
      <div className="w-2 h-2 bg-rose-600 rounded-full shadow-[0_0_15px_#e11d48] animate-ping"></div>
    </div>
  );
}

export function LiveStatus({ neighborhood }: { neighborhood: string }) {
  const [count, setCount] = useState(2);

  useEffect(() => {
    // Simulate high-authority real-time availability with DRKCNAY Variance
    const timer = setInterval(() => {
      setCount((prev: number) => {
        const hour = new Date().getHours();
        const volatility = (hour > 20 || hour < 4) ? 4 : 2; // More active at night
        const change = Math.floor(Math.random() * (volatility * 2 + 1)) - volatility;
        const next = prev + change;
        return next < 3 ? 3 : next > 28 ? 28 : next;
      });
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-6 bg-black/80 backdrop-blur-3xl border border-zinc-900 p-8 rounded-[2.5rem] w-full lg:w-fit shadow-2xl group hover:border-rose-600 transition-all duration-1000">
      <div className="relative">
        <div className="absolute inset-0 bg-rose-600/20 blur-2xl rounded-full group-hover:bg-rose-600/40 transition-colors"></div>
        <Zap className="w-10 h-10 text-rose-600 fill-rose-600 relative z-10" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 rounded-full border-2 border-black z-20 animate-pulse"></div>
      </div>
      <div>
        <div className="text-[10px] font-black text-zinc-500 tracking-[0.4em] uppercase mb-1 italic">Escort Protocol: {neighborhood}</div>
        <div className="text-2xl font-black italic text-white tracking-tighter uppercase">
          {count} VIP PROFİL <span className="text-rose-600 drop-shadow-glow">AKTİF</span>
        </div>
        <div className="text-[10px] text-zinc-400 font-bold tracking-widest mt-1 opacity-60">TAHMİNİ ULAŞIM: ~12 DAKİKA</div>
      </div>
    </div>
  );
}

export function VerificationBadge() {
  return (
    <div className="flex items-center gap-2 text-rose-600 font-black italic text-[10px] tracking-tighter uppercase mb-2">
      <CheckCircle className="w-3 h-3 fill-rose-600 text-black" />
      <span>%100 Onaylı Vip</span>
    </div>
  );
}
