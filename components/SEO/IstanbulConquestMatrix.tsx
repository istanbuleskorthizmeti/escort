import React from 'react';
import Link from 'next/link';
import { ISTANBUL_DISTRICTS } from '@/lib/istanbul-aggressive-seo';
import { slugify } from '@/lib/utils';

/**
 * 💣 ISTANBUL CONQUEST MATRIX v1.0
 * Massive link hub for dominating all 39 Istanbul districts.
 * Powered by Gemini Ultra Semantic Hooks.
 */
export function IstanbulConquestMatrix() {
  return (
    <section className="relative py-32 px-6 bg-zinc-950/40 border-y border-zinc-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-16">
          
          <div className="flex flex-col gap-6 text-center">
            <div className="inline-flex items-center gap-3 bg-rose-600/10 border border-rose-600/20 px-6 py-2 rounded-full w-fit mx-auto">
              <span className="w-2 h-2 bg-rose-600 rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-600 italic">İSTANBUL HİZMET REHBERİ // 2026</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
              İSTANBUL <span className="text-rose-600">BÖLGELERİ</span>
            </h2>
            <p className="text-zinc-500 text-sm md:text-base font-medium max-w-2xl mx-auto">
              DRKCNAY ESCORT ağı, İstanbul'un 39 ilçesinde tam hakimiyet kurarak kaporasız ve %100 gerçek escort deneyimini her mahalleye taşıyor. 
              Aşağıdaki bölgelerden size en yakın olanı seçerek elit escort ajansı hizmetimize anında ulaşabilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ISTANBUL_DISTRICTS.map((district, index) => (
              <Link 
                key={district}
                href={`/istanbul/${slugify(district)}`}
                className="group relative p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl transition-all duration-500 hover:bg-rose-600/5 hover:border-rose-600/30 overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-20 transition-opacity">
                  <span className="text-4xl font-black italic uppercase text-white">{district.slice(0, 2)}</span>
                </div>
                <div className="relative z-10 flex flex-col gap-2">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-rose-600 transition-colors">
                    {index % 3 === 0 ? "Rus Escort" : index % 3 === 1 ? "Üniversiteli Escort" : "VIP Escort"}
                  </span>
                  <span className="text-white text-lg font-black italic uppercase tracking-tighter group-hover:translate-x-2 transition-transform duration-500">
                    {district} <span className="text-rose-600">ESCORT</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 p-10 bg-black/60 border border-zinc-800 rounded-[3rem] backdrop-blur-3xl text-center">
            <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed">
              Tüm bölgelerde "God Mode" semantik analizler ve kaporasız işlem garantisi aktiftir. 
              (Kaynak: DRKCNAY 2026 İstanbul Otorite Endeksi).
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
