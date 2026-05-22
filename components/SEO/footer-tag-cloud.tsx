import React from 'react';
import Link from 'next/link';

interface DistrictLink {
  name: string;
  slug: string;
  bitly: string;
}

const DISTRICTS: DistrictLink[] = [
  { name: 'Şişli', slug: 'sisli', bitly: 'https://bit.ly/sisli-vip-escort-2026' },
  { name: 'Beşiktaş', slug: 'besiktas', bitly: 'https://bit.ly/besiktas-vip-escort-2026' },
  { name: 'Kadıköy', slug: 'kadikoy', bitly: 'https://bit.ly/kadikoy-vip-escort-2026' },
  { name: 'Bakırköy', slug: 'bakirkoy', bitly: 'https://bit.ly/bakirkoy-vip-escort-2026' },
  { name: 'Beylikdüzü', slug: 'beylikduzu', bitly: 'https://bit.ly/beylikduzu-vip-escort-2026' },
  { name: 'Florya', slug: 'florya', bitly: 'https://bit.ly/florya-vip-escort-2026' },
  { name: 'Ataşehir', slug: 'atasehir', bitly: 'https://bit.ly/atasehir-vip-escort-2026' },
  { name: 'Fatih', slug: 'fatih', bitly: 'https://bit.ly/fatih-vip-escort-2026' },
  { name: 'Maltepe', slug: 'maltepe', bitly: 'https://bit.ly/maltepe-vip-escort-2026' },
  { name: 'Üsküdar', slug: 'uskudar', bitly: 'https://bit.ly/uskudar-vip-escort-2026' },
  { name: 'Sarıyer', slug: 'sariyer', bitly: 'https://bit.ly/sariyer-vip-escort-2026' },
  { name: 'Bahçelievler', slug: 'bahcelievler', bitly: 'https://bit.ly/bahcelievler-vip-escort-2026' },
  { name: 'Kartal', slug: 'kartal', bitly: 'https://bit.ly/kartal-vip-escort-2026' },
  { name: 'Esenyurt', slug: 'esenyurt', bitly: 'https://bit.ly/esenyurt-vip-escort-2026' },
  { name: 'Avcılar', slug: 'avcilar', bitly: 'https://bit.ly/avcilar-vip-escort-2026' },
  { name: 'Pendik', slug: 'pendik', bitly: 'https://bit.ly/pendik-vip-escort-2026' },
  { name: 'Kağıthane', slug: 'kagithane', bitly: 'https://bit.ly/kagithane-vip-escort-2026' },
  { name: 'Zeytinburnu', slug: 'zeytinburnu', bitly: 'https://bit.ly/zeytinburnu-vip-escort-2026' },
  { name: 'Ümraniye', slug: 'umraniye', bitly: 'https://bit.ly/umraniye-vip-escort-2026' },
  { name: 'Eyüpsultan', slug: 'eyupsultan', bitly: 'https://bit.ly/eyupsultan-vip-escort-2026' }
];

export const FooterTagCloud: React.FC = () => {
  return (
    <div className="w-full bg-[#0a0a0a] border-t border-zinc-900 py-12 px-6 mt-16 relative z-30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-[#b8860b] text-sm font-black uppercase tracking-[0.25em] mb-2">
            İSTANBUL VIP ESCORT REHBERİ & BÖLGELER
          </h2>
          <p className="text-zinc-500 text-xs max-w-2xl mx-auto leading-relaxed">
            İstanbul genelinde en yüksek memnuniyet ve gizlilik prensipleri ile hizmet veren profesyonel partnerlerimizin 
            bölgesel kataloglarına ve detaylı rehberlerine aşağıdaki özel bağlantılardan ulaşabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {DISTRICTS.map((district) => {
            const niches = [
              'Vip Escort',
              'Elit Partner',
              'Rus Escort',
              'Kaporasız Hizmet'
            ];
            // Deterministic selection based on length to maintain hydration stability
            const niche = niches[district.name.length % niches.length];

            return (
              <a
                key={district.slug}
                href={district.bitly}
                target="_blank"
                rel="noopener noreferrer"
                title={`${district.name} ${niche} 2026 Kılavuzu`}
                className="group block p-3 bg-zinc-950/40 border border-zinc-900/60 rounded-xl hover:border-[#b8860b]/30 hover:bg-zinc-900/20 transition-all duration-300 text-left"
              >
                <span className="block text-zinc-400 group-hover:text-[#b8860b] text-xs font-bold transition-colors">
                  {district.name}
                </span>
                <span className="block text-zinc-600 group-hover:text-zinc-500 text-[10px] uppercase tracking-wider mt-0.5">
                  {niche}
                </span>
              </a>
            );
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-900/60 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-zinc-600 text-[11px]">
            © 2026 Vip Escort Hizmeti. Tüm Hakları Saklıdır.
          </span>
          <div className="flex gap-4">
            <a 
              href="https://bit.ly/dorukcanmanay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-[#b8860b] text-[11px] font-medium transition-colors"
            >
              Ana Sayfa VIP Rehberi
            </a>
            <a 
              href="/ULTIMATE_VIP_GUIDE_2026.pdf" 
              target="_blank"
              className="text-zinc-500 hover:text-[#b8860b] text-[11px] font-medium transition-colors"
            >
              Vektör PDF İndir
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterTagCloud;
