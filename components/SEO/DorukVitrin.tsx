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
import { ThemeEngine } from '../../lib/theme-engine';
import { getSafeVipProfileIdx } from '../../lib/vitrin-blacklist';

export function DorukVitrin({ 
  city = 'İstanbul', 
  isEmbed = false, 
  host, 
  serverProfiles = [] 
}: { 
  city?: string, 
  isEmbed?: boolean, 
  host?: string,
  serverProfiles?: any[]
}) {
  const [isMounted, setIsMounted] = useState(false);
  
  // 🛡️ [GOD-MODE] DYNAMIC THEME ENGINE INJECTION
  const theme = useMemo(() => {
    return ThemeEngine.getTheme(host || siteConfig.domain);
  }, [host]);

  // 🛡️ [GOD-MODE] SSR-SAFE SELECTION
  const initialImages = useMemo(() => {
    return vitrinImages.slice(0, 20);
  }, []);

  const [displayedImages, setDisplayedImages] = useState<any[]>(() => {
    if (serverProfiles && serverProfiles.length > 0) {
      const pool = vitrinImages.filter(img => !serverProfiles.some(m => m.src === img.src));
      return [...serverProfiles, ...pool.slice(0, Math.max(0, 20 - serverProfiles.length))];
    }
    return initialImages;
  });
  const [hasLoaded, setHasLoaded] = useState(serverProfiles && serverProfiles.length > 0);

  useEffect(() => {
    setIsMounted(true);
    if (hasLoaded) return;
    
    getActiveProfiles().then((dbProfiles) => {
      const masters = dbProfiles.map(m => ({
        title: m.name,
        src: m.image,
        phone: m.phone,
        niche: m.niche
      }));
      
      const pool = vitrinImages.filter(img => !masters.some(m => m.src === img.src));
      setDisplayedImages([...masters, ...pool.slice(0, Math.max(0, 20 - masters.length))]);
      setHasLoaded(true);
    }).catch(e => {
      setDisplayedImages(vitrinImages.slice(0, 20));
    });
  }, [hasLoaded]);

  const imagesToRender = displayedImages;

  if (!imagesToRender || imagesToRender.length === 0) return null;

  return (
    <div 
      className="w-full text-zinc-100 pb-20 pt-32 font-sans select-none overflow-hidden relative" 
      style={{ 
        backgroundImage: `radial-gradient(circle at 50% 0%, ${theme.bgColor} 0%, #050204 60%)`, 
        backgroundColor: '#050204',
        minHeight: '100vh'
      }}
    >
      <div className="max-w-xl mx-auto flex flex-col pt-4">

        {/* 🔱 INFO BANNER (Dynamic Colors) */}
        <div className="rounded-[20px] p-4 text-center mb-10 border max-w-[90%] mx-auto flex flex-col gap-3 shadow-2xl"
             style={{ 
               background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.glowEffect}, ${theme.primaryColor})`,
               backgroundSize: '200% auto',
               borderColor: theme.glowEffect,
               animation: 'var(--animate-pulse-glow)' 
             }}>
            <div className="text-white text-[13px] font-black leading-tight tracking-wider" style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.9)' }}>
                BU SİTEDE BULUNAN BAYANLAR TAMAMEN ELDEN ÖDEME İLE ÇALIŞMAKTADIRLAR.
            </div>
            
            <div className="bg-black/50 border-[1.5px] border-dashed rounded-xl p-3 text-white text-[11px] font-extrabold leading-snug tracking-wide" 
                 style={{ 
                   borderColor: theme.primaryColor,
                   textShadow: '1px 1px 2px #000', 
                   animation: 'var(--animate-pulse-warning-box)' 
                 }}>
                <AlertTriangle className="inline-block w-4 h-4 mr-1 relative -top-0.5" style={{ color: theme.primaryColor, animation: 'var(--animate-warning-blink)' }} /> 
                YANINIZA GELMEDEN ÖNCE HERHANGİ BİR NEDENLE ATM'DEN VEYA HESABA HAVALE <span className="text-[13px] underline underline-offset-4" style={{ color: theme.primaryColor, textShadow: `0 0 10px ${theme.glowEffect}` }}>İSTEMEZLER!</span>
            </div>
        </div>

        {/* 🔱 CARDS LIST */}
        <div className="flex flex-col gap-8 w-full px-4">
          {imagesToRender.map((item, idx) => {
            if (!item || !item.src) return null;
            const firstName = (item.title || 'VIP').split(' ')[0];
            const profileSlug = slugify(firstName);
            
            const fallbackNiches = ['Ev Otel Rez.', 'Özel Konsept', 'Manken', 'Sınırsız'];
            const niche = item.niche || fallbackNiches[idx % fallbackNiches.length];
            const age = 19 + (idx % 7);

            const domainPrefix = host ? host.split('.')[0] : 'doruk';
            const safeIdx = (idx % 310) + 1;
            
            const isCustomImage = item.src && (item.src.startsWith('http') || item.src.includes('uploads'));
            
            const seoImagePath = isCustomImage 
                ? item.src 
                : `/${domainPrefix}-${slugify(city)}-kaporasiz-escort-bayan-${safeIdx}.webp`;
            
            const altTag = `${domainPrefix.toUpperCase()} ${generateGoldenAlt(city, idx)} - ${firstName}`;

            const handleTrack = () => {
              fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profileName: firstName }) }).catch(() => {});
            };

            const whatsappUrl = item.phone 
              ? `https://wa.me/${item.phone}?text=Merhaba ${firstName}, görüşme için bilgi verir misin?` 
              : `${siteConfig.contact.whatsappLink}?text=Merhaba ${firstName}, görüşme için bilgi verir misin?`;

            return (
              <div 
                key={`${idx}-${isMounted}`}
                className="block text-inherit transition-transform duration-300 active:scale-95 group"
              >
                <div 
                  className="relative h-[280px] bg-black rounded-2xl overflow-hidden border-[1.5px] border-white/15" 
                  style={{ boxShadow: `0 20px 40px rgba(0, 0, 0, 0.9), 0 0 25px ${theme.glowEffect}` }}
                >
                  
                  {/* Scrolling Images Wrapper - Links to Profile */}
                  <Link href={`/profile/${profileSlug}`} onClick={handleTrack} className="absolute inset-0 z-0 overflow-hidden bg-zinc-900 block cursor-pointer">
                    <div className="flex h-full w-[200%]" style={{ animation: 'var(--animate-scroll-images)' }}>
                      {[0, 1, 2, 0, 1, 2].map((offset, scrollIdx) => {
                        // 🔥 VIP Elite: BLACK HAT IMAGE CLOAKING
                        // 1. Host bazlı deterministik hash (Her domainde ayni indexteki fotoğraf bambaşka bir isim/path alır)
                        const charSum = (domainPrefix + firstName).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        const blackHatOffset = (idx * 7 + scrollIdx * 11 + charSum) % 500;
                        
                        let currSeoPath = '';
                        
                        if (item.gallery && item.gallery.length > 0) {
                           // Galerisi olan (Melissa vb.) VIP'ler için, fotoğrafları domain'e özgü rotalarla sun:
                           currSeoPath = item.gallery[offset % item.gallery.length];
                        } else {
                            const currentSafeIdx = getSafeVipProfileIdx((safeIdx + offset * 13 + blackHatOffset) % 310 + 1, idx + offset);
                            currSeoPath = isCustomImage && offset === 0 
                               ? item.src 
                               : `/_media/vitrin/vip-profil-${currentSafeIdx}.webp`;
                        }
                        
                        // 🔥 HOST'a ÖZEL BLACK HAT ALT ETİKETLERİ
                        const lsiNiches = ["elit", "üniversiteli", "rus", "sınırsız", "anal", "kaporasız", "vip", "gecelik", "otele gelen", "özel konsept"];
                        const domainLsi = lsiNiches[charSum % lsiNiches.length];
                        const altTag = `${domainPrefix.toUpperCase()} ${generateGoldenAlt(city, idx + blackHatOffset)} - ${firstName} ${domainLsi} escort`;

                        return (
                          <div key={`scroll-${idx}-${scrollIdx}`} className="relative h-full w-[16.666%] border-l border-[#111] overflow-hidden">
                            {/* Blurred background layer */}
                            {/* 🔱 GOD-MODE: Optimized Background Blur (CSS-driven) */}
                            <div 
                              className="absolute inset-0 bg-cover bg-center opacity-30 scale-125 blur-xl pointer-events-none"
                              style={{ backgroundImage: `url(${currSeoPath.startsWith('http') ? currSeoPath : `${siteConfig.cdnUrl}${currSeoPath}`})` }}
                            />
                            {/* Main contained image */}
                            <Image 
                              src={currSeoPath.startsWith('http') ? currSeoPath : `${siteConfig.cdnUrl}${currSeoPath}`} 
                              alt={`${altTag} - Poz ${offset + 1}`}
                              title={`${domainPrefix} ${firstName} ${domainLsi}`}
                              fill
                              sizes="(max-width: 600px) 33vw, (max-width: 1200px) 15vw, 200px"
                              priority={idx < 2 && scrollIdx < 2}
                              className="object-contain object-top contrast-[1.05] brightness-95 relative z-10 drop-shadow-2xl"
                              onError={(e: any) => {
                                if (e.target.dataset.failed) return;
                                e.target.dataset.failed = 'true';
                                if (item.gallery && item.gallery.length > 0) {
                                  e.target.src = item.src.startsWith('http') ? item.src : `${siteConfig.cdnUrl}${item.src}`;
                                } else {
                                  const fallbackIdx = getSafeVipProfileIdx((safeIdx + offset * 13 + blackHatOffset + 1) % 310 + 1, idx + offset + 1);
                                  const fallbackSrc = `/_media/vitrin/vip-profil-${fallbackIdx}.webp`;
                                  e.target.src = isCustomImage && offset === 0 
                                     ? (item.src.startsWith('http') ? item.src : `${siteConfig.cdnUrl}${item.src}`)
                                     : `${siteConfig.cdnUrl}${fallbackSrc}`;
                                }
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Link>

                  {/* 🔴 AD BADGE */}
                  {item.isAd && (
                    <div className="absolute top-3 right-3 z-20">
                      <div className="text-black text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-lg flex items-center gap-1 border border-black/20"
                           style={{ backgroundColor: theme.primaryColor }}>
                        <AlertTriangle className="w-3 h-3" />
                        REKLAM
                      </div>
                    </div>
                  )}

                  {/* Dynamic Color Overlay */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-[42%] backdrop-blur-md z-10 p-4 flex flex-col justify-center items-start border-r border-white/30 pointer-events-none" 
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.bgColor} 100%)`,
                      opacity: 0.85,
                      clipPath: 'ellipse(130% 130% at -20% 50%)', 
                      boxShadow: '20px 0 40px rgba(0,0,0,0.8)' 
                    }}
                  >
                    <div 
                      className="italic text-[28px] text-white font-bold tracking-widest mb-3 leading-none drop-shadow-2xl" 
                      style={{ 
                        fontFamily: theme.headingFont,
                        textShadow: `0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px ${theme.primaryColor}, 0 4px 5px rgba(0,0,0,0.8)` 
                      }}
                    >
                      {firstName}
                    </div>

                    <div className="flex flex-col gap-1.5 mb-5 w-full pr-2">
                      <span className="text-[10px] text-white font-bold tracking-wide border py-1.5 px-2.5 rounded-xl w-fit flex items-center gap-1.5 break-words whitespace-normal" 
                            style={{ 
                              background: 'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                              borderColor: 'rgba(255,255,255,0.3)',
                              borderLeftWidth: '3px',
                              borderLeftColor: theme.primaryColor,
                              textShadow: '1px 1px 2px rgba(0,0,0,0.9)', 
                              boxShadow: '0 4px 10px rgba(0,0,0,0.3)' 
                            }}>
                          <Home className="w-[11px] h-[11px] shrink-0" style={{ color: theme.primaryColor, filter: `drop-shadow(0 0 2px ${theme.primaryColor})` }} /> 
                          <span className="line-clamp-1 break-all overflow-hidden">{niche.length > 15 ? 'Ev Otel Rez' : niche}</span>
                      </span>
                      <span className="text-[10px] text-white font-bold tracking-wide border py-1.5 px-2.5 rounded-xl w-fit flex items-center gap-1.5 break-words" 
                            style={{ 
                              background: 'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                              borderColor: 'rgba(255,255,255,0.3)',
                              borderLeftWidth: '3px',
                              borderLeftColor: theme.primaryColor,
                              textShadow: '1px 1px 2px rgba(0,0,0,0.9)', 
                              boxShadow: '0 4px 10px rgba(0,0,0,0.3)' 
                            }}>
                          <User className="w-[11px] h-[11px] shrink-0" style={{ color: theme.primaryColor, filter: `drop-shadow(0 0 2px ${theme.primaryColor})` }} /> Bireysel
                      </span>
                      <span className="text-[10px] text-white font-bold tracking-wide border py-1.5 px-2.5 rounded-xl w-fit flex items-center gap-1.5 break-words" 
                            style={{ 
                              background: 'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                              borderColor: 'rgba(255,255,255,0.3)',
                              borderLeftWidth: '3px',
                              borderLeftColor: theme.primaryColor,
                              textShadow: '1px 1px 2px rgba(0,0,0,0.9)', 
                              boxShadow: '0 4px 10px rgba(0,0,0,0.3)' 
                            }}>
                          <CalendarHeart className="w-[11px] h-[11px] shrink-0" style={{ color: theme.primaryColor, filter: `drop-shadow(0 0 2px ${theme.primaryColor})` }} /> Yaş {age}
                      </span>
                    </div>

                    <div className="pointer-events-auto">
                      <a 
                        href={whatsappUrl}
                        onClick={handleTrack}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white py-1.5 px-4 rounded-full text-[11px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border-[1.5px] border-white hover:scale-105 transition-transform"
                        style={{ 
                          background: 'linear-gradient(90deg, #25D366, #128C7E)',
                          animation: 'var(--animate-neon-pulse)' 
                        }}
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> İletişim
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* 🚀 GLOBAL CTA */}
        <div className="mt-16 mb-20 flex justify-center px-4">
          <Link 
            href={siteConfig.contact.whatsappLink} 
            className="w-full md:w-auto px-10 py-5 rounded-[2rem] text-sm font-black group relative overflow-hidden text-center text-white italic uppercase tracking-[0.3em] transition-all duration-300"
            target={isEmbed ? "_blank" : undefined}
            style={{
              backgroundColor: theme.primaryColor,
              boxShadow: `0 10px 20px -5px ${theme.glowEffect}`
            }}
          >
             <span className="relative z-10 flex items-center justify-center gap-3">
                TÜM KATALOĞU GÖR <span className="opacity-50 tracking-tighter">{'>>>'}</span>
             </span>
             <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </Link>
        </div>

        <div className="text-center text-zinc-600 text-[10px] tracking-[5px] font-[family-name:var(--font-heading)] font-black pb-10 uppercase">
          {theme.brandName} &copy; 2026
        </div>

      </div>
    </div>
  );
}
