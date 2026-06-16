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

const FALLBACK_NICHES = [
  'buluşmak için eskort', 'randevu için eskort', 'iletişim için bayan', 'gecelik eskort bayan',
  'otele gelen eskort', 'vip eskort', 'kaporasız eskort bayan', 'vip partner bayan',
  'rus eskort bayan', 'türbanlı eskort', 'üniversiteli model', 'sarışın eskort',
  'esmer bayan eskort', 'kızıl model eskort', 'hafta sonu eskort', 'randevu için vip partner'
];

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
  const getSeoImageUrl = (srcPath: string) => {
    if (!srcPath) return "";
    if (srcPath.startsWith('http')) return srcPath;
    const filename = srcPath.split('/').pop() || '';
    if (filename.startsWith('vip-profil-')) {
      const match = filename.match(/vip-profil-(\d+)\.webp/);
      if (match) {
        return `/${slugify(city)}-vip-escort-ilan-${match[1]}.webp`;
      }
    }
    return srcPath;
  };

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

  const hostHash = host ? host.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
  const layoutVariant = hostHash % 3; // 0: Neon Left, 1: Glassmorphism Bottom, 2: Gold Luxury Left

  let dynamicCardCss = "";
  if (layoutVariant === 0) {
    dynamicCardCss = `
      .vitrin-card-border-${idx} {
         border: ${isOrganic ? '2px' : '2.5px'} solid ${isOrganic ? borderColors[idx % borderColors.length] : theme.primaryColor} !important;
         box-shadow: ${item.isAd 
           ? `0 0 35px ${theme.glowEffect}, inset 0 0 20px rgba(0,0,0,0.6)` 
           : `0 20px 40px rgba(0, 0, 0, 0.9), 0 0 25px ${currentGlowColor}`} !important;
      }
      .vitrin-card-overlay-${idx} {
         background: linear-gradient(135deg, ${currentPrimaryColor} 0%, ${theme.bgColor} 100%) !important;
         opacity: 0.85 !important;
         clip-path: ellipse(130% 130% at -20% 50%) !important;
         box-shadow: 20px 0 40px rgba(0,0,0,0.8) !important;
      }
      .vitrin-card-name-${idx} {
         font-family: ${theme.headingFont} !important;
         text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px ${currentPrimaryColor}, 0 4px 5px rgba(0,0,0,0.8) !important;
      }
      .vitrin-card-border-left-${idx} {
         border-left-color: ${currentPrimaryColor} !important;
      }
      .vitrin-card-icon-color-${idx} {
         color: ${currentPrimaryColor} !important;
         filter: drop-shadow(0 0 2px ${currentPrimaryColor}) !important;
      }
    `;
  } else if (layoutVariant === 1) {
    dynamicCardCss = `
      .vitrin-card-border-${idx} {
         border: 1.5px solid rgba(255, 255, 255, 0.15) !important;
         box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1) !important;
         background: rgba(10, 10, 10, 0.8) !important;
         backdrop-filter: blur(10px) !important;
      }
      .vitrin-card-name-${idx} {
         text-shadow: 0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.5) !important;
      }
    `;
  } else {
    dynamicCardCss = `
      .vitrin-card-border-${idx} {
         border: 2px solid rgba(212, 175, 55, 0.4) !important;
         box-shadow: 0 15px 35px rgba(0, 0, 0, 0.9), 0 0 25px rgba(212, 175, 55, 0.15) !important;
      }
      .vitrin-card-name-${idx} {
         text-shadow: 0 2px 4px rgba(0,0,0,0.9), 0 0 15px rgba(229, 193, 88, 0.6) !important;
      }
    `;
  }

  const isFlagship = host?.includes('dorukcanay.digital');

  const renderOverlay = () => {
    if (layoutVariant === 0) {
      return (
        <div 
          className={`absolute left-0 top-0 bottom-0 w-[42%] backdrop-blur-md z-10 p-4 flex flex-col justify-center items-start border-r border-white/30 pointer-events-none vitrin-card-overlay-${idx}`} 
        >
          <div 
            className={`italic text-[28px] text-white font-bold tracking-widest mb-3 leading-none drop-shadow-2xl flex items-center gap-1.5 vitrin-card-name-${idx}`} 
          >
            {firstName}
            {item.isAd && (
              <ShieldCheck className="w-[18px] h-[18px] text-green-400 shrink-0 drop-shadow-[0_0_8px_rgba(74,222,128,0.7)] animate-pulse" />
            )}
          </div>

          <div className="flex flex-col gap-1.5 mb-5 w-full pr-2">
            {item.isAd && (
              <span className="text-[11px] text-amber-400 font-extrabold tracking-widest border border-amber-500/50 bg-linear-to-r from-amber-500/25 to-black/50 py-1 px-2 rounded-xl w-fit flex items-center gap-1 shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.3)] drop-shadow-[1px_1px_2px_rgba(0,0,0,0.9)]">
                  ⭐ 5.0 (120+)
              </span>
            )}
            <span className={`text-[12px] text-white font-bold tracking-wide border border-white/30 border-l-[3px] py-1.5 px-2.5 rounded-xl w-fit flex items-center gap-1.5 wrap-break-word whitespace-normal bg-linear-to-r from-white/20 to-white/5 shadow-[0_4px_10px_rgba(0,0,0,0.3)] drop-shadow-[1px_1px_2px_rgba(0,0,0,0.9)] vitrin-card-border-left-${idx}`}>
                <Home className={`w-[11px] h-[11px] shrink-0 vitrin-card-icon-color-${idx}`} /> 
                <span className="line-clamp-1 break-all overflow-hidden">{niche}</span>
            </span>
            <span className={`text-[12px] text-white font-bold tracking-wide border border-white/30 border-l-[3px] py-1.5 px-2.5 rounded-xl w-fit flex items-center gap-1.5 wrap-break-word shadow-[0_4px_10px_rgba(0,0,0,0.3)] drop-shadow-[1px_1px_2px_rgba(0,0,0,0.9)] bg-linear-to-r from-white/20 to-white/5 vitrin-card-border-left-${idx}`}>
                <User className={`w-[11px] h-[11px] shrink-0 vitrin-card-icon-color-${idx}`} /> Bireysel
            </span>
            <span className={`text-[12px] text-white font-bold tracking-wide border border-white/30 border-l-[3px] py-1.5 px-2.5 rounded-xl w-fit flex items-center gap-1.5 wrap-break-word shadow-[0_4px_10px_rgba(0,0,0,0.3)] drop-shadow-[1px_1px_2px_rgba(0,0,0,0.9)] bg-linear-to-r from-white/20 to-white/5 vitrin-card-border-left-${idx}`}>
                <CalendarHeart className={`w-[11px] h-[11px] shrink-0 vitrin-card-icon-color-${idx}`} /> Yaş {age}
            </span>
          </div>

          <div className="pointer-events-auto">
            <a 
              href={whatsappUrl}
              onClick={handleTrack}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white py-3.5 px-6 rounded-full text-[12px] font-black uppercase tracking-widest inline-flex items-center gap-2 border-[1.5px] border-white hover:scale-105 transition-transform bg-linear-to-r from-[#25D366] to-[#128C7E] animate-neon-pulse"
            >
              <MessageCircle className="w-4 h-4" /> İletişim
            </a>
          </div>
        </div>
      );
    } else if (layoutVariant === 1) {
      // Frosted Glassmorphism Variant (Bottom panel overlay)
      return (
        <div 
          className="absolute left-0 right-0 bottom-0 h-[48%] backdrop-blur-lg bg-black/60 z-10 p-3.5 flex flex-col justify-between border-t border-white/20 pointer-events-none"
        >
          <div className="flex items-center justify-between w-full">
            <div className={`italic text-[22px] text-white font-extrabold tracking-wider flex items-center gap-1.5 drop-shadow-md vitrin-card-name-${idx}`}>
              ✨ {firstName}
              {item.isAd && (
                <ShieldCheck className="w-[16px] h-[16px] text-green-400 shrink-0 drop-shadow-[0_0_8px_rgba(74,222,128,0.7)]" />
              )}
            </div>
            {item.isAd && (
              <span className="text-[11px] text-amber-400 font-extrabold tracking-widest border border-amber-500/40 bg-black/40 py-0.5 px-2 rounded-full">
                ⭐ 5.0 VERIFIED
              </span>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5 w-full">
            <span className="text-[12px] text-zinc-300 font-bold tracking-wide border border-white/10 bg-white/5 py-1 px-2.5 rounded-full shrink-0 flex items-center gap-1.5">
              <Home className="w-[10px] h-[10px] text-rose-400" />
              {niche}
            </span>
            <span className="text-[12px] text-zinc-300 font-bold tracking-wide border border-white/10 bg-white/5 py-1 px-2.5 rounded-full shrink-0 flex items-center gap-1.5">
              <CalendarHeart className="w-[10px] h-[10px] text-rose-400" />
              Yaş {age}
            </span>
          </div>

          <div className="pointer-events-auto mt-0.5">
            <a 
              href={whatsappUrl}
              onClick={handleTrack}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-white py-3.5 px-6 rounded-xl text-[12px] font-black uppercase tracking-widest inline-flex items-center justify-center gap-2 border border-white/10 bg-linear-to-r from-emerald-500 to-green-600 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
            >
              <MessageCircle className="w-4 h-4" /> WHATSAPP İLETİŞİM
            </a>
          </div>
        </div>
      );
    } else {
      // Gold/Bronze Luxury Variant (Left overlay with Gold themed accents)
      return (
        <div 
          className="absolute left-0 top-0 bottom-0 w-[42%] backdrop-blur-md z-10 p-4 flex flex-col justify-center items-start border-r border-amber-500/30 pointer-events-none bg-linear-to-br from-[#14100a]/90 to-[#050403]/96"
        >
          <div 
            className={`italic text-[26px] text-[#e5c158] font-bold tracking-widest mb-3 leading-none flex items-center gap-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] vitrin-card-name-${idx}`}
          >
            👑 {firstName}
            {item.isAd && (
              <ShieldCheck className="w-[16px] h-[16px] text-amber-400 shrink-0 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] animate-pulse" />
            )}
          </div>

          <div className="flex flex-col gap-1.5 mb-5 w-full pr-2">
            {item.isAd && (
              <span className="text-[11px] text-[#e5c158] font-black tracking-widest border border-amber-500/40 bg-amber-500/10 py-1 px-2 rounded-xl w-fit flex items-center gap-1 shrink-0">
                ⚜️ 5.0 VERIFIED
              </span>
            )}
            <span className="text-[12px] text-zinc-300 font-bold tracking-wide border border-amber-500/20 border-l-[3px] border-l-[#d4af37] py-1.5 px-2.5 rounded-xl w-fit flex items-center gap-1.5 bg-black/40">
              <Home className="w-[11px] h-[11px] text-[#d4af37] shrink-0" />
              <span className="line-clamp-1 break-all overflow-hidden">{niche}</span>
            </span>
            <span className="text-[12px] text-zinc-300 font-bold tracking-wide border border-amber-500/20 border-l-[3px] border-l-[#d4af37] py-1.5 px-2.5 rounded-xl w-fit flex items-center gap-1.5 bg-black/40">
              <User className="w-[11px] h-[11px] text-[#d4af37] shrink-0" /> Bireysel
            </span>
            <span className="text-[12px] text-zinc-300 font-bold tracking-wide border border-amber-500/20 border-l-[3px] border-l-[#d4af37] py-1.5 px-2.5 rounded-xl w-fit flex items-center gap-1.5 bg-black/40">
              <CalendarHeart className="w-[11px] h-[11px] text-[#d4af37] shrink-0" /> Yaş {age}
            </span>
          </div>

          <div className="pointer-events-auto">
            <a 
              href={whatsappUrl}
              onClick={handleTrack}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black py-3.5 px-6 rounded-full text-[12px] font-black uppercase tracking-widest inline-flex items-center gap-2 bg-linear-to-r from-[#e5c158] to-[#b8860b] hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(229,193,88,0.4)]"
            >
              <MessageCircle className="w-4 h-4" /> REZERVASYON
            </a>
          </div>
        </div>
      );
    }
  };

  const innerCard = (
    <div 
      className={`relative h-[280px] bg-black rounded-2xl overflow-hidden vitrin-card-border-${idx} ${isFlagship ? 'flagship-card-noise-' + (idx % 4) : ''}`}
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
          className={`flex h-full ${renderAllCarouselImages ? 'w-[200%] animate-scroll-images' : 'w-full'}`}
        >
          {renderAllCarouselImages ? (
            [0, 1, 2, 0, 1, 2].map((offset, scrollIdx) => {
              const charSum = (domainPrefix + firstName).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
              const blackHatOffset = (idx * 7 + scrollIdx * 11 + charSum) % 500;
              
              let currSeoPath = '';
              if (item.gallery && item.gallery.length > 0) {
                 currSeoPath = item.gallery[offset % item.gallery.length];
              } else {
                   const currentSafeIdx = getSafeVipProfileIdx((safeIdx + offset * 13 + blackHatOffset) % 221 + 1, idx + offset);
                   currSeoPath = isCustomImage && offset === 0 
                      ? item.src 
                      : `/_media/vitrin/vip-profil-${currentSafeIdx}.webp`;
              }
              
              const lsiNiches = ["eskort", "üniversiteli eskort", "rus escort", "sınırsız randevu", "anal buluşma", "kaporasız", "bayan escort", "gecelik bayan", "otele gelen eskort", "vip partner"];
              const domainLsi = lsiNiches[charSum % lsiNiches.length];
              const altTag = `${domainPrefix.toUpperCase()} ${generateGoldenAlt(city, idx + blackHatOffset)} - ${firstName} ${domainLsi} buluşmak için`;

              return (
                <div key={`scroll-${idx}-${scrollIdx}`} className="relative h-full w-[16.666%] border-l border-[#111] overflow-hidden bg-zinc-950">
                  <Image 
                    src={getSeoImageUrl(currSeoPath)} 
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
                        e.target.src = getSeoImageUrl(item.src);
                      } else {
                        const fallbackIdx = getSafeVipProfileIdx((safeIdx + offset * 13 + blackHatOffset + 1) % 221 + 1, idx + offset + 1);
                        const fallbackSrc = `/_media/vitrin/vip-profil-${fallbackIdx}.webp`;
                        e.target.src = isCustomImage && offset === 0 
                           ? getSeoImageUrl(item.src)
                           : getSeoImageUrl(fallbackSrc);
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
                   const currentSafeIdx = getSafeVipProfileIdx((safeIdx + blackHatOffset) % 221 + 1, idx);
                   currSeoPath = isCustomImage ? item.src : `/_media/vitrin/vip-profil-${currentSafeIdx}.webp`;
              }
              
              const lsiNiches = ["eskort", "üniversiteli eskort", "rus escort", "sınırsız randevu", "anal buluşma", "kaporasız", "bayan escort", "gecelik bayan", "otele gelen eskort", "vip partner"];
              const domainLsi = lsiNiches[charSum % lsiNiches.length];
              const altTag = `${domainPrefix.toUpperCase()} ${generateGoldenAlt(city, idx + blackHatOffset)} - ${firstName} ${domainLsi} buluşmak için`;

              return (
                <div className="relative h-full w-full overflow-hidden bg-zinc-950">
                  <Image 
                    src={getSeoImageUrl(currSeoPath)} 
                    alt={`${altTag} - Poz 1`}
                    title={`${domainPrefix} ${firstName} ${domainLsi}`}
                    fill
                    sizes="(max-width: 600px) 100vw, 300px"
                    priority={idx < 2}
                    className="object-contain object-center contrast-[1.05] brightness-95 relative z-10 drop-shadow-2xl"
                    onError={(e: any) => {
                      if (e.target.dataset.failed) return;
                      e.target.dataset.failed = 'true';
                      e.target.src = getSeoImageUrl(item.src);
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
          <div className="text-black text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-lg flex items-center gap-1 border border-black/20 bg-(--primary-color)">
            <AlertTriangle className="w-3 h-3" />
            REKLAM
          </div>
        </div>
      )}

      {renderOverlay()}
    </div>
  );

  return isFlagship ? (
    <figure 
      className="block text-inherit transition-transform duration-300 active:scale-95 group animate-fade-in m-0"
    >
      <style dangerouslySetInnerHTML={{ __html: dynamicCardCss }} />
      {innerCard}
    </figure>
  ) : (
    <div 
      className="block text-inherit transition-transform duration-300 active:scale-95 group animate-fade-in"
    >
      <style dangerouslySetInnerHTML={{ __html: dynamicCardCss }} />
      {innerCard}
    </div>
  );
}

export function DorukVitrin({ 
  city = 'İstanbul', 
  district = '',
  neighborhood = '',
  isEmbed = false, 
  host, 
  serverProfiles = [] 
}: { 
  city?: string, 
  district?: string,
  neighborhood?: string,
  isEmbed?: boolean, 
  host?: string,
  serverProfiles?: any[]
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [renderAllCarouselImages, setRenderAllCarouselImages] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  
  // 🛡️ [GOD-MODE] DYNAMIC THEME ENGINE INJECTION
  const theme = useMemo(() => {
    return ThemeEngine.getTheme(host || siteConfig.domain);
  }, [host]);

  // 🛡️ [GOD-MODE] SSR-SAFE SELECTION
  const initialImages = useMemo(() => {
    return vitrinImages.slice(0, 60);
  }, []);

  const getUniqueAdProfiles = (hostName: string) => {
    const premiumAds = vitrinImages.filter(img => img.isAd).slice(0, 6);
    
    let seed = 2166136261;
    const seedString = (hostName || 'default') + '-' + (city || '') + '-' + (district || '') + '-' + (neighborhood || '');
    for (let i = 0; i < seedString.length; i++) {
      seed = seed ^ seedString.charCodeAt(i);
      seed = Math.imul(seed, 16777619);
    }
    
    const adNames = [
      ["Melisa", "Selin", "Derin", "Simge", "Aleyna", "Buse"],
      ["Aynur", "Cansel", "Sude", "Ece", "Berna", "Ebru"],
      ["Svetlana", "Milena", "Elena", "Nadia", "Tanya", "Almira"],
      ["Ceren", "Aleyna", "Dilan", "Gizem", "Öykü", "Damla"],
      ["Ayla", "Merve", "Aslı", "Didem", "Pelin", "Bengü"],
      ["Esila", "Hazal", "Yağmur", "Gözde", "Banu", "Tuğba"]
    ];

    const adNiches = [
      ["Elite VIP Partner", "Ultra Lux Companion", "Premium Model Escort", "VIP Escort Bayan"],
      ["Kapalı VIP Escort", "Türbanlı Muhafazakar Eşlikçi", "Kapalı VIP Partner", "Özel Türbanlı Escort"],
      ["Elit Rus Model", "Premium Slavic Companion", "VIP Yabancı Model", "Premium Rus Escort"],
      ["VIP Elit Model", "Premium Escort Model", "Lüks Fantezi Partneri", "Elite VIP Companion"],
      ["Türk model - Ateşli Uzman", "VIP Yerli Eşlikçi", "Ateşli Üniversiteli Model", "Premium Yerli Escort"],
      ["Boşnak Eşlikçi - Ateşli", "VIP Balkan Güzeli", "Premium Sarışın Model", "Elite Boşnak Partner"]
    ];

    return premiumAds.map((ad, idx) => {
      let currentSeed = seed + idx * 37;
      
      const namesPool = adNames[idx % adNames.length];
      const spunName = namesPool[Math.abs(currentSeed) % namesPool.length];
      
      const nichesPool = adNiches[idx % adNiches.length];
      const spunNiche = nichesPool[Math.abs(currentSeed + 7) % nichesPool.length];
      
      const baseAge = ad.age || 26;
      const spunAge = baseAge + (Math.abs(currentSeed + 13) % 3) - 1;
      
      let spunGallery = ad.gallery ? [...ad.gallery] : [ad.src];
      const shiftCount = Math.abs(currentSeed) % spunGallery.length;
      for (let s = 0; s < shiftCount; s++) {
        const first = spunGallery.shift();
        if (first) spunGallery.push(first);
      }
      
      return {
        ...ad,
        title: spunName,
        niche: spunNiche,
        age: spunAge,
        src: spunGallery[0],
        gallery: spunGallery
      };
    });
  };

  const getFullPool = (hostName: string, sProfiles: any[]) => {
    const pinnedAds = getUniqueAdProfiles(hostName);
    const premiumAdSrcs = vitrinImages.filter(img => img.isAd).map(ad => ad.src);
    
    let organicPool: any[] = [];
    if (sProfiles && sProfiles.length > 0) {
      const cleanServer = sProfiles.filter(m => !premiumAdSrcs.includes(m.src));
      const pool = vitrinImages.filter(img => !img.isAd && !cleanServer.some(m => m.src === img.src));
      organicPool = [...cleanServer, ...pool];
    } else {
      organicPool = vitrinImages.filter(img => !img.isAd);
    }
    
    // Host-seeded deterministic shuffle
    let seed = 2166136261;
    const seedString = (hostName || 'default') + '-' + (city || '') + '-' + (district || '') + '-' + (neighborhood || '');
    for (let i = 0; i < seedString.length; i++) {
      seed = seed ^ seedString.charCodeAt(i);
      seed = Math.imul(seed, 16777619);
    }
    
    const shuffledOrganic = [...organicPool];
    let currentSeed = seed;
    for (let i = shuffledOrganic.length - 1; i > 0; i--) {
      currentSeed = (currentSeed * 1103515245 + 12345) % 2147483648;
      const j = Math.abs(currentSeed) % (i + 1);
      const temp = shuffledOrganic[i];
      shuffledOrganic[i] = shuffledOrganic[j];
      shuffledOrganic[j] = temp;
    }
    
    return [...pinnedAds, ...shuffledOrganic];
  };

  const [displayedImages, setDisplayedImages] = useState<any[]>(() => {
    return getFullPool(host || 'default', serverProfiles).slice(0, 4);
  });
  const [hasLoaded, setHasLoaded] = useState(serverProfiles && serverProfiles.length > 0);

  // pre-memoize shuffled names list to avoid O(N^2) complexity and recreation inside render loop
  const shuffledNames = useMemo(() => {
    let seed = 2166136261;
    const seedString = (host || 'default') + '-' + (city || '') + '-' + (district || '') + '-' + (neighborhood || '');
    for (let i = 0; i < seedString.length; i++) {
      seed = seed ^ seedString.charCodeAt(i);
      seed = Math.imul(seed, 16777619);
    }
    const rawNames = [
      "Buse", "Gizem", "Ayla", "Derin", "Selin", "Simge", "Melisa", "Tuğçe", 
      "Ebru", "Aleyna", "Burcu", "Cansel", "Sude", "Dilan", "Ece", "Berna", 
      "Didem", "Pelin", "Merve", "Aslı", "İrem", "Bengü", "Damla", "Hazal", 
      "Öykü", "Gamze", "Ceren", "Derya", "Seda", "Meltem", "Aylin",
      "Helin", "Elena", "Svetlana", "Milena", "Almira", "Ilgın", "Beste", 
      "Tanya", "Nadia", "Selinay", "Eylül", "Yaren", "Yağmur", "Gözde", 
      "Banu", "Tuğba", "Deniz", "Esra", "Fatma", "Hande",
      "İpek", "Jale", "Kader", "Lale", "Mine", "Nalan", "Oya", "Pınar",
    ];
    const result = [...rawNames];
    let currentSeed = seed;
    for (let i = result.length - 1; i > 0; i--) {
      currentSeed = (currentSeed * 1103515245 + 12345) % 2147483648;
      const j = Math.abs(currentSeed) % (i + 1);
      const temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }
    return result;
  }, [host, city, district, neighborhood]);

  useEffect(() => {
    setIsMounted(true);
    
    const full = getFullPool(host || 'default', serverProfiles);
    setDisplayedImages(full);

    // Progressive rendering chunks to prevent main thread blocking (FCP, LCP, TBT optimizations)
    if (typeof window !== 'undefined') {
      const loadNextChunk = (current: number) => {
        if (current >= 60) return;
        setTimeout(() => {
          setVisibleCount(prev => {
            const next = prev + 12;
            loadNextChunk(next);
            return next;
          });
        }, 150);
      };
      loadNextChunk(6);
    }

    // Only enable carousel animation on desktop screens (>= 768px) to maximize mobile performance
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      const timer = setTimeout(() => {
        setRenderAllCarouselImages(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [host, city, district, neighborhood]);

  useEffect(() => {
    if (hasLoaded) return;
    
    getActiveProfiles().then((dbProfiles) => {
      const masters = (dbProfiles as Array<{ title: string; src: string; phone?: string | null; niche?: string | null }>).map(m => ({
        title: m.title,
        src: m.src,
        phone: m.phone,
        niche: m.niche
      }));
      
      const full = getFullPool(host || 'default', masters);
      setDisplayedImages(full);
      setHasLoaded(true);
    }).catch(e => {
      const full = getFullPool(host || 'default', []);
      setDisplayedImages(full);
      setHasLoaded(true);
    });
  }, [hasLoaded, host, city, district, neighborhood]);

  const imagesToRender = displayedImages;

  if (!imagesToRender || imagesToRender.length === 0) return null;

  const dynamicGlobalCss = `
    .vitrin-outer-container {
      background-image: radial-gradient(circle at 50% 0%, ${theme.bgColor} 0%, #050204 60%) !important;
      background-color: #050204 !important;
      min-height: 100vh !important;
    }
    .vitrin-info-banner {
      background: linear-gradient(90deg, ${theme.primaryColor}, ${theme.glowEffect}, ${theme.primaryColor}) !important;
      background-size: 200% auto !important;
      border-color: ${theme.glowEffect} !important;
      animation: var(--animate-pulse-glow) !important;
    }
    .vitrin-info-banner-text {
      text-shadow: 0px 2px 4px rgba(0,0,0,0.9) !important;
    }
    .vitrin-warning-box {
      border-color: ${theme.primaryColor} !important;
      text-shadow: 1px 1px 2px #000 !important;
      animation: var(--animate-pulse-warning-box) !important;
    }
    .vitrin-warning-icon {
      color: ${theme.primaryColor} !important;
      animation: var(--animate-warning-blink) !important;
    }
    .vitrin-warning-highlight {
      color: ${theme.primaryColor} !important;
      text-shadow: 0 0 10px ${theme.glowEffect} !important;
    }
    .vitrin-global-cta {
      background-color: ${theme.primaryColor} !important;
      box-shadow: 0 10px 20px -5px ${theme.glowEffect} !important;
    }
  `;

  return (
    <div 
      className="w-full text-zinc-100 pb-20 pt-32 font-sans select-none overflow-hidden relative vitrin-outer-container" 
    >
      <style dangerouslySetInnerHTML={{ __html: dynamicGlobalCss }} />
      <div className={host?.includes('dorukcanay.digital') ? "max-w-5xl mx-auto flex flex-col pt-4" : "max-w-xl mx-auto flex flex-col pt-4"}>

        {/* 🔱 INFO BANNER (Dynamic Colors) */}
        <div className="rounded-[20px] p-4 text-center mb-10 border max-w-[90%] mx-auto flex flex-col gap-3 shadow-2xl vitrin-info-banner">
            <div className="text-white text-[13px] font-black leading-tight tracking-wider vitrin-info-banner-text">
                BU SİTEDE BULUNAN BAYANLAR TAMAMEN ELDEN ÖDEME İLE ÇALIŞMAKTADIRLAR.
            </div>
            
            <div className="bg-black/50 border-[1.5px] border-dashed rounded-xl p-3 text-white text-[11px] font-extrabold leading-snug tracking-wide vitrin-warning-box">
                <AlertTriangle className="inline-block w-4 h-4 mr-1 relative -top-0.5 vitrin-warning-icon" /> 
                YANINIZA GELMEDEN ÖNCE HERHANGİ BİR NEDENLE ATM'DEN VEYA HESABA HAVALE <span className="text-[13px] underline underline-offset-4 vitrin-warning-highlight">İSTEMEZLER!</span>
            </div>
        </div>

        {/* 📱 APP DOWNLOAD PROMO CARD */}
        <div className="bg-zinc-950/80 border-2 border-rose-600/30 p-6 rounded-[2rem] max-w-[90%] mx-auto mb-10 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-rose-600 transition-all duration-300 shadow-2xl relative overflow-hidden group">
          <div className="absolute -left-10 -top-10 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white font-extrabold flex items-center justify-center text-sm shadow-lg shadow-rose-600/20 shrink-0">
              DRK
            </div>
            <div>
              <h4 className="text-white font-bold text-[14px] uppercase tracking-wider flex items-center gap-1.5 leading-none">
                VIP Companion Mobile App
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                  ONLINE
                </span>
              </h4>
              <p className="text-zinc-400 text-xs mt-1 leading-snug">
                Cihazına kur, domain yasaklarından kurtul! Kaporasız VIP rehberi cebinde.
              </p>
            </div>
          </div>
          <Link
            href="/download-app"
            className="w-full md:w-auto px-6 py-3.5 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-rose-600 hover:text-white transition-colors duration-300 text-center shrink-0 shadow-md relative z-10"
          >
            Hemen İndir &gt;&gt;
          </Link>
        </div>

        {/* 🔱 CARDS LIST */}
        <div className={host?.includes('dorukcanay.digital') ? "grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-4" : "flex flex-col gap-8 w-full px-4"}>
          {imagesToRender.slice(0, visibleCount).map((item, idx) => {
            if (!item || !item.src) return null;
            
            const isOrganic = !item.isAd;
            const firstName = isOrganic 
              ? shuffledNames[idx % shuffledNames.length]
              : (item.title || 'VIP').split(' ')[0];

            const profileSlug = slugify(firstName);
            
            const niche = item.niche || FALLBACK_NICHES[idx % FALLBACK_NICHES.length];
            const age = item.age || (19 + (idx % 7));

            const domainPrefix = host ? host.split('.')[0] : 'doruk';
            const safeIdx = (idx % 221) + 1;
            
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
            className="w-full md:w-auto px-10 py-5 rounded-4xl text-sm font-black group relative overflow-hidden text-center text-white italic uppercase tracking-[0.3em] transition-all duration-300 vitrin-global-cta"
            target={isEmbed ? "_blank" : undefined}
          >
             <span className="relative z-10 flex items-center justify-center gap-3">
                İLETİŞİM VE BULUŞMAK İÇİN KATALOĞU GÖR <span className="opacity-50 tracking-tighter">{'>>>'}</span>
             </span>
             <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </Link>
        </div>

        {/* 🚀 DYNAMIC BLACK HAT SEO FOOTER TAG CLOUD */}
        <FooterTagCloud host={host} />

      </div>
    </div>
  );
}
