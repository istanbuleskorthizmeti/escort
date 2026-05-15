"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ShieldCheck, Home, User, CalendarHeart, AlertTriangle } from 'lucide-react';
import { vitrinImages } from '../../lib/vitrin-images';
import { slugify } from '../../lib/utils';
import { generateGoldenAlt } from '../../lib/seo/traffic-monster';
import { getActiveProfiles } from '../../app/actions/vitrin';
import { siteConfig } from '../../config/site';

export function DorukVitrin({ city = 'İstanbul', isEmbed = false, host }: { city?: string, isEmbed?: boolean, host?: string }) {
  const [isMounted, setIsMounted] = useState(false);
  
  // 🛡️ [GOD-MODE] SSR-SAFE SELECTION
  // We use a deterministic slice for the initial server render to avoid hydration mismatch
  const initialImages = useMemo(() => {
    return vitrinImages.slice(0, 20);
  }, []);

  const [displayedImages, setDisplayedImages] = useState<any[]>(initialImages);

  useEffect(() => {
    setIsMounted(true);
    
    // Fetch DB profiles
    getActiveProfiles().then((dbProfiles) => {
      // Map DB profiles
      const masters = dbProfiles.map(m => ({
        title: m.name,
        src: m.image,
        phone: m.phone,
        niche: m.niche
      }));
      
      // Filter out images from the pool that match DB profiles
      const pool = vitrinImages.filter(img => !masters.some(m => m.src === img.src));
      
      setDisplayedImages([...masters, ...pool.slice(0, Math.max(0, 20 - masters.length))]);
    }).catch(e => {
      // Fallback if DB fetch fails
      setDisplayedImages(vitrinImages.slice(0, 20));
    });
  }, []);

  // Show at least the initial 20 images even before hydration
  const imagesToRender = isMounted ? displayedImages : initialImages;

  if (!imagesToRender || imagesToRender.length === 0) return null;

  return (
    <div 
      className="w-full text-zinc-100 pb-20 pt-8 font-sans select-none overflow-hidden relative" 
      style={{ 
        backgroundImage: 'radial-gradient(circle at 50% 0%, #2a081a 0%, #050204 60%)', 
        backgroundColor: '#050204',
        minHeight: '100vh'
      }}
    >
      <div className="max-w-xl mx-auto flex flex-col pt-4">

        {/* 🔱 INFO BANNER */}
        <div className="bg-[linear-gradient(90deg,#ff0055,#9900ff,#ff0055)] bg-[length:200%_auto] rounded-[20px] p-4 text-center mb-10 border border-white/40 max-w-[90%] mx-auto flex flex-col gap-3 shadow-2xl"
             style={{ animation: 'var(--animate-pulse-glow)' }}>
            <div className="text-white text-[13px] font-black leading-tight tracking-wider" style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.9)' }}>
                BU SİTEDE BULUNAN BAYANLAR TAMAMEN ELDEN ÖDEME İLE ÇALIŞMAKTADIRLAR.
            </div>
            
            <div className="bg-black/50 border-[1.5px] border-dashed border-[#ffcc00] rounded-xl p-3 text-white text-[11px] font-extrabold leading-snug tracking-wide" 
                 style={{ textShadow: '1px 1px 2px #000', animation: 'var(--animate-pulse-warning-box)' }}>
                <AlertTriangle className="inline-block text-[#ffcc00] w-4 h-4 mr-1 relative -top-0.5" style={{ animation: 'var(--animate-warning-blink)' }} /> 
                YANINIZA GELMEDEN ÖNCE HERHANGİ BİR NEDENLE ATM'DEN VEYA HESABA HAVALE <span className="text-[#ffcc00] text-[13px] underline underline-offset-4" style={{ textShadow: '0 0 10px rgba(255, 204, 0, 0.8)' }}>İSTEMEZLER!</span>
            </div>
        </div>

        {/* 🔱 CARDS LIST */}
        <div className="flex flex-col gap-8 w-full px-4">
          {imagesToRender.map((item, idx) => {
            if (!item || !item.src) return null;
            const firstName = (item.title || 'VIP').split(' ')[0];
            const profileSlug = slugify(firstName);
            
            // 🔥 AGGRESSIVE SEO NICHES
            const fallbackNiches = ['Ev Otel Rez.', 'Özel Konsept', 'Manken', 'Sınırsız'];
            const niche = item.niche || fallbackNiches[idx % fallbackNiches.length];
            const age = 19 + (idx % 7); // Randomize age between 19-25

            // 🔥 SEO-OPTIMIZED IMAGE PATHS (DOMAIN UNIQUE & ULTRA FAST LOCAL CDN)
            const domainPrefix = host ? host.split('.')[0] : 'doruk';
            const safeIdx = (idx % 310) + 1; // Map to vip-profil-1 to vip-profil-314
            
            // If the image is custom (e.g. from Admin DB or external), keep it. 
            // Otherwise, use the ultra-fast local WebP rewrite cache.
            const isCustomImage = item.src && (item.src.startsWith('http') || item.src.includes('uploads'));
            
            // Matches next.config.ts rewrite: /:city-kaporasiz-escort-bayan-:id.webp -> /_media/vitrin/vip-profil-:id.webp
            const seoImagePath = isCustomImage 
                ? item.src 
                : `/${domainPrefix}-${slugify(city)}-kaporasiz-escort-bayan-${safeIdx}.webp`;
            
            const altTag = `${domainPrefix.toUpperCase()} ${generateGoldenAlt(city)} - ${firstName}`;

            const handleTrack = () => {
              fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileName: firstName }),
              }).catch(() => {});
            };

            const whatsappUrl = item.phone 
              ? `https://wa.me/${item.phone}?text=Merhaba ${firstName}, görüşme için bilgi verir misin?` 
              : `${siteConfig.contact.whatsappLink}?text=Merhaba ${firstName}, görüşme için bilgi verir misin?`;

            return (
              <a 
                key={`${idx}-${isMounted}`}
                href={whatsappUrl}
                onClick={handleTrack}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-inherit transition-transform duration-300 active:scale-95 group"
              >
                <div 
                  className="relative h-[220px] bg-black rounded-2xl overflow-hidden border-[1.5px] border-white/15" 
                  style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9), 0 0 25px rgba(255, 0, 85, 0.25)' }}
                >
                  
                  {/* Scrolling Images Wrapper */}
                  <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-900">
                    <div className="flex h-full w-[200%]" style={{ animation: 'var(--animate-scroll-images)' }}>
                      {[0, 1, 2, 0, 1, 2].map((offset, scrollIdx) => {
                        let currSeoPath = '';
                        
                        if (item.gallery && item.gallery.length > 0) {
                           // If profile has a specific gallery (like Melissa), loop through those images
                           currSeoPath = item.gallery[offset % item.gallery.length];
                        } else {
                           // Default behavior for other profiles
                           const currentSafeIdx = (safeIdx + offset * 13) % 310 + 1;
                           currSeoPath = isCustomImage && offset === 0 
                              ? item.src 
                              : `/${domainPrefix}-${slugify(city)}-kaporasiz-escort-bayan-${currentSafeIdx}.webp`;
                        }
                        
                        return (
                          <div key={`scroll-${idx}-${scrollIdx}`} className="relative h-full w-[16.666%] border-l border-[#111]">
                            <Image 
                              src={currSeoPath} 
                              alt={`${altTag} - Poz ${offset + 1}`}
                              fill
                              sizes="(max-width: 600px) 33vw, 200px"
                              priority={idx < 4 && scrollIdx < 3}
                              className="object-cover object-top contrast-[1.05] brightness-95"
                              onError={(e: any) => {
                                if (e.target.dataset.failed) return;
                                e.target.dataset.failed = 'true';
                                e.target.src = isCustomImage && offset === 0 ? item.src : `/_media/vitrin/vip-profil-${currentSafeIdx}.webp`;
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 🔴 AD BADGE */}
                  {item.isAd && (
                    <div className="absolute top-3 left-3 z-20">
                      <div className="bg-[#ffcc00] text-black text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-lg flex items-center gap-1 border border-black/20">
                        <AlertTriangle className="w-3 h-3" />
                        REKLAM
                      </div>
                    </div>
                  )}

                  {/* Pink Overlay */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-[42%] bg-[linear-gradient(135deg,rgba(255,0,85,0.85)_0%,rgba(138,0,204,0.8)_100%)] backdrop-blur-md z-10 p-4 flex flex-col justify-center items-start border-r border-white/30" 
                    style={{ clipPath: 'ellipse(130% 130% at -20% 50%)', boxShadow: '20px 0 40px rgba(0,0,0,0.8)' }}
                  >
                    <div 
                      className="font-[family-name:var(--font-heading)] italic text-[28px] text-white font-bold tracking-widest mb-3 leading-none drop-shadow-2xl" 
                      style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px #ff0055, 0 4px 5px rgba(0,0,0,0.8)' }}
                    >
                      {firstName}
                    </div>

                    <div className="flex flex-col gap-1.5 mb-5 w-full">
                      <span className="text-[10px] text-white font-bold tracking-wide bg-[linear-gradient(90deg,rgba(255,255,255,0.2),rgba(255,255,255,0.05))] border border-white/30 border-l-[3px] border-l-[#ffb3d9] py-1.5 px-2.5 rounded-xl w-fit flex items-center gap-1.5" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                          <Home className="w-[11px] h-[11px] text-[#ffd700]" style={{ filter: 'drop-shadow(0 0 2px rgba(255,215,0,0.8))' }} /> {niche.length > 15 ? 'Ev Otel Rez' : niche}
                      </span>
                      <span className="text-[10px] text-white font-bold tracking-wide bg-[linear-gradient(90deg,rgba(255,255,255,0.2),rgba(255,255,255,0.05))] border border-white/30 border-l-[3px] border-l-[#ffb3d9] py-1.5 px-2.5 rounded-xl w-fit flex items-center gap-1.5" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                          <User className="w-[11px] h-[11px] text-[#ffd700]" style={{ filter: 'drop-shadow(0 0 2px rgba(255,215,0,0.8))' }} /> Bireysel
                      </span>
                      <span className="text-[10px] text-white font-bold tracking-wide bg-[linear-gradient(90deg,rgba(255,255,255,0.2),rgba(255,255,255,0.05))] border border-white/30 border-l-[3px] border-l-[#ffb3d9] py-1.5 px-2.5 rounded-xl w-fit flex items-center gap-1.5" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                          <CalendarHeart className="w-[11px] h-[11px] text-[#ffd700]" style={{ filter: 'drop-shadow(0 0 2px rgba(255,215,0,0.8))' }} /> Yaş {age}
                      </span>
                    </div>

                    <div 
                      className="bg-[linear-gradient(90deg,#25D366,#128C7E)] text-white py-1.5 px-4 rounded-full text-[11px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border-[1.5px] border-white"
                      style={{ animation: 'var(--animate-neon-pulse)' }}
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> İletişim
                    </div>
                  </div>

                </div>
              </a>
            );
          })}
        </div>

        {/* 🚀 GLOBAL CTA */}
        <div className="mt-16 mb-20 flex justify-center px-4">
          <Link 
            href={siteConfig.contact.whatsappLink} 
            className="rose-button w-full md:w-auto px-10 py-5 rounded-[2rem] text-sm font-black shadow-glow-rose group relative overflow-hidden text-center"
            target={isEmbed ? "_blank" : undefined}
          >
             <span className="relative z-10 flex items-center justify-center gap-3">
                TÜM KATALOĞU GÖR <span className="opacity-50 tracking-tighter">{'>>>'}</span>
             </span>
             <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </Link>
        </div>

        <div className="text-center text-zinc-600 text-[10px] tracking-[5px] font-[family-name:var(--font-heading)] font-black pb-10 uppercase">
          {host ? host.split('.')[0] : 'VIP'} CLUB &copy; 2026
        </div>

      </div>
    </div>
  );
}
