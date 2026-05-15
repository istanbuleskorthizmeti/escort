'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Zap, Star, UserCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface Profile {
  id: string;
  name: string;
  age: number;
  height: string;
  weight: string;
  tier: 'VIP' | 'Elite' | 'Supreme';
  features: string[];
  adultBoundaries: {
    included: string[];
    excluded: string[];
  };
  image: string;
  phone?: string;
  isAd?: boolean;
}

interface Props {
  profiles: Profile[];
  locationName: string;
  citySlug?: string;
  districtSlug?: string;
  category?: string;
}

export const HybridProfileGrid = ({ profiles, locationName, citySlug, districtSlug, category }: Props) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Supreme': return 'text-rose-600 border-rose-600/30 bg-rose-600/10';
      case 'Elite': return 'text-rose-500 border-rose-500/30 bg-rose-500/10';
      default: return 'text-zinc-400 border-zinc-400/30 bg-zinc-400/10';
    }
  };

  const handleContact = async (e: React.MouseEvent, profile: Profile) => {
    e.stopPropagation(); // Don't trigger the Link
    const phoneNumber = profile.phone || siteConfig.contact.whatsappNumber;
    
    // CRM Integration: Submit lead to Telegram
    try {
      fetch('/api/crm/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName: citySlug || locationName,
          districtName: districtSlug || locationName,
          category: category || (profile.isAd ? 'DIRECT_AD' : 'CONCIERGE_PERSONA'),
          details: `Profile: ${profile.name} (${profile.tier}) | Source: HybridProfileGrid`,
          currentUrl: window.location.href
        }),
        keepalive: true
      });
    } catch (e) {
      console.error('CRM Submission Failed:', e);
    }

    window.open(siteConfig.contact.whatsappLink, '_blank');
  };

  return (
    <section className="mt-24 mb-40">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <span className="flex h-2 w-2 rounded-full bg-rose-600 animate-ping"></span>
             <h2 className="text-sm font-black tracking-[0.4em] text-rose-600 uppercase italic">Canlı Aktivite Filtresi</h2>
          </div>
          <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
            {locationName} <span className="text-zinc-800">Seçilmiş Profiller</span>
          </h3>
        </div>
        <div className="flex items-center gap-8 text-[10px] font-black tracking-widest text-zinc-500 italic uppercase">
           <div className="flex items-center gap-2">
             <ShieldCheck className="w-4 h-4 text-emerald-500" />
             <span>%100 Doğrulanmış</span>
           </div>
           <div className="flex items-center gap-2">
             <Zap className="w-4 h-4 text-rose-500" />
             <span>Anlık Erişim</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {profiles.map((p, index) => {
          const profileSlug = p.image.split('/').pop()?.replace('.jpg', '').replace('.webp', '') || p.id;
          
          return (
            <Link 
              key={p.id} 
              href={`/p/${profileSlug}`}
              className="group relative bg-zinc-950/40 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] overflow-hidden hover:border-rose-600/40 transition-all duration-700 shadow-2xl hover:shadow-rose-600/20 cursor-pointer"
            >
              <div className="h-[450px] bg-zinc-900 relative">
                 <Image 
                  src={p.image.includes('.gif') ? p.image.replace('.gif', '.webp') : p.image} 
                  alt={p.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="absolute inset-0 w-full h-full object-cover z-0 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                  priority={index < 4}
                  quality={70}
                />
                 <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-10 opacity-90"></div>
                 <div className="absolute top-6 right-6 z-20">
                    <span className={`px-5 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase border backdrop-blur-md ${getTierColor(p.tier)}`}>
                      {p.tier} PROTOCOL
                    </span>
                 </div>
                 
                 {p.isAd && (
                   <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full backdrop-blur-md">
                      <Star className="w-3 h-3 text-emerald-500 fill-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Premium Ad</span>
                   </div>
                 )}

                 <div className="absolute bottom-8 left-8 z-20">
                    <h4 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-2 drop-shadow-2xl">
                      {p.name}, <span className="text-rose-600">{p.age}</span>
                    </h4>
                    <div className="flex items-center gap-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] italic">
                      <span className="bg-zinc-950/50 px-3 py-1 rounded-sm border border-zinc-900">{p.height} CM</span>
                      <span className="bg-zinc-950/50 px-3 py-1 rounded-sm border border-zinc-900">{p.weight} KG</span>
                    </div>
                 </div>
              </div>

              <div className="p-10 space-y-10">
                <div className="flex flex-wrap gap-2.5">
                  {p.features.slice(0, 3).map(f => (
                    <span key={f} className="text-[9px] font-black uppercase tracking-widest bg-zinc-900/80 text-zinc-500 border border-zinc-800 px-4 py-2 rounded-xl group-hover:text-rose-600 group-hover:border-rose-600/20 transition-all">
                      {f}
                    </span>
                  ))}
                </div>

                <div className="space-y-6">
                   <div className="flex items-start gap-5">
                      <div className="mt-1 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/10">
                         <UserCheck className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black text-emerald-500/80 uppercase tracking-[0.2em] block mb-2 italic">Elite Inclusion</span>
                        <p className="text-sm text-zinc-400 leading-relaxed italic font-medium">{p.adultBoundaries.included.join(", ")}</p>
                      </div>
                   </div>
                </div>

                <div 
                  onClick={(e) => handleContact(e, p)}
                  className="w-full py-6 bg-rose-600 text-white font-black italic uppercase tracking-[0.4em] rounded-[2rem] transition-all flex items-center justify-center gap-4 hover:bg-white hover:text-black shadow-glow-rose group-hover:shadow-glow-rose active:scale-95 relative overflow-hidden group/btn"
                >
                  <Zap className="w-4 h-4 text-white group-hover/btn:text-black transition-colors" />
                  <span className="relative z-10">Görüşmeyi Başlat</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
