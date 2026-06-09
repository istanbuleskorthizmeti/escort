"use client";

import Image from "next/image";
import { vitrinImages } from "../../lib/vitrin-images";
import { isBlacklisted } from "../../lib/vitrin-blacklist";
import { siteConfig } from "../../config/site";
import { generateGoldenAlt } from "../../lib/seo/traffic-monster";

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

export function LivePhotoMarquee({ city = "İstanbul" }: { city?: string }) {
  const visiblePhotos = [...LIVE_PHOTOS, ...LIVE_PHOTOS].slice(0, 16);

  const realisticNames = [
    "Buse", "Gizem", "Ayla", "Derin", "Selin", "Simge", "Melisa", "Tuğçe", 
    "Ebru", "Aleyna", "Burcu", "Cansel", "Sude", "Dilan", "Ece", "Berna", 
    "Didem", "Pelin", "Merve", "Aslı", "İrem", "Bengü", 
    "Damla", "Hazal", "Öykü", "Gamze", "Ceren", "Derya", "Seda", "Meltem"
  ];

  return (
    <div className="w-full overflow-hidden bg-black/50 backdrop-blur-md border-b border-rose-600/20 py-4 mb-8">
      <div className="flex gap-4 animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused] w-max">
        {/* Double the array for seamless looping */}
        {visiblePhotos.map((src, index) => {
          const fullSrc = src.startsWith('http') ? src : `${siteConfig.cdnUrl}${src}`;
          const modelName = realisticNames[index % realisticNames.length];
          const altText = `${city.toUpperCase()} ${generateGoldenAlt(city, index)} - ${modelName} Canlı Görsel`;
          const titleText = `${city} ${modelName} Canlı Görüşme Fotoğrafı`;
          
          return (
            <div 
              key={index} 
              className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-rose-600/30 hover:border-rose-600 transition-colors shadow-glow-rose cursor-pointer shrink-0 ${
                index >= 8 ? "hidden md:block" : ""
              }`}
            >
              <Image
                src={fullSrc}
                alt={altText}
                title={titleText}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 96px, 128px"
                priority={index < 3}
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
