import React from 'react';
import { Star, ShieldCheck, Zap, Users, Heart } from 'lucide-react';

export function VIPBridge() {
  return (
    <div className="relative w-full py-32 overflow-hidden">
      {/* 🔮 NEON DEPTH */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-zinc-800/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-zinc-800/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16">
          
          <div className="flex flex-col items-center text-center gap-6 group">
            <div className="w-20 h-20 rounded-[2rem] bg-zinc-950/50 border border-zinc-900 flex items-center justify-center group-hover:border-rose-600/50 transition-all duration-700 group-hover:scale-110 shadow-2xl group-hover:shadow-rose-600/20">
              <ShieldCheck className="text-rose-600 w-8 h-8 group-hover:animate-glow-pulse" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white text-xl font-black tracking-tighter uppercase italic group-hover:text-rose-600 transition-colors">Kimlik Onaylı</span>
              <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] opacity-60 group-hover:opacity-100 transition-opacity">%100 Gerçek Modeller</span>
            </div>
          </div>

          <div className="flex flex-col items-center text-center gap-6 group">
            <div className="w-20 h-20 rounded-[2rem] bg-zinc-950/50 border border-zinc-900 flex items-center justify-center group-hover:border-rose-600/50 transition-all duration-700 group-hover:scale-110 shadow-2xl group-hover:shadow-rose-600/20">
              <Zap className="text-rose-600 w-8 h-8 group-hover:animate-glow-pulse" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white text-xl font-black tracking-tighter uppercase italic group-hover:text-rose-600 transition-colors">Hızlı Randevu</span>
              <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] opacity-60 group-hover:opacity-100 transition-opacity">Bekleme Yapmadan</span>
            </div>
          </div>

          <div className="flex flex-col items-center text-center gap-6 group">
            <div className="w-20 h-20 rounded-[2rem] bg-zinc-950/50 border border-zinc-900 flex items-center justify-center group-hover:border-rose-600/50 transition-all duration-700 group-hover:scale-110 shadow-2xl group-hover:shadow-rose-600/20">
              <Users className="text-rose-600 w-8 h-8 group-hover:animate-glow-pulse" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white text-xl font-black tracking-tighter uppercase italic group-hover:text-rose-600 transition-colors">Geniş Portföy</span>
              <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] opacity-60 group-hover:opacity-100 transition-opacity">Her Tarza Uygun</span>
            </div>
          </div>

          <div className="flex flex-col items-center text-center gap-6 group">
            <div className="w-20 h-20 rounded-[2rem] bg-zinc-950/50 border border-zinc-900 flex items-center justify-center group-hover:border-rose-600/50 transition-all duration-700 group-hover:scale-110 shadow-2xl group-hover:shadow-rose-600/20">
              <Heart className="text-rose-600 w-8 h-8 group-hover:animate-glow-pulse" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white text-xl font-black tracking-tighter uppercase italic group-hover:text-rose-600 transition-colors">Gizlilik</span>
              <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] opacity-60 group-hover:opacity-100 transition-opacity">%100 Veri Güvenliği</span>
            </div>
          </div>

        </div>
      </div>

      {/* 🪐 AMBIENT ORBS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-rose-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}
