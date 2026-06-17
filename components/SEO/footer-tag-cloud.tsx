import React, { useMemo } from 'react';
import { ISTANBUL_DISTRICTS } from '@/lib/istanbul-aggressive-seo';
import { slugify } from '@/lib/utils';

interface FooterTagCloudProps {
  host?: string;
}

export const FooterTagCloud: React.FC<FooterTagCloudProps> = ({ host }) => {
  const isFlagship = host?.includes('dorukcanay.digital');
  const currentYear = new Date().getFullYear();

  // 🛡️ [GOD-MODE] Programmatic Cartesian Generation of 5,460 LSI Keyword Links
  // Bypasses React Virtual DOM reconciliation overhead via HTML memoization
  const seoTagCloudHtml = useMemo(() => {
    const niches = [
      'Escort', 'Eskort', 'Vip Escort', 'Rus Escort', 
      'Bayan Escort', 'Bireysel Escort', 'Üniversiteli Escort', 
      'Sarışın Escort', 'Yabancı Escort', 'Genç Eskort'
    ];

    const modifiers = [
      'Kaporasız', 'Ön Ödemesiz', 'Gerçek Resimli', 'Elit', 
      'Premium', 'VIP', 'WhatsApp', 'Telefon Numarası', 
      'Buluşma', 'Randevu', 'İlanları', 'Rehberi', 'Gecelik', 'Saatlik'
    ];

    let html = '';
    let count = 0;

    // Loop through districts, niches, and modifiers to build 5,460 combinations
    for (const district of ISTANBUL_DISTRICTS) {
      const districtSlug = slugify(district);
      for (const niche of niches) {
        for (const modifier of modifiers) {
          const keyword = `${district} ${modifier} ${niche} ${currentYear}`;
          const url = `/istanbul/${districtSlug}`;
          
          // Render raw HTML anchors to optimize paint and layout times (TBT/LCP protection)
          html += `<a href="${url}" title="${keyword}" class="text-zinc-700 hover:text-rose-600 transition-colors duration-200">#${keyword.replace(/\s+/g, '')}</a>`;
          count++;
          if (count >= 5200) break; // Safety cap
        }
        if (count >= 5200) break;
      }
      if (count >= 5200) break;
    }

    return html;
  }, [currentYear]);

  return (
    <div className="w-full bg-[#050204]/90 border-t border-zinc-900/60 py-16 px-6 mt-20 relative z-30">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-10">
          <h2 className="text-(--primary-color) text-xs font-black uppercase tracking-[0.3em] mb-4">
            {isFlagship 
              ? "DRKCNAY VIP ESCORT AJANSI // BÖLGESEL LİSTE REHBERİ" 
              : "İSTANBUL VIP PARTNER VE LOKASYON LİSTESİ"
            }
          </h2>
          <p className="text-zinc-500 text-xs max-w-3xl mx-auto leading-relaxed italic">
            {isFlagship 
              ? "İstanbul genelinde VIP partnerlik, lüks refakatçi ve elit eşlik hizmeti sunan doğrulanmış model profillerimizin bölgesel indeksleme arşivi. Tüm profiller kaporasızdır."
              : "İstanbul bölgesinde buluşmak için eskort bayan, randevu için vip partner ilanları ve telefon numaraları arşivi. Doğrulanmış lokasyon listesi."
            }
          </p>
        </div>

        {/* Scrollable SEO Tag Container */}
        <div className="relative rounded-3xl border border-zinc-900/80 bg-black/60 p-6">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/80 to-transparent pointer-events-none rounded-t-3xl" />
          
          <div 
            className="max-h-64 overflow-y-auto flex flex-wrap gap-x-4 gap-y-2 text-[9px] font-bold uppercase tracking-wider text-zinc-800 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pr-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: seoTagCloudHtml }}
          />

          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none rounded-b-3xl" />
        </div>

        <div className="mt-10 pt-8 border-t border-zinc-900/40 text-center flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-semibold">
            © 2026 DRKCNAY VIP ESCORT AJANSI NETWORK. ALL RIGHTS RESERVED.
          </span>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-widest font-black italic">
            <Link href="/" className="text-zinc-500 hover:text-rose-600 transition-colors">
              GÜVENLİ ANA SAYFA
            </Link>
            <a href="/ULTIMATE_VIP_GUIDE_2026.pdf" target="_blank" className="text-zinc-500 hover:text-rose-600 transition-colors">
              REHBER DÖKÜMANI
            </a>
            <a href="https://escort-randevu.stoplight.io/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-rose-600 transition-colors">
              API GATEWAY
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
export default FooterTagCloud;
