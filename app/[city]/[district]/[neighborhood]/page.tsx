import { Metadata } from "next";
import { sanitizeDisplayName } from "@/lib/utils";
import { cities, getCitiesForHost } from "@/lib/locations";
import { ThemeEngine } from "@/lib/theme-engine";
import { siteConfig } from "@/config/site";
import Breadcrumbs from "@/components/UI/Breadcrumbs";
import { ElitePromoBanner } from "@/components/UI/ElitePromoBanner";
import { LongFormContent } from "@/components/UI/LongFormContent";
import Navbar from "@/components/UI/Navbar";
import { VerificationBadge } from "@/components/UI/ConciergeSuite";
import { StreamingSEOContent } from "@/components/SEO/StreamingSEOContent";
import { generateLocationMetadata } from "@/lib/seo-metadata";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { generateGodModeContent } from "@/lib/seo-content";
import { generateUltraGraphSchema } from "@/lib/seo-schema";
import { getHybridProfiles } from "@/lib/ad-service";
import { HybridProfileGrid } from "@/components/UI/HybridProfileGrid";
import { prisma } from "@/lib/prisma";
import { GrowthWidgets } from "@/components/UI/GrowthWidgets";
import { getSiteId } from "@/lib/site-context";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

interface Params {
  city: string;
  district: string;
  neighborhood: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { city: rawCity, district: rawDistrict, neighborhood: rawNeighborhood } = await params;
  const city = decodeURIComponent(rawCity).toLowerCase();
  const district = decodeURIComponent(rawDistrict);
  const neighborhood = decodeURIComponent(rawNeighborhood);
  const host = (await headers()).get("host") || siteConfig.domain;

  // 🔱 HYDRA MISSION CHECK
  const allowedCities = getCitiesForHost(host);
  if (!allowedCities[city]) {
    return {}; 
  }

  const siteId = await getSiteId(host);
  
  let cityObj = allowedCities[city];
  let distObj = cityObj?.districts.find((d) => d.slug === district);
  let neighObj = distObj?.neighborhoods.find((n) => n.slug === neighborhood);

  if (!cityObj || !distObj || !neighObj) {
    const fullSlug = `${city}-${district}-${neighborhood}`;
    const dbContent = await prisma.pageContent.findFirst({ 
      where: { 
        slug: fullSlug, 
        OR: [{ siteId }, { siteId: null }]
      },
      orderBy: { siteId: 'desc' }
    });
    
    if (dbContent) {
      neighObj = {
        name: sanitizeDisplayName(dbContent.title || neighborhood),
        slug: neighborhood
      } as any;
    }
  }

  if (!cityObj || !distObj || !neighObj) {
    const formattedCity = city.replace(/-/g, ' ').toUpperCase();
    const formattedDist = district.replace(/-/g, ' ').toUpperCase();
    const formattedNeigh = neighborhood.replace(/-/g, ' ').toUpperCase();
    return generateLocationMetadata({
      city,
      cityName: formattedCity,
      district,
      districtName: formattedDist,
      neighborhood,
      neighborhoodName: formattedNeigh,
      domain: host,
      customTitle: `🔥 ${formattedNeigh} ESCORT | %100 GERÇEK | ${formattedDist} VIP ESCORT REHBERİ`
    });
  }

  const cityName = cityObj?.name || sanitizeDisplayName(city);
  const districtName = distObj?.name || sanitizeDisplayName(district);
  const neighborhoodName = neighObj?.name || sanitizeDisplayName(neighborhood);

  return generateLocationMetadata({
    city,
    cityName: cityName,
    district,
    districtName: districtName,
    neighborhood,
    neighborhoodName: neighborhoodName,
    domain: host
  });
}

import { DorukVitrin } from "@/components/SEO/DorukVitrin";
import { SEOContentEngine } from "@/components/SEO/SEOContentEngine";
import { VIPBridge } from "@/components/UI/VIPBridge";
import { VIPEventHub } from "@/components/SEO/VIPEventHub";
import { UltraFooter } from "@/components/SEO/UltraFooter";
import { IstanbulConquestMatrix } from "@/components/SEO/IstanbulConquestMatrix";
import { SecureHTML } from "@/components/SecureHTML";
import { ShieldCheck, MapPin } from 'lucide-react';

export default async function NeighborhoodHubPage({ params }: { params: Promise<Params> }) {
  const { city: rawCity, district: rawDistrict, neighborhood: rawNeighborhood } = await params;
  const city = decodeURIComponent(rawCity).toLowerCase();
  const district = decodeURIComponent(rawDistrict);
  const neighborhood = decodeURIComponent(rawNeighborhood);
  const host = (await headers()).get("host") || siteConfig.domain;

  // 🔱 HYDRA MISSION CHECK
  const allowedCities = getCitiesForHost(host);
  if (!allowedCities[city]) {
    return notFound();
  }

  const siteId = await getSiteId(host);

  let cityObj = (allowedCities as any)[city];
  let distObj = cityObj?.districts?.find((d: any) => d.slug === district);
  let neighObj = distObj?.neighborhoods?.find((n: any) => n.slug === neighborhood);

  // 🏰 ZERO-404 FALLBACK
  if (!cityObj || !distObj || !neighObj) {
    const fullSlug = `${city}-${district}-${neighborhood}`;
    let dbContent = await prisma.pageContent.findFirst({ 
      where: { 
        slug: fullSlug, 
        OR: [{ siteId }, { siteId: null }]
      },
      orderBy: { siteId: 'desc' }
    });
    if (dbContent) {
      neighObj = { name: sanitizeDisplayName(dbContent.title || neighborhood), slug: neighborhood } as any;
      cityObj = cityObj || { name: city.toUpperCase() };
      distObj = distObj || { name: district.toUpperCase() };
    }
  }

  if (!cityObj || !distObj || !neighObj) notFound();

  const nName = sanitizeDisplayName(neighObj.name);
  const dName = sanitizeDisplayName(distObj.name);
  const cityName = sanitizeDisplayName(cityObj.name);
  
  const profiles = await getHybridProfiles({ city, district, neighborhood, limit: 8 });
  const theme = ThemeEngine.getTheme(host);
  // Content moved to StreamingSEOContent to prevent 524 timeouts

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-rose-600/30 selection:text-white">
      <Navbar />
      
      <main className="pt-32">
        {/* 🔱 HERO SECTION: NEIGHBORHOOD AUTHORITY v10.0 */}
        <section className="max-w-7xl mx-auto px-6 mb-32 mt-20 relative">
          <div className="absolute -top-20 left-0 w-full h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent opacity-30" />
          
          <Breadcrumbs items={[{ name: cityName, item: `/${city}` }, { name: dName, item: `/${city}/${district}` }, { name: nName, item: `/${city}/${district}/${neighborhood}` }]} />
          
          <div className="inline-flex items-center gap-4 bg-zinc-950/40 backdrop-blur-2xl border border-rose-600/20 px-8 py-3 rounded-full mb-16 animate-fade-in shadow-glow-rose mt-12">
            <span className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-glow-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400">
               {nName.toUpperCase()} NODE // LOCAL AUTHORITY
            </span>
          </div>

          <h1 className="hero-title-dynamic text-6xl md:text-[10rem] mb-12 tracking-tighter !leading-[0.85] flex flex-col items-start uppercase italic">
            <span className="opacity-90">{nName}</span>
            <span className="text-rose-600 drop-shadow-[0_0_50px_rgba(225,29,72,0.6)]">ESCORT AJANSI</span>
          </h1>
          
          <p className="text-zinc-500 text-xl md:text-3xl font-black italic border-l-8 border-rose-600 pl-12 max-w-4xl leading-tight opacity-90">
            {cityName} {dName} {nName} bölgesindeki en elit escort rehberi ve <br className="hidden md:block"/>
            <span className="text-white border-b-2 border-rose-600/30 pb-1">doğrulanmış gerçek</span> escort bayanlar.
          </p>
        </section>

        {/* 🏆 LOCAL SHOWCASE */}
        <div className="max-w-7xl mx-auto mb-32 px-6">
           <div className="glass-card p-12 rounded-[3rem] mb-16 flex flex-col md:flex-row items-center justify-between gap-10 group hover:border-rose-600/40 transition-all duration-700 shadow-glow-rose">
              <div className="flex items-center gap-6">
                 <div className="p-4 bg-rose-600/10 rounded-2xl border border-rose-600/20">
                    <ShieldCheck className="text-rose-600 w-10 h-10 animate-glow-pulse" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black uppercase italic text-white tracking-widest">YEREL OTORİTE</h3>
                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mt-1">Sadece {nName} Bölgesi Escortları</p>
                 </div>
              </div>
              <div className="h-px w-full md:w-px md:h-16 bg-zinc-800" />
              <div className="flex items-center gap-5 text-sm font-black text-white uppercase tracking-[0.4em] italic">
                 🛡️ %100 GERÇEK İLANLAR // {nName.toUpperCase()} ESCORT REHBERİ
              </div>
           </div>
           <DorukVitrin city={cityName} />
        </div>

        {/* 🏆 EVENT HUB */}
        <VIPEventHub />

        {/* 🔱 TRANSITION */}
        <VIPBridge />

        {/* 📝 LONG FORM SEO: STREAMING */}
        <StreamingSEOContent 
          city={city} 
          district={district}
          neighborhood={nName}
          host={host} 
          cityName={nName} 
        />

        {/* 💣 DOMINATION (Istanbul only) */}
        {cityName.toLowerCase() === 'istanbul' && <IstanbulConquestMatrix />}

        {/* 🔱 AGGRESSIVE SEO ENGINE */}
        <SEOContentEngine cityName={cityName} districtName={dName} neighborhoodName={nName} host={host} />

        {/* 🚀 GROWTH WIDGETS */}
        <div className="max-w-7xl mx-auto px-6 mb-32">
           <GrowthWidgets />
        </div>

      </main>

      <UltraFooter host={host} cityName={cityName} districtName={dName} />
    </div>
  );
}
