"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ShieldCheck } from 'lucide-react';
import { vitrinImages } from '../../lib/vitrin-images';
import { siteConfig } from '../../config/site';
import { slugify } from '../../lib/utils';
import { generateGoldenAlt } from '../../lib/seo/traffic-monster';

export function DorukVitrin({ city = 'İstanbul' }: { city?: string }) {
  const [isMounted, setIsMounted] = useState(false);
  
  // 🛡️ [GOD-MODE] SSR-SAFE SELECTION
  // We use a deterministic slice for the initial server render to avoid hydration mismatch
  const initialImages = useMemo(() => {
    return vitrinImages.slice(0, 20);
  }, []);

  const [displayedImages, setDisplayedImages] = useState<any[]>(initialImages);

  useEffect(() => {
    setIsMounted(true);
    // 🛡️ [HYDRA-DIVERSIFY] Optimized for Mobile Performance
    // Instead of 60, we load 20 high-quality images initially to satisfy PageSpeed LCP metrics
    const shuffled = [...vitrinImages].sort(() => Math.random() - 0.5);
    setDisplayedImages(shuffled.slice(0, 20));
  }, []);

  // Show at least the initial 20 images even before hydration
  const imagesToRender = isMounted ? displayedImages : initialImages;

  if (!imagesToRender || imagesToRender.length === 0) return null;

  return (
    <div className="w-full bg-black text-zinc-100 py-16 px-4 md:px-0 font-sans select-none overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col">
        
        {/* 🔱 GRID HEADER: CONTEXTUAL AUTHORITY */}
        <div className="flex items-center justify-between mb-12 border-b border-zinc-900 pb-8">
           <div className="flex items-center gap-4">
              <ShieldCheck className="text-rose-600 w-8 h-8" />
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">
                {city.toUpperCase()} <span className="text-rose-600">VİP VİTRİN</span>
              </h2>
           </div>
           <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
              🛡️ %100 GERÇEK VE ONAYLI PROFİLLER
           </div>
        </div>

        {/* 🔱 PROFILE GRID: GOD MODE MAPPING */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 w-full">
          {imagesToRender.map((item, idx) => {
            if (!item || !item.src) return null;
            const firstName = (item.title || 'VIP').split(' ')[0];
            const profileSlug = slugify(firstName);
            
            // 🔥 AGGRESSIVE SEO NICHES
            const niches = ['Rus Model', 'Üniversiteli', 'Sarışın', 'Olgun Lady', 'Analiz Edilmiş', 'VIP Model', 'Kaporasız', 'Manken'];
            const niche = niches[idx % niches.length];
            const isOnline = (idx + (isMounted ? 1 : 0)) % 3 === 0;

            // 🔥 SEO-OPTIMIZED IMAGE PATHS
            const imageName = item.src.split('/').pop() || '';
            const imageId = imageName.replace(/[^0-9]/g, '').slice(0, 5) || idx;
            const seoImagePath = `${siteConfig.cdnUrl}/${slugify(city)}-kaporasiz-escort-bayan-${imageId}.webp`;
            const altTag = generateGoldenAlt(city);

            const handleTrack = () => {
              fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileName: firstName }),
              }).catch(() => {});
            };

            return (
              <div key={`${idx}-${isMounted}`} className="glass-card flex flex-col group rounded-[2.5rem] overflow-hidden border-zinc-900/50 hover:border-rose-600/40 transition-all duration-700 shadow-2xl bg-zinc-950/20">
                
                {/* Image Container */}
                <Link href={`/profile/${profileSlug}`} title={`${firstName} ${city} ${niche} Escort Detaylı Profil`} className="relative flex-1 block overflow-hidden aspect-[3/4.5]">
                  <Image 
                    src={seoImagePath} 
                    alt={altTag}
                    title={`${firstName} | ${city} ${niche} Elite Model | %100 Gerçek ve Kaporasız`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    priority={idx < 4}
                    className="object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out grayscale-[0.3] group-hover:grayscale-0"
                    onError={(e: any) => {
                      // Fallback to original path if SEO alias fails
                      e.target.src = item.src.startsWith('http') ? item.src : `${siteConfig.cdnUrl}${item.src}`;
                    }}
                  />
                  
                  {/* Status Badges */}
                  <div className="absolute top-5 left-5 flex flex-col gap-2 z-20">
                    <div className="bg-black/60 backdrop-blur-xl text-rose-600 text-[9px] font-black px-4 py-1.5 rounded-full border border-rose-600/30 uppercase tracking-[0.2em]">
                       VERIFIED
                    </div>
                    {isOnline && (
                      <div className="bg-emerald-500/20 backdrop-blur-xl text-emerald-400 text-[9px] font-black px-4 py-1.5 rounded-full border border-emerald-500/30 uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> ONLINE
                      </div>
                    )}
                  </div>

                  {/* Profile Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-linear-to-t from-black via-black/90 to-transparent z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="text-white font-black italic text-2xl uppercase tracking-tighter group-hover:text-rose-600 transition-colors duration-500">
                      {firstName}
                    </div>
                    <div className="text-rose-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2 opacity-80 flex items-center gap-2">
                      <span className="w-1 h-1 bg-rose-600 rounded-full" /> {niche} // {city.toUpperCase()}
                    </div>
                  </div>
                </Link>

                {/* 🟢 WHATSAPP ACTION BUTTON */}
                <a 
                  href={`${siteConfig.contact.whatsappLink}?text=Merhaba ${firstName}, seni ${city} vitrininde gördüm, randevu almak istiyorum.`}
                  onClick={handleTrack}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-950 hover:bg-rose-600 text-zinc-500 hover:text-white p-6 text-center text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-500 italic border-t border-zinc-900 group-hover:border-rose-600/50"
                >
                  <MessageCircle className="w-4 h-4" />
                  WHATSAPP'TAN YAZ
                </a>
              </div>
            );
          })}
        </div>

        {/* 🚀 GLOBAL CTA */}
        <div className="mt-20 mb-32 flex justify-center">
          <Link 
            href={siteConfig.contact.whatsappLink} 
            className="rose-button px-20 py-8 rounded-[2.5rem] text-xl font-black shadow-glow-rose group relative overflow-hidden"
          >
             <span className="relative z-10 flex items-center gap-4">
                TÜM KATALOĞU GÖR VE RANDEVU AL <span className="opacity-50 tracking-tighter">>>></span>
             </span>
             <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </Link>
        </div>

      </div>
    </div>
  );
}
