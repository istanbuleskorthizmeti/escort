'use client';

import React, { useEffect, useState } from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';

// 🏴‍☠️ PROJEX: DRKCNAY VITRIN WIDGET
// Optimized for Google Sites iframes. No headers, no footers, pure elite conversion.

export default function VitrinWidget() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const res = await fetch('/api/profiles/vitrin'); // We'll create this API
        const data = await res.json();
        setProfiles(data);
      } catch (e) {
        console.error('Widget fetch failed:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  if (loading) return <div className="bg-black h-screen flex items-center justify-center text-[#ff8600] font-black italic animate-pulse">DRKCNAY ELITE LOADING...</div>;

  return (
    <div className="bg-black min-h-screen p-4 font-['Outfit']">
      <div className="flex items-center justify-between mb-6 px-2">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#ff8600] rounded-full animate-ping"></span>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Live Vitrin Active</span>
         </div>
         <div className="flex items-center gap-4">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Verified</span>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {profiles.filter(p => !p.isAdBanner).map((p) => {

          return (
            <div 
              key={p.id}
              onClick={() => window.open('http://dorukcanay.digital/go', '_parent')}
              className="group relative bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden cursor-pointer active:scale-95 transition-all"
            >
              <div className="h-56 relative bg-zinc-900">
                 <img 
                   src={p.image} 
                   alt={p.name} 
                   className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                 <div className="absolute bottom-4 left-4">
                    <h4 className="text-xl font-black text-white italic tracking-tighter">{p.name}, <span className="text-rose-600">{p.age}</span></h4>
                 </div>
              </div>
              <div className="p-4 space-y-4">
                 <div className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">{p.tier} PROTOCOL</div>
                 <button className="w-full py-3 bg-[#ff8600] text-black font-black text-[10px] italic uppercase tracking-widest rounded-xl flex items-center justify-center gap-2">
                    <Zap className="w-3 h-3" />
                    Görüşmeyi Başlat
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
