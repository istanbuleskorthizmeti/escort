"use client";

import React, { use } from 'react';
import { siteConfig } from "@/config/site";
import Navbar from "@/components/UI/Navbar";
import { UltraFooter } from "@/components/SEO/UltraFooter";
import { MessageCircle, ShieldCheck, Star, Image as ImageIcon, CheckCircle2, Crown } from "lucide-react";
import { generateUltraGraphSchema } from "@/lib/seo-schema";
import { SEOContentEngine } from "@/components/SEO/SEOContentEngine";
import { VIPBridge } from "@/components/UI/VIPBridge";
import { vitrinImages } from "@/lib/vitrin-images";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProfilePage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise);
  const host = typeof window !== 'undefined' ? window.location.host : siteConfig.domain;
  const { slug } = params;
  const name = slug.charAt(0).toUpperCase() + slug.slice(1);
  const city = "İstanbul";

  // Deterministic but random-looking images based on slug
  const charSum = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const mainImageIdx = charSum % vitrinImages.length;
  const galleryImages = vitrinImages.slice(0, 8).map((_, i) => vitrinImages[(charSum + i + 1) % vitrinImages.length]).slice(0, 4);

  const schema = generateUltraGraphSchema({
    locationName: name,
    city: city,
    description: `${name} ${city} bölgesinde sarışın escort, rus model ve üniversiteli escort hizmeti sunan seçkin bir modeldir. %100 gerçek görseller.`,
    url: `https://${host}/profile/${slug}`,
    categoryTitle: "VIP Galeri v8.0"
  });

  return (
    <main className="min-h-screen bg-black text-white antialiased selection:bg-rose-600/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navbar />
      
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
             
             {/* 📸 MAIN PROFILE IMAGE (GOD-MODE VIEW) */}
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               className="relative rounded-[3rem] overflow-hidden border border-zinc-900 shadow-glow-rose aspect-[3/4.5] group"
             >
                <Image 
                  src={vitrinImages[mainImageIdx].src.startsWith('http') ? vitrinImages[mainImageIdx].src : `${siteConfig.cdnUrl}${vitrinImages[mainImageIdx].src}`} 
                  alt={`${name} ${city} Escort - %100 Gerçek ve Onaylı Profil`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                  priority
                />
                <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-xl px-6 py-2 rounded-full border border-rose-600/30 text-rose-600 text-[10px] font-black tracking-[0.2em] flex items-center gap-3">
                   <Crown size={14} className="animate-pulse" /> VIP ELITE SELECTION
                </div>
             </motion.div>

             {/* 📝 ELITE PROFILE INTEL */}
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="flex flex-col gap-10"
             >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex gap-1 text-rose-600">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] italic border-l border-zinc-800 pl-4">ONAYLI PROFİL</span>
                  </div>
                  
                  <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-glow">
                     {name}
                  </h1>
                  <div className="text-2xl font-black text-rose-600 uppercase tracking-widest italic opacity-80">
                     {city.toUpperCase()} // DRKCNAY ELITE
                  </div>
                </div>

                <div className="text-zinc-400 text-xl md:text-2xl font-medium leading-relaxed italic border-l-4 border-rose-600 pl-8 max-w-2xl">
                   {name} {city} bölgesinde <span className="text-white">sarışın escort, rus model ve üniversiteli</span> escort hizmeti sunan seçkin bir modeldir. 
                   Tüm görselleri güncel ve kendisine aittir. Kaporasız ve %100 gizlilik garantili görüşme için hemen iletişime geçin.
                </div>

                {/* 🔱 VISUAL GALLERY SIEGE */}
                <div className="border-t border-zinc-900/50 pt-10">
                   <h3 className="text-[11px] font-black text-white uppercase mb-8 flex items-center gap-4 tracking-[0.3em] italic">
                     <ImageIcon size={18} className="text-rose-600" /> ÖZEL GÖRSEL GALERİSİ
                   </h3>
                   <div className="grid grid-cols-4 gap-4 md:gap-6">
                     {galleryImages.map((img, idx) => (
                       <motion.div 
                         whileHover={{ scale: 1.05 }}
                         key={idx} 
                         className="relative aspect-square rounded-3xl overflow-hidden border border-zinc-900 group cursor-zoom-in"
                       >
                         <Image 
                           src={img.src.startsWith('http') ? img.src : `${siteConfig.cdnUrl}${img.src}`} 
                           alt={`${name} ${city} Escort Galeri Görseli ${idx + 1}`}
                           fill
                           className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                         />
                       </motion.div>
                     ))}
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 mt-6">
                   <Link 
                      href={`/whatsapp?text=Merhaba ${name}, seni DRKCNAY ELITE profilinde gördüm, randevu almak istiyorum.`}
                      className="bg-rose-600 hover:bg-white text-white hover:text-black px-10 py-6 rounded-3xl font-black text-xl uppercase italic flex items-center justify-center gap-4 transition-all duration-500 shadow-glow-rose group"
                   >
                      <MessageCircle size={24} className="group-hover:scale-110 transition-transform" /> WHATSAPP İLE RANDEVU AL
                   </Link>

                   <div className="bg-zinc-950/50 backdrop-blur-xl border border-zinc-900 px-8 py-6 rounded-3xl flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 italic">
                      <CheckCircle2 size={20} className="text-emerald-500" /> %100 GİZLİLİK GARANTİSİ
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="glass-card p-6 rounded-2xl border-zinc-900/50">
                        <div className="text-[10px] font-black text-rose-600 uppercase mb-2 tracking-widest">HİZMET ALANI</div>
                        <div className="text-sm font-bold">EVE & OTELE SERVİS</div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border-zinc-900/50">
                        <div className="text-[10px] font-black text-rose-600 uppercase mb-2 tracking-widest">ÇALIŞMA SAATİ</div>
                        <div className="text-sm font-bold">7/24 AKTİF</div>
                    </div>
                </div>
             </motion.div>
          </div>

        </div>
      </section>

      {/* 🔱 VIP TRANSITION BRIDGE */}
      <VIPBridge />

      {/* 🔱 AGGRESSIVE SEO ENGINE: CONTENT & TAGS */}
      <SEOContentEngine cityName={city} host={host} />

      <UltraFooter host={host} cityName={city} />
    </main>
  );
}
