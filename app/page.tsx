import Link from "next/link";
import { headers } from "next/headers";
import dynamic from "next/dynamic";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { getSiteId } from "@/lib/site-context";
import Navbar from "@/components/UI/Navbar";
import { UltraFooter } from "@/components/SEO/UltraFooter";
import { SecureHTML } from "@/components/SecureHTML";
import { GrowthWidgets } from "@/components/UI/GrowthWidgets";
import { ThemeEngine } from "@/lib/theme-engine";
import { ShieldCheck, Trophy, Send } from "lucide-react";
import { generateUltraGraphSchema } from "@/lib/seo-schema";
import { VIPBridge } from "@/components/UI/VIPBridge";
import { VIPEventHub } from "@/components/SEO/VIPEventHub";
import { getDomainConfig } from "@/config/domains";
import { generateLocationMetadata } from "@/lib/seo-metadata";
import { Metadata } from "next";
import { CloakerFrontend } from "@/components/UI/CloakerFrontend";

import { DorukVitrin } from "@/components/SEO/DorukVitrin";
import { MathematicalSEO } from "@/components/SEO/MathematicalSEO";
import { SEOContentEngine } from "@/components/SEO/SEOContentEngine";
import { IstanbulConquestMatrix } from "@/components/SEO/IstanbulConquestMatrix";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") || siteConfig.domain;
  const domainConfig = getDomainConfig(host);
  
  const district = domainConfig?.targetDistrict;
  const city = domainConfig?.targetCity || "İstanbul";

  // 🔥 HYDRA LOCAL SEO: Resolve metadata specifically for this domain's mission
  return generateLocationMetadata({
    city: city.toLowerCase(),
    cityName: city.charAt(0).toUpperCase() + city.slice(1),
    district: district?.toLowerCase(),
    districtName: district ? (district.charAt(0).toUpperCase() + district.slice(1)) : undefined,
    domain: host
  });
}

export default async function HomePage() {
  const host = (await headers()).get("host") || siteConfig.domain;
  const domainConfig = getDomainConfig(host);
  
  const district = domainConfig?.targetDistrict 
    ? (domainConfig.targetDistrict.charAt(0).toUpperCase() + domainConfig.targetDistrict.slice(1)) 
    : "İSTANBUL";
  
  const siteId = await getSiteId(host);
  
  const schema = generateUltraGraphSchema({
    locationName: district,
    city: "İstanbul",
    description: `${district} bölgesinin en elit VIP escort ajansı rehberi. %100 gerçek escort bayan profilleri ve kaporasız randevu sistemi.`,
    url: `https://${host}`,
    categoryTitle: "İSTANBUL ESCORT AJANSI v24.0"
  });


  const theme = ThemeEngine.getTheme(host);
  const brandName = theme.brandName;
  const slogan = theme.slogan;
  
  const isCloaker = domainConfig?.role === 'CLOAKER';

  const cityName = "İstanbul"; // Global context

  return (
    <main className="min-h-screen bg-black text-white antialiased selection:bg-primary/30 selection:text-white" style={{ backgroundColor: theme.bgColor }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Navbar />
      
      {isCloaker ? (
        <CloakerFrontend districtName={district} />
      ) : (
        <>
          <div className="w-full relative z-0 mb-20">
             <DorukVitrin city={district} host={host} />
          </div>

          {/* 🔱 HERO: BRAND Gateway (Moved Below Vitrin for UX) */}
          <section className="pb-32 px-6 max-w-7xl mx-auto relative overflow-hidden text-center md:text-left mt-10">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 blur-[150px] rounded-full -z-10" style={{ backgroundColor: theme.primaryColor }} />
            
            <div className="inline-flex items-center gap-4 bg-zinc-950/40 backdrop-blur-2xl border border-white/10 px-8 py-3 rounded-full mb-12 animate-fade-in shadow-2xl" style={{ borderColor: `${theme.primaryColor}33` }}>
              <span className="w-2.5 h-2.5 rounded-full animate-glow-pulse" style={{ backgroundColor: theme.primaryColor, boxShadow: `0 0 15px ${theme.primaryColor}` }} />
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400">
                 {district.replace(/[-\u2013\u2014]/g, ' ').toUpperCase()} // GERÇEK VİTRİN
              </span>
            </div>

            <h1 className="text-6xl md:text-[10rem] font-black italic tracking-tighter leading-[0.8] mb-12 flex flex-col items-center md:items-start drop-shadow-2xl">
              <span className="opacity-90">{brandName.toUpperCase()}</span>
              <span className="text-primary drop-shadow-2xl" style={{ color: theme.primaryColor, filter: `drop-shadow(0 0 40px ${theme.primaryColor}88)` }}>{district === "İSTANBUL" ? "İSTANBUL" : district.replace(/[-\u2013\u2014]/g, ' ').toUpperCase()}</span>
            </h1>

            <div className="max-w-4xl border-l-8 pl-12 py-4 mx-auto md:mx-0" style={{ borderColor: theme.primaryColor }}>
               <p className="text-zinc-400 text-xl md:text-2xl font-black uppercase italic tracking-widest leading-relaxed">
                 {slogan}. <br className="hidden md:block"/>
                 {district.replace(/[-\u2013\u2014]/g, ' ')} bölgesinin en seçkin vitrini. <span className="text-white underline underline-offset-8" style={{ textDecorationColor: `${theme.primaryColor}88` }}>Kaporasız</span> ve elit.
               </p>
            </div>
          </section>

          <VIPBridge />
          
          <div className="max-w-7xl mx-auto px-6 mb-32">
             <IstanbulConquestMatrix />
          </div>
        </>
      )}

      <SEOContentEngine cityName={district} host={host} />
      <MathematicalSEO district={district} role={domainConfig?.role} />
      
      <UltraFooter host={host} cityName="İstanbul" districtName={district} />

      <footer className="py-20 border-t border-zinc-900 bg-zinc-950/50 backdrop-blur-xl">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-2xl font-black italic tracking-tighter text-white">DRKCNAY <span className="text-rose-600">ELITE</span></div>
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.5em] text-center md:text-left">
               © {new Date().getFullYear()} {district.replace(/[-\u2013\u2014]/g, ' ').toUpperCase()} VIP // TÜM HAKLARI SAKLIDIR.
            </div>
            <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-zinc-400 italic">
               <Link href="/terms" className="hover:text-rose-600 transition-colors">ŞARTLAR</Link>
               <Link href="/privacy" className="hover:text-rose-600 transition-colors">GİZLİLİK</Link>
               <Link href="/contact" className="hover:text-rose-600 transition-colors">İLETİŞİM</Link>
            </div>
         </div>
      </footer>
    </main>
  );
}
