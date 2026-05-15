import Link from "next/link";
import { Metadata } from "next";
import { cities, getCitiesForHost } from "@/lib/locations";
import { taxonomyCategories } from "@/lib/taxonomy";
import Navbar from "@/components/UI/Navbar";
import { PanicButton, VerificationBadge } from "@/components/UI/ConciergeSuite";
import { notFound, permanentRedirect } from "next/navigation";
import { LongFormContent } from "@/components/UI/LongFormContent";
import EventAwareBanner from "@/components/UI/EventAwareBanner";
import { Landmark, MapPin, Building, Waves, TreePine, ShieldCheck } from 'lucide-react';
import { SecureHTML } from "@/components/SecureHTML";
import { getCityGeo, GBP_LOCATIONS } from "@/lib/geo-data";
import { HYDRA_NODES } from "@/lib/hydra-engine";
import { ThemeEngine } from "@/lib/theme-engine";
import { siteConfig } from "@/config/site";
import Breadcrumbs from "@/components/UI/Breadcrumbs";
import { DRKCNAYNavigation } from "@/components/UI/DRKCNAYNavigation";
import { DRKCNAYGeoMap } from "@/components/UI/DRKCNAYGeoMap";
import { DorukVitrin } from "@/components/SEO/DorukVitrin";
import { StreamingSEOContent } from "@/components/SEO/StreamingSEOContent";
import { VIPBridge } from "@/components/UI/VIPBridge";
import { VIPEventHub } from "@/components/SEO/VIPEventHub";
import { UltraFooter } from "@/components/SEO/UltraFooter";
import { IstanbulConquestMatrix } from "@/components/SEO/IstanbulConquestMatrix";
import { generateLocationMetadata } from "@/lib/seo-metadata";
import { generateUltraGraphSchema } from "@/lib/seo-schema";
import { generateGodModeContent } from "@/lib/seo-content";
import { UltraCard } from "@/components/UI/UltraCard";
import { getHybridProfiles } from "@/lib/ad-service";
import { HybridProfileGrid } from "@/components/UI/HybridProfileGrid";
import { prisma } from "@/lib/prisma";
import { generateUltraContextualContent } from "@/lib/ai-seo";
import { LocalTrustHub } from "@/components/UI/LocalTrustHub";
import { GrowthWidgets } from "@/components/UI/GrowthWidgets";
import { sanitizeDisplayName } from "@/lib/utils";
import { headers } from "next/headers";
import { getSiteId } from "@/lib/site-context";
import { SEOContentEngine } from "@/components/SEO/SEOContentEngine";
import { LivePhotoMarquee } from "@/components/UI/LivePhotoMarquee";

export const dynamic = "force-dynamic";
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  let host = (await headers()).get("host") || siteConfig.domain;
  host = host.replace(/^www\./, '');

  // 🔱 HYDRA MISSION CHECK
  const allowedCities = getCitiesForHost(host);
  if (!allowedCities[city.toLowerCase()]) {
    return {}; // Let the main component handle notFound
  }

  const siteId = await getSiteId(host);
  
  let cityObj = allowedCities[city.toLowerCase()];

  // 🏰 GODMODE FALLBACK: Check database with SiteId
  if (!cityObj) {
    const dbContent = await prisma.pageContent.findFirst({ 
      where: { 
        slug: city, 
        OR: [{ siteId }, { siteId: null }]
      },
      orderBy: { siteId: 'desc' }
    });
    if (dbContent) {
      cityObj = {
        name: sanitizeDisplayName(dbContent.title || city),
        slug: city,
      } as any;
    }
  }

  const cityName = (cityObj?.name || sanitizeDisplayName(city)).replace(/escort|eskort/gi, '').trim();
  
  return generateLocationMetadata({
    city,
    cityName: cityName,
    domain: host,
    customTitle: `🔥 ${cityName} ESCORT AJANSI | VIP %100 GERÇEK VİTRİN | DRKCNAY`
  });
}

export default async function CityHubPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  let host = (await headers()).get("host") || siteConfig.domain;
  host = host.replace(/^www\./, '');

  // 🔱 HYDRA MISSION CHECK: Is this city allowed for this host?
  const allowedCities = getCitiesForHost(host);
  if (!allowedCities[city.toLowerCase()]) {
    return notFound();
  }

  const siteId = await getSiteId(host);
  const baseUrl = `https://${host}`;

  let cityObj = allowedCities[city.toLowerCase()];

  // GODMODE FALLBACK: Check database with SiteId
  let dbContent = await prisma.pageContent.findFirst({ 
    where: { 
      slug: city, 
      OR: [{ siteId }, { siteId: null }]
    },
    orderBy: { siteId: 'desc' }
  });
  
  if (!cityObj) {
    if (dbContent) {
      cityObj = {
        name: dbContent.title || (city.charAt(0).toUpperCase() + city.slice(1)),
        slug: city,
        districts: []
      } as any;
    }
  }

  const fallbackCityName = sanitizeDisplayName(city);

  if (!cityObj) {
    const dbCity = await prisma.pageContent.findFirst({ 
      where: { 
        slug: city, 
        OR: [{ siteId }, { siteId: null }]
      },
      orderBy: { siteId: 'desc' }
    });
    cityObj = dbCity 
      ? { name: dbCity.title || fallbackCityName, slug: city, districts: [] } as any
      : { name: fallbackCityName, slug: city, districts: [] } as any;
  }

  const cityName = cityObj?.name || fallbackCityName;
  const profiles = await getHybridProfiles({ city, limit: 12 });
  const theme = ThemeEngine.getTheme(host);
  // Content moved to StreamingSEOContent to prevent 524 timeouts

  const ultraSchema = generateUltraGraphSchema({
    locationName: `${cityName}`,
    city: cityName,
    description: `${cityName} genelinde VIP escort ajansı rehberi. En iyi escort bayan profilleri.`,
    url: `https://${host}/${city}`,
    categoryTitle: "VIP ESCORT AJANSI v16.0",
    faqs: [], // Will be enriched on the client/background if needed, or simplified here
    telephone: siteConfig.contact.whatsappNumber
  });

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-rose-600/30 selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ultraSchema) }} />
      <Navbar />
      
      <main className="pt-28">
        {/* 🏆 DRKCNAY VIP VİTRİN: PRIORITY ACCESS */}
        <div className="w-full relative z-0 mb-12">
           <DorukVitrin city={cityName} />
        </div>

        {/* 🚀 LIVE PHOTO MARQUEE (COMPETITOR KILLER) */}
        <LivePhotoMarquee />

        {/* 🔱 HERO SECTION: REGIONAL AUTHORITY v10.0 */}
        <section className="max-w-7xl mx-auto px-6 mb-32 mt-20 relative">
          <div className="absolute -top-20 left-0 w-full h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent opacity-30" />
          
          <Breadcrumbs items={[{ name: cityName, item: `${baseUrl}/${city}` }]} />
          
          <div className="inline-flex items-center gap-4 bg-zinc-950/40 backdrop-blur-2xl border border-rose-600/20 px-8 py-3 rounded-full mb-16 animate-fade-in shadow-glow-rose mt-12">
            <span className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-glow-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400">
               {cityName.toUpperCase()} VIP ESCORT AJANSI // DRKCNAY NETWORK
            </span>
          </div>
          
          <h1 className="hero-title-dynamic text-6xl md:text-[10rem] mb-12 tracking-tighter !leading-[0.85] flex flex-col items-start">
            <span className="opacity-90">{cityName}</span>
            <span className="text-rose-600 drop-shadow-[0_0_50px_rgba(225,29,72,0.6)]">ESCORT AJANSI</span>
          </h1>
          
          <p className="text-zinc-500 text-xl md:text-3xl font-black italic border-l-8 border-rose-600 pl-12 max-w-4xl leading-tight opacity-90">
            {cityName} bölgesindeki en yüksek hizmet standartları ve <br className="hidden md:block"/>
            <span className="text-white border-b-2 border-rose-600/30 pb-1">doğrulanmış gerçek</span> escort bayanlar.
          </p>
        </section>

        {/* 🏆 VIP EVENT HUB: REGIONAL HOOK */}
        <div className="relative">
           <div className="absolute inset-0 bg-rose-600/5 blur-[120px] rounded-full -z-10" />
           <VIPEventHub />
        </div>

        {/* 🔱 VIP TRANSITION BRIDGE */}
        <VIPBridge />

        {/* 📝 LONG FORM CONTENT: AI-DRIVEN STREAMING SEO */}
        <StreamingSEOContent 
          city={city} 
          host={host} 
          cityName={cityName} 
        />

        {/* 💣 ISTANBUL DOMINATION HUB (Conditional) */}
        {cityName.toLowerCase() === 'istanbul' && <IstanbulConquestMatrix />}

        {/* 🔱 ELİT SEO REHBERİ: BÖLGESEL İÇERİK */}
        <SEOContentEngine cityName={cityName} host={host} />

      </main>

      <UltraFooter host={host} cityName={cityName} />
    </div>
  );
}
