'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Map, Compass, Globe } from 'lucide-react';
import { cities } from '@/lib/locations';

interface Props {
  city: string;
  district?: string;
  neighborhood?: string;
}

/**
 * DRKCNAY NAVIGATION (Spiderweb)
 * Dynamic hierarchical navigation for hyper-local authority.
 */
export const DRKCNAYNavigation = ({ city, district, neighborhood }: Props) => {
  const cityObj = cities[city];
  if (!cityObj) return null;

  const districtObj = district ? cityObj.districts.find(d => d.slug === district) : null;
  
  return (
    <div className="py-12 px-8 bg-zinc-950/50 border border-zinc-900 rounded-4xl backdrop-blur-3xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-[#ff8600] uppercase tracking-[0.3em]">
             <Compass className="w-3 h-3" />
             <span>DRKCNAY Link Matrisi</span>
          </div>
          <h4 className="text-xl font-black italic text-white uppercase tracking-tighter">
            Hiyerarşik <span className="text-zinc-500">Gezinti</span>
          </h4>
        </div>

        <nav className="flex flex-wrap items-center gap-3">
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:border-[#ff8600] transition-all"
          >
            <Globe className="w-3 h-3 text-[#ff8600]" /> Ana Sayfa
          </Link>

          <ChevronRight className="w-4 h-4 text-zinc-800" />

          <Link 
            href={`/${city}`} 
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
              !district ? 'bg-[#ff8600]/10 border-[#ff8600] text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-[#ff8600]'
            }`}
          >
            <Map className="w-3 h-3 text-[#ff8600]" /> {cityObj.name}
          </Link>

          {district && (
            <>
              <ChevronRight className="w-4 h-4 text-zinc-800" />
              <Link 
                href={`/${city}/${district}`} 
                className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
                  !neighborhood ? 'bg-[#ff8600]/10 border-[#ff8600] text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-[#ff8600]'
                }`}
              >
                {districtObj?.name || district}
              </Link>
            </>
          )}

          {neighborhood && (
            <>
              <ChevronRight className="w-4 h-4 text-zinc-800" />
              <span className="px-4 py-2 bg-[#ff8600]/10 border border-[#ff8600] text-white rounded-xl text-xs font-bold">
                {neighborhood.replace('-', ' ')}
              </span>
            </>
          )}
        </nav>
      </div>
      
      {/* Spiderweb: Peer Districts */}
      {!neighborhood && district && (
        <div className="mt-8 pt-8 border-t border-zinc-900">
           <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Yakın Bölgelerdeki Elit Deneyimler</p>
           <div className="flex flex-wrap gap-2">
              {cityObj.districts
                .filter(d => d.slug !== district)
                .slice(0, 8)
                .map(d => (
                   <Link 
                    key={d.slug}
                    href={`/${city}/${d.slug}`}
                    className="text-[10px] font-bold text-zinc-500 hover:text-[#ff8600] transition-colors uppercase tracking-widest"
                  >
                    {d.name}
                  </Link>
                ))
              }
           </div>
        </div>
      )}
    </div>
  );
};
