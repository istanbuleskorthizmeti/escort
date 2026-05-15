'use client';

import React from 'react';
import { Pill, ArrowRight } from 'lucide-react';

export const ElitePromoBanner = () => {
  return (
    <div className="my-20 group">
      <div className="bg-linear-to-r from-zinc-900 to-black p-8 md:p-12 rounded-[3rem] border border-zinc-800 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden shadow-2xl">
        {/* Animated Background Element */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-rose-600/10 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
        
        {/* Icon / Visual */}
        <div className="w-24 h-24 bg-zinc-950 rounded-3xl flex items-center justify-center text-5xl shadow-glow-sm border border-zinc-900 group-hover:border-rose-600/30 transition-all duration-500 shrink-0">
          💊
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-[#ff8600]/10 text-[#ff8600] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-[#ff8600]/20">
             SINIRLI SÜRE: ELITE PROMOSYON
          </div>
          <h4 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">
            GECEYİ UZAT: <span className="text-[#ff8600]">ELITE DESTEK</span>
          </h4>
          <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-xl">
            Geciktirici & Afrodizyak Parfümlerde <span className="text-[#ff8600] font-black">%70 ÖZEL İNDİRİM</span> ile performansınızı zirvede tutun. Elit escortlarımızın gizli tercihi.
          </p>
        </div>

        {/* Action */}
        <a 
          href="https://t.me/istanbulescorthizmeti" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#ff8600] hover:text-white transition-all flex items-center gap-3 shadow-glow group-hover:shadow-glow-rose active:scale-95"
        >
          İNDİRİMİ YAKALA <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
