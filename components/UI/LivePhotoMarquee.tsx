"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { vitrinImages } from "../../lib/vitrin-images";
import { isBlacklisted } from "../../lib/vitrin-blacklist";
import { siteConfig } from "../../config/site";

// Collect all images from the advertising profiles (isAd: true)
const ALL_LIVE_PHOTOS = vitrinImages
  .filter(profile => profile.isAd)
  .reduce((acc, profile) => {
    if (profile.src) acc.push(profile.src);
    if (profile.gallery && Array.isArray(profile.gallery)) {
      profile.gallery.forEach(img => {
        if (img !== profile.src) {
          acc.push(img);
        }
      });
    }
    return acc;
  }, [] as string[]);

const LIVE_PHOTOS = ALL_LIVE_PHOTOS.filter(path => {
    const id = parseInt(path.split('-').pop()?.split('.')[0] || '0');
    return !isBlacklisted(id);
});

export function LivePhotoMarquee() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full overflow-hidden bg-black/50 backdrop-blur-md border-b border-rose-600/20 py-4 mb-8">
      <div className="flex gap-4 animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused] w-max">
        {/* Double the array for seamless looping */}
        {[...LIVE_PHOTOS, ...LIVE_PHOTOS].map((src, index) => {
          const fullSrc = src.startsWith('http') ? src : `${siteConfig.cdnUrl}${src}`;
          return (
            <div 
              key={index} 
              className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-rose-600/30 hover:border-rose-600 transition-colors shadow-glow-rose cursor-pointer flex-shrink-0"
            >
              <Image
                src={fullSrc}
                alt={`Live VIP Model ${index}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 96px, 128px"
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-bold text-white tracking-widest uppercase">CANLI</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
