import { Shield, Award } from "lucide-react";
import { generateGodModeContent } from "@/lib/seo-content";
import { generateLocationUtility } from "@/lib/utility-service";
import { DRKCNAYNavigation } from "./DRKCNAYNavigation";
import { SecureHTML } from "../SecureHTML";
import { toCanonicalSlug } from "@/lib/slug";
import { GBP_LOCATIONS } from "@/lib/geo-data";
import { headers } from "next/headers";
import { siteConfig } from "@/config/site";

interface LongFormContentProps {
  location: string;
  type?: "city" | "district" | "neighborhood" | "category";
  city: string;
  district?: string;
  neighborhood?: string;
  category?: string;
  initialHtml?: string;
}

export async function LongFormContent({ location, city, district, neighborhood, category, initialHtml }: LongFormContentProps) {
  const slug = toCanonicalSlug([city, district, neighborhood]);
  const host = (await headers()).get("host") || siteConfig.domain;
  
  const content = initialHtml || (await generateGodModeContent({ city, district, neighborhood, category, host })).html;

  const utility = generateLocationUtility(slug);
  const gbpInfo = neighborhood ? (GBP_LOCATIONS as any)[neighborhood] : district ? (GBP_LOCATIONS as any)[district] : null;

  return (
    <div className="mt-40 pt-40 border-t border-zinc-900/50 space-y-24">
       {/* 🚀 HEADER: AUTHORITY SEAL */}
       <div className="flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center gap-3 bg-zinc-950 px-6 py-2 rounded-full border border-zinc-900 text-[10px] font-black tracking-[0.4em] text-rose-600 uppercase">
             <Shield className="w-3 h-3" />
             DRKCNAY ELITE SUMMARY
          </div>
          <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-white">
             {location} <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-100 to-zinc-500">DERİN ANALİZ</span>
          </h2>
          <p className="text-zinc-500 max-w-2xl font-medium italic">
             {location} bölgesinde elit yaşam, DRKCNAY eşlik standartları ve VIP standartların kusursuz yansıması.
          </p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* 📚 MAIN CONTENT: DEEPSEEK AI FACTORY */}
          <div className="lg:col-span-8 space-y-16">
             <div className="relative overflow-hidden">
                <SecureHTML 
                   className="prose prose-invert prose-xl max-w-none text-zinc-400 font-medium italic leading-[1.8]"
                   html={content}
                 />
             </div>

             {/* 📍 GBP TRUST NODE (IF EXISTS) */}
             {gbpInfo && (
               <div className="mt-16 p-8 bg-zinc-950 border border-rose-600/20 rounded-4xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 blur-3xl rounded-full"></div>
                 <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                   <div className="space-y-4">
                     <div className="bg-rose-600/20 text-rose-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
                       RESMİ GBP DOĞRULAMA NOKTASI
                     </div>
                     <h4 className="text-2xl font-black italic text-white uppercase tracking-tighter">
                       {gbpInfo.name}
                     </h4>
                     <p className="text-zinc-500 font-medium text-sm">
                       📍 {gbpInfo.streetAddress}, {gbpInfo.postalCode} {gbpInfo.addressLocality}/{gbpInfo.addressRegion}
                     </p>
                   </div>
                   <div className="flex flex-col items-center gap-2">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Durum</span>
                      <span className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest ${gbpInfo.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500 animate-pulse'}`}>
                         {gbpInfo.status === 'Verified' ? 'DOĞRULANDI' : 'ONAY BEKLİYOR'}
                      </span>
                   </div>
                 </div>
               </div>
             )}
          </div>

          {/* 🛡️ ASIDE: AUTHORITY METRICS */}
          <aside className="lg:col-span-4 space-y-8">
             <div className="group relative">
               <div className="absolute -inset-px bg-linear-to-b from-rose-600/50 via-zinc-900 to-rose-600/20 rounded-4xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
               
               <div className="glass-panel bg-zinc-950/90 p-8 md:p-10 rounded-4xl sticky top-32 border border-rose-600/20 overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                 <div className="flex items-center gap-4 mb-8 border-b border-zinc-800/80 pb-6 relative z-10">
                   <div className="w-12 h-12 rounded-full bg-rose-600/10 flex items-center justify-center border border-rose-600/20">
                       <Shield className="w-6 h-6 text-rose-600" />
                   </div>
                   <div>
                     <h3 className="text-xl font-black italic uppercase text-zinc-100 tracking-tight leading-tight">Otorite<br/><span className="text-rose-600">Verileri</span></h3>
                   </div>
                 </div>

                 <div className="space-y-4 relative z-10">
                   <div className="flex flex-col gap-2 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 hover:border-rose-600/40 transition-colors">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Bölge Puanı</span>
                       <div className="flex items-end justify-between">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} className="w-4 h-4 text-rose-600 fill-current" width="16" height="16" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            ))}
                          </div>
                          <span className="text-lg font-black text-zinc-100 italic">4.9<span className="text-sm text-zinc-600">/5</span></span>
                       </div>
                   </div>

                   <div className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 hover:border-rose-600/40 transition-colors">
                     <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Aktif Standartler</span>
                       <span className="text-sm font-bold text-zinc-300">8 Seviye Korumalı</span>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-rose-600/10 flex items-center justify-center border border-rose-600/20">
                       <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
                     </div>
                   </div>

                   <div className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 border-l-2 border-l-rose-600 shadow-glow hover:shadow-glow-rose transition-all">
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Gizlilik Derecesi</span>
                        <span className="text-sm font-bold text-rose-600 italic">KRİTİK / %100</span>
                     </div>
                     <Shield className="w-5 h-5 text-rose-600/50" />
                   </div>
                 </div>
                 
                 <div className="mt-8 pt-8 border-t border-zinc-800/80 flex flex-col items-center text-center relative z-10">
                     <Award className="w-12 h-12 text-zinc-700 mb-6 group-hover:text-rose-600 transition-colors duration-500" />
                     <p className="text-[10px] font-black text-zinc-500 group-hover:text-rose-600 transition-colors uppercase tracking-widest leading-relaxed mb-4">
                        BU BÖLGE DRKCNAY ELİT <br /> AĞI TARAFINDAN ONAYLANMIŞTIR
                     </p>
                     <div className="text-[9px] text-zinc-600 italic">
                        Yerel Rehber Kapasitesi: {utility.activeUnits + 3} Onaylı Birim
                     </div>
                  </div>
               </div>
             </div>
          </aside>
       </div>

       <DRKCNAYNavigation city={city} district={district} neighborhood={neighborhood} />
    </div>
  );
}
