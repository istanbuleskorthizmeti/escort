'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Globe, MapPin, ShieldCheck } from 'lucide-react';

interface AuthorityLink {
  url: string;
  label: string;
}

/**
 * LOCAL DISCOVERY ENGINE (Zero-Trace)
 * Dinamik olarak popüler bölgeleri ve rehberleri listeler.
 */
export const LocalDiscovery = () => {
  const [links, setLinks] = useState<AuthorityLink[]>([]);

  useEffect(() => {
    // Genişletilmiş ve anonimleştirilmiş link havuzu
    const discoveryPool = [
      { url: '/istanbul/sisli', label: 'Şişli VIP Rehber' },
      { url: '/istanbul/besiktas', label: 'Beşiktaş Elit Deneyim' },
      { url: '/istanbul/bakirkoy', label: 'Bakırköy Premium' },
      { url: '/ankara/cankaya', label: 'Çankaya Özel Eşlik' },
      { url: '/izmir/alsancak', label: 'Alsancak VIP Partner' },
      { url: '/antalya/muratpasa', label: 'Muratpaşa Rehberi' },
      { url: '/bursa/nilufer', label: 'Nilüfer Elit Seçenekler' },
      { url: '/istanbul/kadikoy', label: 'Kadıköy VIP Standart' },
      { url: '/istanbul/atasehir', label: 'Ataşehir Elite' },
      { url: '/mugla/bodrum', label: 'Bodrum Premium Esc' }
    ];

    // Her sayfa yüklemesinde farklı 4 link göstererek 'iz' bırakmayı engelle
    const shuffled = [...discoveryPool].sort(() => 0.5 - Math.random()).slice(0, 4);
    setLinks(shuffled);
  }, []);

  if (links.length === 0) return null;

  return (
    <div className="mt-24 mb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-4xl relative overflow-hidden group">
          {/* Dekoratif Ambiyans */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-rose-500 font-black uppercase tracking-[0.3em] text-[10px]">
                <Globe className="w-3 h-3" />
                <span>Hızlı Keşif</span>
              </div>
              <h4 className="text-xl font-black italic text-white uppercase tracking-tighter">
                Bölgesel Deneyim Rehberi
              </h4>
              <p className="text-zinc-500 text-xs font-medium max-w-md">
                Platform üzerindeki popüler lokasyonları ve en çok tercih edilen bölgeleri keşfedin.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {links.map((link, idx) => (
                <Link 
                  key={idx}
                  href={link.url}
                  className="px-6 py-4 bg-black border border-zinc-800 rounded-2xl text-xs font-bold text-zinc-400 hover:border-rose-600 hover:text-white hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-2xl"
                >
                  <MapPin className="w-3 h-3 text-rose-600" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 px-6 py-4 bg-emerald-600/5 border border-emerald-900/20 rounded-2xl group-hover:bg-emerald-600/10 transition-colors">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <div className="text-[10px] font-black uppercase text-emerald-500/80 tracking-widest leading-none">
                Safety<br />Verified
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
