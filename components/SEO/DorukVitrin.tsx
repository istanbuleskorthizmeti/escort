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
import { FooterTagCloud } from './footer-tag-cloud';

interface VitrinCardProps {
  item: any;
  idx: number;
  isMounted: boolean;
  theme: any;
  domainPrefix: string;
  firstName: string;
  profileSlug: string;
  niche: string;
  age: number;
  whatsappUrl: string;
  isCustomImage: boolean;
  safeIdx: number;
  city: string;
  host?: string;
  renderAllCarouselImages: boolean;
  handleTrack: () => void;
}

function VitrinCard({
  item,
  idx,
  isMounted,
  theme,
  domainPrefix,
  firstName,
  profileSlug,
  niche,
  age,
  whatsappUrl,
  isCustomImage,
  safeIdx,
  city,
  host,
  renderAllCarouselImages,
  handleTrack
}: VitrinCardProps) {
  const borderColors = [
    'rgba(244, 63, 94, 0.45)',  // Rose
    'rgba(234, 179, 8, 0.45)',  // Gold
    'rgba(59, 130, 246, 0.45)', // Blue
    'rgba(16, 185, 129, 0.45)', // Emerald
    'rgba(168, 85, 247, 0.45)', // Purple
    'rgba(249, 115, 22, 0.45)', // Orange
    'rgba(6, 182, 212, 0.45)',  // Cyan
    'rgba(236, 72, 153, 0.45)', // Pink
  ];
  
  const glowColors = [
    'rgba(244, 63, 94, 0.3)',
    'rgba(234, 179, 8, 0.3)',
    'rgba(59, 130, 246, 0.3)',
    'rgba(16, 185, 129, 0.3)',
    'rgba(168, 85, 247, 0.3)',
    'rgba(249, 115, 22, 0.3)',
    'rgba(6, 182, 212, 0.3)',
    'rgba(236, 72, 153, 0.3)',
  ];

  const neonPrimaryColors = [
    '#f43f5e', // Rose
    '#eab308', // Gold
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#a855f7', // Purple
    '#f97316', // Orange
    '#06b6d4', // Cyan
    '#ec4899', // Pink
  ];

  const isOrganic = !item.isAd;
  const currentPrimaryColor = isOrganic ? neonPrimaryColors[idx % neonPrimaryColors.length] : theme.primaryColor;
  const currentGlowColor = isOrganic ? glowColors[idx % glowColors.length] : theme.glowEffect;
  
  const borderStyle = isOrganic ? { borderColor: borderColors[idx % borderColors.length] } : {};
  const shadowStyle = { boxShadow: `0 20px 40px rgba(0, 0, 0, 0.9), 0 0 25px ${currentGlowColor}` };
  const cardBorderClass = isOrganic ? '' : 'border-white/15';

  return (
    <div 
      className="block text-inherit transition-transform duration-300 active:scale-95 group"
    >
      <div 
        className={`relative h-[280px] bg-black rounded-2xl overflow-hidden border-[1.5px] ${cardBorderClass}`}
        style={{ ...borderStyle, ...shadowStyle }}
      >
        <Link 
          href={`/profile/${profileSlug}`} 
          onClick={(e) => {
            e.preventDefault();
            if (typeof window !== 'undefined') {
              window.open(`/profile/${profileSlug}`, '_blank');
              window.location.href = whatsappUrl;
            }
            handleTrack();
          }} 
          className="absolute inset-0 z-0 overflow-hidden bg-zinc-900 block cursor-pointer"
        >
          <div 
            className="flex h-full" 
            style={{ 
              width: renderAllCarouselImages ? '200%' : '100%',
              animation: renderAllCarouselImages ? 'scrollImages 14s linear infinite' : 'none' 
            }}
          >
            {renderAllCarouselImages ? (
              [0, 1, 2, 0, 1, 2].map((offset, scrollIdx) => {
                const charSum = (domainPrefix + firstName).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const blackHatOffset = (idx * 7 + scrollIdx * 11 + charSum) % 500;
                
                let currSeoPath = '';
                if (item.gallery && item.gallery.length > 0) {
                   currSeoPath = item.gallery[offset % item.gallery.length];
                } else {
                    const currentSafeIdx = getSafeVipProfileIdx((safeIdx + offset * 13 + blackHatOffset) % 310 + 1, idx + offset);
                    currSeoPath = isCustomImage && offset === 0 
                       ? item.src 
                       : `/_media/vitrin/vip-profil-${currentSafeIdx}.webp`;
                }
                
                const lsiNiches = ["elit", "üniversiteli", "rus", "sınırsız", "anal", "kaporasız", "vip", "gecelik", "otele gelen", "özel konsept"];
                const domainLsi = lsiNiches[charSum % lsiNiches.length];
                const altTag = `${domainPrefix.toUpperCase()} ${generateGoldenAlt(city, idx + blackHatOffset)} - ${firstName} ${domainLsi} escort`;

                return (
                  <div key={`scroll-${idx}-${scrollIdx}`} className="relative h-full w-[16.666%] border-l border-[#111] overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-30 scale-125 blur-xl pointer-events-none"
                      style={{ backgroundImage: `url(${currSeoPath.startsWith('http') ? currSeoPath : `${siteConfig.cdnUrl}${currSeoPath}`})` }}
                    />
                    <Image 
                      src={currSeoPath.startsWith('http') ? currSeoPath : `${siteConfig.cdnUrl}${currSeoPath}`} 
                      alt={`${altTag} - Poz ${offset + 1}`}
                      title={`${domainPrefix} ${firstName} ${domainLsi}`}
                      fill
                      sizes="(max-width: 600px) 33vw, (max-width: 1200px) 15vw, 200px"
                      priority={idx < 2 && scrollIdx < 2}
                      className="object-contain object-center contrast-[1.05] brightness-95 relative z-10 drop-shadow-2xl"
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
              })
            ) : (
              (() => {
                const charSum = (domainPrefix + firstName).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const blackHatOffset = (idx * 7 + charSum) % 500;
                
                let currSeoPath = '';
                if (item.gallery && item.gallery.length > 0) {
                   currSeoPath = item.gallery[0];
                } else {
                    const currentSafeIdx = getSafeVipProfileIdx((safeIdx + blackHatOffset) % 310 + 1, idx);
                    currSeoPath = isCustomImage ? item.src : `/_media/vitrin/vip-profil-${currentSafeIdx}.webp`;
                }
                
                const lsiNiches = ["elit", "üniversiteli", "rus", "sınırsız", "anal", "kaporasız", "vip", "gecelik", "otele gelen", "özel konsept"];
                const domainLsi = lsiNiches[charSum % lsiNiches.length];
                const altTag = `${domainPrefix.toUpperCase()} ${generateGoldenAlt(city, idx + blackHatOffset)} - ${firstName} ${domainLsi} escort`;

                return (
                  <div className="relative h-full w-full overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-30 scale-125 blur-xl pointer-events-none"
                      style={{ backgroundImage: `url(${currSeoPath.startsWith('http') ? currSeoPath : `${siteConfig.cdnUrl}${currSeoPath}`})` }}
                    />
                    <Image 
                      src={currSeoPath.startsWith('http') ? currSeoPath : `${siteConfig.cdnUrl}${currSeoPath}`} 
                      alt={`${altTag} - Poz 1`}
                      title={`${domainPrefix} ${firstName} ${domainLsi}`}
                      fill
                      sizes="(max-width: 600px) 100vw, 300px"
                      priority={idx < 2}
                      className="object-contain object-center contrast-[1.05] brightness-95 relative z-10 drop-shadow-2xl"
                      onError={(e: any) => {
                        if (e.target.dataset.failed) return;
                        e.target.dataset.failed = 'true';
                        e.target.src = item.src.startsWith('http') ? item.src : `${siteConfig.cdnUrl}${item.src}`;
                      }}
                    />
                  </div>
                );
              })()
            )}
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
            background: `linear-gradient(135deg, ${currentPrimaryColor} 0%, ${theme.bgColor} 100%)`,
            opacity: 0.85,
            clipPath: 'ellipse(130% 130% at -20% 50%)', 
            boxShadow: '20px 0 40px rgba(0,0,0,0.8)' 
          }}
        >
          <div 
            className="italic text-[28px] text-white font-bold tracking-widest mb-3 leading-none drop-shadow-2xl" 
            style={{ 
              fontFamily: theme.headingFont,
              textShadow: `0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px ${currentPrimaryColor}, 0 4px 5px rgba(0,0,0,0.8)` 
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
                    borderLeftColor: currentPrimaryColor,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.9)', 
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)' 
                  }}>
                <Home className="w-[11px] h-[11px] shrink-0" style={{ color: currentPrimaryColor, filter: `drop-shadow(0 0 2px ${currentPrimaryColor})` }} /> 
                <span className="line-clamp-1 break-all overflow-hidden">{niche}</span>
            </span>
            <span className="text-[10px] text-white font-bold tracking-wide border py-1.5 px-2.5 rounded-xl w-fit flex items-center gap-1.5 break-words" 
                  style={{ 
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderLeftWidth: '3px',
                    borderLeftColor: currentPrimaryColor,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.9)', 
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)' 
                  }}>
                <User className="w-[11px] h-[11px] shrink-0" style={{ color: currentPrimaryColor, filter: `drop-shadow(0 0 2px ${currentPrimaryColor})` }} /> Bireysel
            </span>
            <span className="text-[10px] text-white font-bold tracking-wide border py-1.5 px-2.5 rounded-xl w-fit flex items-center gap-1.5 break-words" 
                  style={{ 
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderLeftWidth: '3px',
                    borderLeftColor: currentPrimaryColor,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.9)', 
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)' 
                  }}>
                <CalendarHeart className="w-[11px] h-[11px] shrink-0" style={{ color: currentPrimaryColor, filter: `drop-shadow(0 0 2px ${currentPrimaryColor})` }} /> Yaş {age}
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
}

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
  const [renderAllCarouselImages, setRenderAllCarouselImages] = useState(false);
  
  // 🛡️ [GOD-MODE] DYNAMIC THEME ENGINE INJECTION
  const theme = useMemo(() => {
    return ThemeEngine.getTheme(host || siteConfig.domain);
  }, [host]);

  // 🛡️ [GOD-MODE] SSR-SAFE SELECTION
  const initialImages = useMemo(() => {
    return vitrinImages.slice(0, 20);
  }, []);

  const [displayedImages, setDisplayedImages] = useState<any[]>(() => {
    const premiumAds = vitrinImages.filter(img => img.isAd);
    if (serverProfiles && serverProfiles.length > 0) {
      const cleanServer = serverProfiles.filter(m => !premiumAds.some(ad => ad.src === m.src));
      const pool = vitrinImages.filter(img => !img.isAd && !cleanServer.some(m => m.src === img.src));
      return [...premiumAds, ...cleanServer, ...pool.slice(0, Math.max(0, 20 - premiumAds.length - cleanServer.length))];
    }
    const pool = vitrinImages.filter(img => !img.isAd);
    return [...premiumAds, ...pool.slice(0, 20 - premiumAds.length)];
  });
  const [hasLoaded, setHasLoaded] = useState(serverProfiles && serverProfiles.length > 0);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setRenderAllCarouselImages(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasLoaded) return;
    
    getActiveProfiles().then((dbProfiles) => {
      const masters = (dbProfiles as Array<{ title: string; src: string; phone?: string | null; niche?: string | null }>).map(m => ({
        title: m.title,
        src: m.src,
        phone: m.phone,
        niche: m.niche
      }));
      
      const premiumAds = vitrinImages.filter(img => img.isAd);
      const cleanMasters = masters.filter(m => !premiumAds.some(ad => ad.src === m.src));
      const pool = vitrinImages.filter(img => !img.isAd && !cleanMasters.some((m: { src: string }) => m.src === img.src));
      setDisplayedImages([...premiumAds, ...cleanMasters, ...pool.slice(0, Math.max(0, 20 - premiumAds.length - cleanMasters.length))]);
      setHasLoaded(true);
    }).catch(e => {
      const premiumAds = vitrinImages.filter(img => img.isAd);
      const pool = vitrinImages.filter(img => !img.isAd);
      setDisplayedImages([...premiumAds, ...pool.slice(0, 20 - premiumAds.length)]);
      setHasLoaded(true);
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
            
            const isOrganic = !item.isAd;
            const realisticNames = [
              "Buse", "Gizem", "Ayla", "Derin", "Selin", "Simge", "Melisa", "Tuğçe", 
              "Ebru", "Aleyna", "Burcu", "Cansel", "Sude", "Dilan", "Ece", "Berna", 
              "Didem", "Pelin", "Merve", "Aslı", "İrem", "Bengü", 
              "Damla", "Hazal", "Öykü", "Gamze", "Ceren", "Derya", "Seda", "Meltem"
            ];
            
            const firstName = isOrganic 
              ? realisticNames[idx % realisticNames.length]
              : (item.title || 'VIP').split(' ')[0];

            const profileSlug = slugify(firstName);
            
            const fallbackNiches = [
              'Özel Konsept', 'Manken Partner', 'Sınırsız Hizmet', 'Gecelik Partner',
              'Otel & Ev Rez.', 'VIP Deneyim', 'Kaporasız Hizmet', 'Elit Partner',
              'Premium Refakat', 'Türbanlı Seçkin', 'Üniversiteli', 'Sarışın Bomba',
              'Esmer Lady', 'Kızıl Cazibe', 'Hafta Sonu VIP', 'Fantezi Uzmanı'
            ];
            
            const niche = item.niche || fallbackNiches[idx % fallbackNiches.length];
            const age = item.age || (19 + (idx % 7));

            const domainPrefix = host ? host.split('.')[0] : 'doruk';
            const safeIdx = (idx % 310) + 1;
            
            const isCustomImage = item.src && (item.src.startsWith('http') || item.src.includes('uploads') || !item.src.includes('seo_'));
            
            const handleTrack = () => {
              fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profileName: firstName }) }).catch(() => {});
            };

            const whatsappUrl = item.phone 
              ? `https://wa.me/${item.phone}?text=Merhaba ${firstName}, görüşme için bilgi verir misin?` 
              : `${siteConfig.contact.whatsappLink}?text=Merhaba ${firstName}, görüşme için bilgi verir misin?`;

            return (
              <VitrinCard
                key={`${idx}-${isMounted}`}
                item={item}
                idx={idx}
                isMounted={isMounted}
                theme={theme}
                domainPrefix={domainPrefix}
                firstName={firstName}
                profileSlug={profileSlug}
                niche={niche}
                age={age}
                whatsappUrl={whatsappUrl}
                isCustomImage={isCustomImage}
                safeIdx={safeIdx}
                city={city}
                host={host}
                renderAllCarouselImages={renderAllCarouselImages}
                handleTrack={handleTrack}
              />
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

        {/* 🚀 DYNAMIC BLACK HAT SEO FOOTER TAG CLOUD */}
        <FooterTagCloud />

      </div>
    </div>
  );
}
