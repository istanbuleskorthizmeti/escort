import React from 'react';
import Link from 'next/link';

interface DistrictLink {
  name: string;
  slug: string;
}

const DISTRICTS: DistrictLink[] = [
  { name: 'Şişli', slug: 'sisli' },
  { name: 'Beşiktaş', slug: 'besiktas' },
  { name: 'Kadıköy', slug: 'kadikoy' },
  { name: 'Bakırköy', slug: 'bakirkoy' },
  { name: 'Beylikdüzü', slug: 'beylikduzu' },
  { name: 'Florya', slug: 'florya' },
  { name: 'Ataşehir', slug: 'atasehir' },
  { name: 'Fatih', slug: 'fatih' },
  { name: 'Maltepe', slug: 'maltepe' },
  { name: 'Üsküdar', slug: 'uskudar' },
  { name: 'Sarıyer', slug: 'sariyer' },
  { name: 'Bahçelievler', slug: 'bahcelievler' },
  { name: 'Kartal', slug: 'kartal' },
  { name: 'Esenyurt', slug: 'esenyurt' },
  { name: 'Avcılar', slug: 'avcilar' },
  { name: 'Pendik', slug: 'pendik' },
  { name: 'Kağıthane', slug: 'kagithane' },
  { name: 'Zeytinburnu', slug: 'zeytinburnu' },
  { name: 'Ümraniye', slug: 'umraniye' },
  { name: 'Eyüpsultan', slug: 'eyupsultan' }
];

interface FooterTagCloudProps {
  host?: string;
}

export const FooterTagCloud: React.FC<FooterTagCloudProps> = ({ host }) => {
  const isFlagship = host?.includes('dorukcanay.digital');

  return (
    <div className="w-full bg-[#0a0a0a] border-t border-zinc-900 py-12 px-6 mt-16 relative z-30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-(--primary-color) text-sm font-black uppercase tracking-[0.25em] mb-2">
            {isFlagship ? "DORUKCANAY ELITE VIP MODEL REHBERİ & BÖLGESEL HİZMET AĞI" : "İSTANBUL ESCORT ESKORT VIP BAYAN REHBERİ & BÖLGELER"}
          </h2>
          <p className="text-zinc-500 text-xs max-w-2xl mx-auto leading-relaxed">
            {isFlagship ? (
              <>İstanbul genelinde lüks ve prestijli refakatçi seansları sunan seçkin bağımsız model partnerlerimize ve bölgesel hizmet alanlarımıza aşağıdaki listeden ulaşabilirsiniz.</>
            ) : (
              <>İstanbul genelinde buluşmak için eskort bayan, randevu için vip partner ve iletişim için escort bayan arayanlara özel bölgesel kataloglarımıza ve detaylı rehberlerimize aşağıdaki bağlantılardan ulaşabilirsiniz.</>
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {DISTRICTS.map((district) => {
            const niches = isFlagship
              ? [
                  'Vip Escort',
                  'Elite Eskort',
                  'Lüks Partner',
                  'VIP Companion',
                  'Premium Model',
                  'Seçkin Eşlik'
                ]
              : [
                  'Escort Bayan',
                  'Eskort Bayan',
                  'Elite Eskort',
                  'VIP Partner',
                  'Randevu İçin Escort',
                  'Buluşmak İçin Eskort'
                ];
            // Deterministic selection based on length to maintain hydration stability
            const niche = niches[district.name.length % niches.length];

            return (
              <Link
                key={district.slug}
                href={`/istanbul/${district.slug}`}
                title={`${district.name} ${niche} 2026 Kılavuzu`}
                className="group block p-3 bg-zinc-950/40 border border-zinc-900/60 rounded-xl hover:border-(--primary-color)/30 hover:bg-zinc-900/20 transition-all duration-300 text-left"
              >
                <span className="block text-zinc-400 group-hover:text-(--primary-color) text-xs font-bold transition-colors">
                  {district.name}
                </span>
                <span className="block text-zinc-600 group-hover:text-zinc-500 text-[10px] uppercase tracking-wider mt-0.5">
                  {niche}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-900/60 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-zinc-600 text-[11px]">
            {isFlagship ? "© 2026 Dorukcanay Elite VIP Rehberi. Tüm Hakları Saklıdır." : "© 2026 Escort Eskort VIP Bayan Hizmeti. Tüm Hakları Saklıdır."}
          </span>
          <div className="flex gap-4">
            <Link 
              href="/"
              className="text-zinc-500 hover:text-(--primary-color) text-[11px] font-medium transition-colors"
            >
              {isFlagship ? "Lüks Refakatçi Ana Sayfa" : "Buluşmak ve Randevu İçin Ana Sayfa"}
            </Link>
            <a 
              href="/ULTIMATE_VIP_GUIDE_2026.pdf" 
              target="_blank"
              className="text-zinc-500 hover:text-(--primary-color) text-[11px] font-medium transition-colors"
            >
              Detaylı Rehber PDF İndir
            </a>
            <a 
              href="https://escort-randevu.stoplight.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-(--primary-color) text-[11px] font-medium transition-colors"
            >
              API Dokümantasyonu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterTagCloud;
