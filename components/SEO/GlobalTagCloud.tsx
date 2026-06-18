import Link from 'next/link';
import { getDomainConfig } from '@/config/domains';
import { GeoLogicService } from '@/lib/seo/geo-logic';
import { slugify } from '@/lib/utils';

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
  const isMoneySite = currentHost === 'istanbulescort.blog' || currentHost === 'vipescorthizmeti.shop' || currentHost === 'escortvip.net' || currentHost === 'dorukcanay.digital';
  const config = getDomainConfig(currentHost);

  // Expanded cities and districts for hyper-local SEO
  const locations = GeoLogicService.getLocalLocations(config.targetDistrict, config.role);

  // High-volume aggressive keywords including 'eskort' variants
  const escortKeywords = [
    "escort", "eskort", "vip escort", "vip eskort", "escort bayan", "eskort bayan", 
    "eve gelen escort", "eve gelen eskort", "otele gelen escort", "otele gelen eskort",
    "vip escort transfer", "vip eskort transfer", "elit escort", "elit eskort", 
    "kaporasız escort", "kaporasız eskort", "yabancı escort", "yabancı eskort", 
    "rus escort", "rus eskort", "üniversiteli escort", "üniversiteli eskort", 
    "sarışın escort", "sarışın eskort", "esmer escort", "esmer eskort", "zengin escort",
    "lüks escort transfer", "premium eşlik", "elit partner", "istanbul escort", "istanbul eskort", 
    "özel şoförlü escort", "havalimanı vip karşılama", "gizli otel intikali"
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

  const CITIES = ["istanbul", "ankara", "izmir", "antalya", "bursa", "adana", "muğla", "eskişehir", "kocaeli", "mersin", "gaziantep", "kayseri"];

  // Add 100 targeted links (no plain text to prevent keyword stuffing penalties)
  for (let i = 0; i < 100; i++) {
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const kw = activeKeywords[Math.floor(Math.random() * activeKeywords.length)];
    const text = `${loc} ${kw}`;
    const locSlug = slugify(loc);
    
    const isCity = CITIES.includes(loc.toLowerCase());
    const path = isCity ? `/${locSlug}` : `/istanbul/${locSlug}`;
    
    // Satellites and cloakers link to flagship, money sites link internally
    const targetBase = isMoneySite ? "" : "https://dorukcanay.digital";
    const href = `${targetBase}${path}`;

    cloudItems.push({
      text: text,
      href: href
    });
  }

  cloudItems = shuffleArray(cloudItems);

  return (
    <div className="w-full bg-black border-t border-zinc-900 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity duration-500">
        {cloudItems.map((item, idx) => {
          return (
            <Link
              key={idx}
              href={item.href}
              className="text-[10px] text-zinc-400 hover:text-[#ff8600] uppercase font-bold tracking-tighter whitespace-nowrap transition-colors"
              title={`${item.text} Ajansı`}
            >
              {item.text}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
