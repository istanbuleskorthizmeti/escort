"use client";

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface SmartImageProps extends Omit<ImageProps, 'onError'> {
  fallbackUrl?: string;
  luxuryBorder?: boolean;
  glowEffect?: 'rose' | 'zinc' | 'orange' | 'none';
  seoContext?: string;
}

/**
 * DRKCNAY ELITE SMART IMAGE ENGINE v1.1
 * Features: High-performance WebP/AVIF, Automated Fallback, SEO Alt Injection, Elite Visuals.
 */
export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  fallbackUrl,
  className,
  luxuryBorder = false,
  glowEffect = 'none',
  seoContext,
  ...props
}) => {
  const getObfuscatedSrc = (originalSrc: any): any => {
    if (typeof originalSrc === 'string' && (originalSrc.startsWith('/') || originalSrc.startsWith('_media/'))) {
      if (!originalSrc.startsWith('/api/media')) {
        return `/api/media?src=${encodeURIComponent(originalSrc)}`;
      }
    }
    return originalSrc;
  };

  const [currentSrc, setCurrentSrc] = useState(() => getObfuscatedSrc(src));
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🛡️ [HYDRA-BLACK-HAT] Aggressive SEO Alt & Title Injection
  const aggressiveNiches = [
    "VIP Escort Numaraları", "Elit Partner", "Kaporasız Escort Bayan", 
    "Rus VIP Escort", "Üniversiteli VIP Escort", "Eve Gelen Lüks Escort",
    "Otel Servis VIP Escort", "En İyi Escort Ajansı", "Gerçek Görselli Escort",
    "Bireysel Escort İlanları", "İstanbul Elit Escort", "Luxury Companion"
  ];
  
  // Deterministic pick based on src string to keep it stable per image
  const hash = typeof src === 'string' ? src.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) : 0;
  const niche = aggressiveNiches[Math.abs(hash) % aggressiveNiches.length];

  const finalAlt = seoContext 
    ? `${seoContext} ${niche} | DRKCNAY ELITE` 
    : `${alt || 'VIP Escort'} - ${niche} | DRKCNAY`;
  
  const finalTitle = `${niche} - ${seoContext || 'Elit Hizmet'}`;

  const handleError = () => {
    if (!hasError && fallbackUrl) {
      setCurrentSrc(fallbackUrl);
      setHasError(true);
    } else if (!hasError) {
      // Logic for backup server offloading if no specific fallback provided
      const backupBase = "https://backup.istanbulescort.blog/images/";
      if (typeof src === 'string' && src.startsWith('/')) {
        setCurrentSrc(`${backupBase}${src.replace(/^\//, '')}`);
        setHasError(true);
      }
    }
  };

  const glowClasses = {
    rose: "shadow-[0_0_30px_rgba(225,29,72,0.2)] hover:shadow-[0_0_50px_rgba(225,29,72,0.4)]",
    zinc: "shadow-[0_0_30px_rgba(39,39,42,0.2)] hover:shadow-[0_0_50px_rgba(39,39,42,0.4)]",
    orange: "shadow-[0_0_30px_rgba(255,134,0,0.2)] hover:shadow-[0_0_50px_rgba(255,134,0,0.4)]",
    none: ""
  };

  return (
    <div className={cn(
      "relative overflow-hidden transition-all duration-700 ease-out bg-zinc-900/10",
      luxuryBorder && "rounded-[2rem] border border-zinc-800/50",
      glowEffect !== 'none' && glowClasses[glowEffect],
      isLoading ? "scale-[0.98] opacity-50 blur-md" : "scale-100 opacity-100 blur-0",
      className
    )}>
      <Image
        src={currentSrc}
        alt={finalAlt}
        title={finalTitle}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        className={cn(
          "transition-all duration-700",
          isLoading ? "scale-110" : "scale-100"
        )}
        {...props}
      />
      {/* Glossy Overlay for Elite Feel */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-tr from-black/20 via-transparent to-white/5 opacity-30" />
    </div>
  );
};
