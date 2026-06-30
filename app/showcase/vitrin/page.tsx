'use client';

import React, { useEffect, useState } from 'react';
import { Zap, ShieldCheck, Sparkles, User, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// ⚡ GOD MODE: DRKCNAY SHOWCASE WIDGET
// Ultra-Premium Glassmorphism, Framer Motion Animations, Next.js Image Optimization

interface Profile {
  id: string;
  name: string;
  age: number;
  image: string;
  tier: string;
  isAdBanner?: boolean;
}

export default function ShowcaseWidget() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const res = await fetch('/api/profiles/vitrin');
        const data = await res.json();
        setProfiles(data);
      } catch (e) {
        console.error('Showcase fetch failed:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  if (loading) return (
    <div className="bg-[#050505] min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]"
      />
      <div className="w-12 h-12 border-2 border-zinc-800 border-t-purple-500 rounded-full animate-spin z-10"></div>
      <div className="mt-4 text-purple-400 font-bold uppercase tracking-[0.3em] text-xs z-10 animate-pulse">
        Sistem Yükleniyor...
      </div>
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-8 px-2 relative z-10"
      >
         <div className="flex items-center gap-3 bg-zinc-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Sistem Aktif</span>
         </div>
         <div className="flex items-center gap-2 bg-purple-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-purple-500/20">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">%100 Onaylı</span>
         </div>
      </motion.div>

      {/* GRID */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10"
      >
        <AnimatePresence>
          {profiles.filter(p => !p.isAdBanner).map((p) => (
            <motion.div 
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
              }}
              key={p.id}
              onClick={() => window.open('http://dorukcanay.digital/go', '_parent')}
              className="group relative bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 shadow-2xl hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
            >
              {/* IMAGE CONTAINER */}
              <div className="h-72 sm:h-80 relative overflow-hidden bg-zinc-950">
                 {/* Next.js Image Component - Unoptimized to prevent domain errors, but uses native lazy loading */}
                 <Image 
                   src={p.image} 
                   alt={p.name}
                   fill
                   unoptimized
                   className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out"
                 />
                 
                 {/* Premium Overlay Gradients */}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
                 
                 {/* Tier Badge */}
                 <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                   <Sparkles className="w-3 h-3 text-amber-400" />
                   <span className="text-[10px] font-bold text-white tracking-widest uppercase">{p.tier}</span>
                 </div>

                 {/* Info Block */}
                 <div className="absolute bottom-6 left-6 right-6">
                    <h4 className="text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
                      {p.name}
                      <span className="text-purple-400 text-xl font-bold">{p.age}</span>
                    </h4>
                    <div className="flex items-center gap-2 mt-2 text-zinc-400 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>Lokasyon Doğrulanmış</span>
                    </div>
                 </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="p-4">
                 <button className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-black text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all group-hover:bg-purple-500 group-hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    <Zap className="w-4 h-4" />
                    Profili İncele
                 </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
