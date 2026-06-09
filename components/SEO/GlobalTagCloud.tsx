import Link from 'next/link';
import { getDomainConfig } from '@/config/domains';
import { GeoLogicService } from '@/lib/seo/geo-logic';

interface GlobalTagCloudProps {
  currentHost: string;
}

// 🎲 Randomly shuffle keywords
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function GlobalTagCloud({ currentHost }: GlobalTagCloudProps) {
  const isMoneySite = currentHost === 'istanbulescort.blog' || currentHost === 'vipescorthizmeti.shop' || currentHost === 'escortvip.net';
  const config = getDomainConfig(currentHost);

  // Expanded cities and districts for hyper-local SEO
  const locations = GeoLogicService.getLocalLocations(config.targetDistrict, config.role);

  // High-volume aggressive keywords including 'eskort' variants
  const escortKeywords = [
    "escort", "vip escort", "escort bayan", "eve gelen escort", "otele gelen escort",
    "vip escort transfer", "elit escort", "kaporasız escort", "yabancı escort", "rus escort",
    "üniversiteli escort", "sarışın escort", "esmer escort", "zengin escort",
    "lüks escort transfer", "premium eşlik", "elit partner", "istanbul escort", "özel şoförlü escort",
    "havalimanı vip karşılama", "gizli otel intikali", "vip havaalanı escort", "lüks yat transferi", "helikopter karşılama"
  ];

  // Scandal / Honey-Pot keywords for CLOAKER domains
  const scandalKeywords = [
    "ifşa", "skandal görüntüler", "gizli çekim", "telegram ifşa", "sansürsüz", 
    "kaset skandalı", "vip ifşa", "sosyete skandalı", "sızdırılan görüntüler", 
    "gizli kamera", "yasak aşk", "özel görüntüler", "şok video", "magazin ifşa",
    "kemerburgaz ifşa", "göktürk skandalı", "bebek ifşa", "etiler gizli çekim"
  ];

  const activeKeywords = config.role === 'CLOAKER' ? scandalKeywords : escortKeywords;

  // Generate a cloud of 100 items for "Nuclear Seeding"
  let cloudItems = [];

  // Add 40 City-specific Money Site Backlinks
  for (let i = 0; i < 40; i++) {
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const kw = activeKeywords[Math.floor(Math.random() * activeKeywords.length)];
    const text = `${loc} ${kw}`;
    cloudItems.push({
      text: text,
      isLink: true,
      href: `https://istanbulescort.blog/${loc}`
    });
  }

  // Add 60 aggressive non-link keywords to boost density
  for (let i = 0; i < 60; i++) {
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const kw = activeKeywords[Math.floor(Math.random() * activeKeywords.length)];
    cloudItems.push({
      text: `${loc} ${kw}`,
      isLink: false
    });
  }

  cloudItems = shuffleArray(cloudItems);

  return (
    <div className="w-full bg-black border-t border-zinc-900 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity duration-500">
        {cloudItems.map((item, idx) => {
          if (item.isLink && !isMoneySite) {
            return (
              <Link
                key={idx}
                href={item.href!}
                className="text-[10px] text-zinc-400 hover:text-[#ff8600] uppercase font-bold tracking-tighter whitespace-nowrap transition-colors"
                title={`${item.text} Ajansı`}
              >
                {item.text}
              </Link>
            );
          }
          return (
            <span
              key={idx}
              className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter whitespace-nowrap cursor-default"
            >
              {item.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
