"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { vitrinImages } from '../../lib/vitrin-images';
import { generateGoldenAlt, shuffleArray } from '../../lib/seo/traffic-monster';
import { slugify } from '../../lib/utils';

const REDIRECT_URL = "https://dorukcanay.digital/go";

export function VitrinWall({ city = 'İstanbul', layoutType = 'grid' }: { city?: string, layoutType?: 'grid' | 'carousel' }) {
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [currentNiches, setCurrentNiches] = useState<string[]>([]);

  useEffect(() => {
    // 🛡️ [HYDRA-DIVERSIFY] Generate deterministic seed based on hostname
    const host = typeof window !== 'undefined' ? window.location.hostname : 'default';
    const seed = host.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    if (vitrinImages && vitrinImages.length > 0) {
      const baseIndices = [...Array(vitrinImages.length)].map((_, i) => i);
      
      // Deterministic shuffle using seed
      const seededShuffle = (array: number[], seedValue: number) => {
        let m = array.length, t, i;
        while (m) {
          i = Math.floor(((seedValue * m) % 1) * m--);
          t = array[m];
          array[m] = array[i];
          array[i] = t;
          seedValue = (seedValue * 9301 + 49297) % 233280 / 233280;
        }
        return array;
      };

      const uniqueIndices = seededShuffle([...baseIndices], seed / 1000);
      setShuffledIndices(uniqueIndices.slice(0, 60));
    }

    const niches = [
      'İSTANBUL VIP ESCORT', 'ÖZEL BİREYSEL PARTNER', 'EVE GELEN LÜKS ESCORT',
      'OTELE GELEN MODEL', 'ÜNİVERSİTELİ ÇITIR ESCORT', 'RUS VIP MODEL',
      'UKRAYNALI GENÇ PARTNER', 'ANALİZ EDİLMİŞ ESCORTLAR', 'KAPORASIZ GÜVENİLİR HİZMET',
      '7/24 AKTİF VIP SERVİS', 'LUXURY PARTNER EXPERIENCE', 'GERÇEK GÖRSELLİ MODELLER',
      'VIP ESCORT NUMARALARI', 'EN İYİ İSTANBUL ESCORT', 'BİREYSEL LÜKS PARTNER',
      'GENÇ VE GÜZEL BAYANLAR', 'ESKORT İSTANBUL VIP', 'MODEL STANDARTLARINDA'
    ];
    setCurrentNiches(shuffleArray(niches));
  }, []);

  if (shuffledIndices.length === 0) return null;

  const containerClass = layoutType === 'carousel' 
    ? "flex overflow-x-auto gap-4 p-4 mt-12 snap-x snap-mandatory hide-scrollbar" 
    : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10 p-4 mt-12";

  return (
    <section 
      className="w-full relative py-16 md:py-24 bg-zinc-950/20 backdrop-blur-3xl rounded-[4rem] border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden mb-20"
      style={{ backgroundColor: 'rgba(5, 5, 5, 0.8)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(225,29,72,0.08),transparent)] pointer-events-none"></div>
      
      <div className="px-10 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter mb-3 leading-none">
            DRKCNAY <span className="text-[var(--brand-color)]">ELITE</span> <span className="text-zinc-700">VİTRİN</span>
          </h2>
          <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-2 justify-center md:justify-start">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
             {city} BÖLGESİ ONAYLI MODELLER // LUXURY SELECTION
          </p>
        </div>
        <div className="hidden md:flex gap-4">
           <div className="bg-zinc-900/50 border border-zinc-800 px-6 py-3 rounded-2xl text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              GÜNLÜK AKTİF: 120+
           </div>
        </div>
      </div>

      <div className={containerClass}>
        {shuffledIndices.map((originalIndex, index) => {
          const item = vitrinImages[originalIndex];
          const imageName = item.src.split('/').pop() || '';
          const imageId = imageName.replace(/[^0-9]/g, '').slice(0, 5) || index;
          const seoImagePath = `/${slugify(city)}-vip-escort-ilan-${imageId}.webp`;
          const altTag = generateGoldenAlt(city);
          
          const dynamicNiche = currentNiches.length > 0 ? currentNiches[index % currentNiches.length] : `${city} Escort`;
          const slug = (imageName || '').replace('.jpg', '').replace('.webp', '').replace('.png', '').replace('.gif', '');
          
          return (
            <div 
              key={index} 
              className="relative group border border-zinc-900 rounded-dynamic overflow-hidden bg-black aspect-[3/4] shadow-2xl transition-all duration-1000 hover:-translate-y-4 hover:shadow-[var(--brand-color)]/20 hover:border-[var(--brand-color)]/30"
            >
              {/* Luxury Hover Overlay */}
              <div className="absolute inset-0 bg-[var(--brand-color)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-5"></div>

              {/* Main Card Link */}
              <Link href={`/p/${slug}`} className="absolute inset-0 z-20" prefetch={false} title={`${altTag} Profil Detayı`}>
                 <span className="sr-only">{dynamicNiche} Profili İncele</span>
              </Link>

              <div className="relative w-full h-full">
                <Image 
                  src={seoImagePath} 
                  alt={altTag}
                  title={`${altTag} | DRKCNAY ELITE`}
                  fill
                  className="object-cover group-hover:scale-110 transition-all duration-1000 ease-in-out"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={index < 8}
                  onError={(e: any) => {
                    e.target.src = item.src; // Fallback
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-90"></div>
              </div>
              
              {/* Premium Card Info */}
              <div className="absolute inset-x-0 bottom-0 p-6 z-30 flex flex-col items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-2 drop-shadow-2xl opacity-80 group-hover:opacity-100 group-hover:text-rose-500 transition-all">
                  {dynamicNiche}
                </div>
                
                <div className="h-0 group-hover:h-12 opacity-0 group-hover:opacity-100 transition-all duration-700 w-full flex justify-center overflow-hidden">
                    <a 
                      href={REDIRECT_URL}
                      className="pointer-events-auto bg-white text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[var(--brand-color)] hover:text-white transition-all"
                    >
                      <svg width="12" height="12" className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                      REZEVASYON
                    </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
