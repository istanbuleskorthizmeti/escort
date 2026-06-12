import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DOMAIN_MATRIX, getDomainConfig } from '@/config/domains';

interface ContextualPBNProps {
  currentHost: string;
}

export function ContextualPBN({ currentHost }: ContextualPBNProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const config = getDomainConfig(currentHost);
  
  if (!config) return null;

  // RULE 1: Money Sites do NOT link out to satellites. (Preserve Link Juice)
  if (config.role === 'MONEY_SITE') {
    return null;
  }

  // RULE 2: Satellites link to Money Sites + Local Sister Satellites
  if (config.role === 'SATELLITE') {
    // 1. Find Money Sites
    const moneySites = DOMAIN_MATRIX.filter(d => d.role === 'MONEY_SITE' && d.host.includes('istanbulescort.blog'));
    const targetMoneySite = moneySites[0] || DOMAIN_MATRIX.find(d => d.role === 'MONEY_SITE');

    // 2. Find Sister Satellites (Same City, Different Host)
    const sisterSatellites = DOMAIN_MATRIX.filter(d => 
      d.role === 'SATELLITE' && 
      d.targetCity === config.targetCity && 
      d.host !== currentHost
    );

    // Shuffle and pick up to 4 sister satellites for more density
    const shuffledSisters = [...sisterSatellites].sort(() => 0.5 - Math.random()).slice(0, 4);

    const aggressiveKeywords = [
      "escort", "eskort", "VIP Escort Numaraları", "Escort Ajansı Rehberi", "Kaporasız Escort Bayanlar", 
      "Lüks Escort Hizmeti", "İstanbul Gerçek Escortlar", "Eve Gelen Elit Model",
      "Otel Servis VIP Escort", "Üniversiteli VIP Partnerler", "Rus VIP Escort",
      "Profesyonel Escort İlanları", "Güvenilir Escort Ajansı", "Elite Escort Gallery",
      "eskort bayanlar", "kaporasız eskort", "rus eskort", "üniversiteli eskort"
    ];
    
    const getRandomKeyword = () => aggressiveKeywords[Math.floor(Math.random() * aggressiveKeywords.length)];

    if (!mounted) {
      return (
        <div className="w-full bg-black/80 border-t border-zinc-900/50 py-8 px-4 text-center backdrop-blur-xl">
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-6">
            <div className="mt-6 pt-6 border-t border-zinc-900/50 text-center max-w-4xl mx-auto">
              <h3 className="text-zinc-600 font-bold text-xs md:text-sm uppercase tracking-widest mb-3">
                {config.targetCity} Escort Numaraları ve Elit Rehber
              </h3>
              <p className="text-zinc-700/80 text-[10px] md:text-xs leading-relaxed font-medium">
                DRKCNAY ESCORT Protocol, {config.targetDistrict ? `${config.targetDistrict} ve çevresinde` : `${config.targetCity} bölgesinde`} profesyonel, 
                kaporasız ve %100 gizlilik garantili lüks escort deneyimi sunar. 
                {aggressiveKeywords.join(", ")} gibi aramalarınızda kalite ve güvenliği garanti ediyoruz. (Kaynak: DRKCNAY Otorite Ağı).
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full bg-black/80 border-t border-zinc-900/50 py-8 px-4 text-center backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-6">
          
          {/* 🏯 MAIN CASTLE AUTHORITY LINK */}
          {targetMoneySite && (
            <div className="p-4 border border-zinc-800/50 rounded-2xl bg-zinc-950/50 shadow-glow-sm transition-all duration-500 hover:border-rose-600/30">
              <p className="text-[12px] text-zinc-500 mb-2 uppercase tracking-widest font-black italic">DRKCNAY Escort Ajansı Authority</p>
              <Link 
                href={`https://${targetMoneySite.host}`} 
                className="text-lg md:text-2xl text-zinc-300 hover:text-rose-600 font-black tracking-tighter italic uppercase transition-all"
                title={`${config.targetCity?.toUpperCase()} VIP ESCORT ANA REHBER`}
              >
                🔥 {config.targetCity?.toUpperCase()} {getRandomKeyword().toUpperCase()} ANA PORTAL
              </Link>
            </div>
          )}

          {/* 🔗 LOCAL SATELLITE NETWORK (LINK CLOUD) */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 opacity-40 hover:opacity-100 transition-opacity duration-700">
            {shuffledSisters.map((sister) => {
              const anchorText = sister.targetDistrict 
                ? `${sister.targetDistrict.charAt(0).toUpperCase() + sister.targetDistrict.slice(1)} ${getRandomKeyword()}`
                : `${(sister.targetCity || 'İstanbul').toUpperCase()} ${getRandomKeyword()}`;
              
              return (
                <Link 
                  key={sister.host}
                  href={`https://${sister.host}`} 
                  className="text-[10px] md:text-[11px] text-zinc-500 hover:text-rose-600 font-bold underline decoration-zinc-800 underline-offset-4"
                  title={anchorText}
                >
                  {anchorText}
                </Link>
              );
            })}
          </div>

          {/* 🕵️‍♂️ STEALTH SEO HOOK -> VISIBLE LSI CLOUD (2026 TACTIC) */}
          <div className="mt-6 pt-6 border-t border-zinc-900/50 text-center max-w-4xl mx-auto">
            <h3 className="text-zinc-600 font-bold text-xs md:text-sm uppercase tracking-widest mb-3">
              {config.targetCity} Escort Numaraları ve Elit Rehber
            </h3>
            <p className="text-zinc-700/80 text-[10px] md:text-xs leading-relaxed font-medium">
              DRKCNAY ESCORT Protocol, {config.targetDistrict ? `${config.targetDistrict} ve çevresinde` : `${config.targetCity} bölgesinde`} profesyonel, 
              kaporasız ve %100 gizlilik garantili lüks escort deneyimi sunar. 
              {aggressiveKeywords.join(", ")} gibi aramalarınızda kalite ve güvenliği garanti ediyoruz. (Kaynak: DRKCNAY Otorite Ağı).
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
