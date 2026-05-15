'use client';

import React from 'react';
import { MapPin, Navigation, Phone, Globe } from 'lucide-react';
import { MapBranchConfig } from '../lib/seo/maps-config';

interface MapEmbedProps {
  mainBranchName: string;
  branches: MapBranchConfig[];
}

/**
 * ☠️ LOCAL SEO EMBED COMPONENT (VIP Elite)
 * Embeds verified Google Maps (and their branches) directly into the Next.js site.
 * This establishes massive NAP (Name, Address, Phone) consistency and Local SEO authority.
 */
export const LocalMapEmbed: React.FC<MapEmbedProps> = ({ mainBranchName, branches }) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-zinc-950 rounded-3xl border border-zinc-900 shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <MapPin className="text-rose-600 w-8 h-8" />
        <h2 className="text-3xl font-black italic text-white tracking-tight">
          {mainBranchName} <span className="text-zinc-500 font-medium">| ŞUBELERİMİZ</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {branches.map((branch) => (
          <div key={branch.id} className="group relative overflow-hidden rounded-2xl bg-black border border-zinc-800 transition-all hover:border-rose-600/50">
            {/* The Google Maps Iframe */}
            <div className="w-full h-64 md:h-80 bg-zinc-900 relative">
              {branch.isVerified ? (
                <iframe
                  src={branch.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 z-10"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-bold tracking-widest bg-zinc-950/80 z-20">
                  ŞUBE ONAY BEKLİYOR
                </div>
              )}
            </div>

            {/* Branch Details */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-500 transition-colors">
                {branch.name}
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                {branch.address}
              </p>
              
              <p className="text-zinc-500 text-xs italic mb-4">
                {branch.seoDescription}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <a 
                  href={`tel:${branch.phone}`}
                  className="flex items-center gap-2 text-sm font-bold text-green-500 bg-green-500/10 px-4 py-2 rounded-full hover:bg-green-500 hover:text-white transition-all"
                >
                  <Phone className="w-4 h-4" />
                  {branch.phone}
                </a>

                <a 
                  href={branch.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-bold text-rose-500 bg-rose-500/10 px-4 py-2 rounded-full hover:bg-rose-500 hover:text-white transition-all"
                >
                  <Globe className="w-4 h-4" />
                  SİTEYE GİT
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
