import { Metadata } from "next";
import { sanitizeDisplayName, turkishToUpper } from "@/lib/utils";
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
import { generateUltraGraphSchema, getDeterministicRating } from "@/lib/seo-schema";
import { getHybridProfiles } from "@/lib/ad-service";
import { HybridProfileGrid } from "@/components/UI/HybridProfileGrid";
import { prisma } from "@/lib/prisma";
import { getPageContent } from "@/lib/data-cache";
import { GrowthWidgets } from "@/components/UI/GrowthWidgets";
import { getSiteId, getCanonicalHost } from "@/lib/site-context";
import { UserReviews } from "@/components/SEO/UserReviews";

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
  const hostHeader = (await headers()).get("host") || siteConfig.domain;
  const host = getCanonicalHost(hostHeader);

  // 🔱 HYDRA MISSION CHECK
  const allowedCities = getCitiesForHost(host);
  if (!allowedCities[city]) {
    return {
      title: "Sayfa Bulunamadı",
      robots: { index: false, follow: false, noarchive: true }
    }; 
  }

  const siteId = await getSiteId(host);
  
  let cityObj = allowedCities[city];
  let distObj = cityObj?.districts.find((d) => d.slug === district);
  let neighObj = distObj?.neighborhoods.find((n) => n.slug === neighborhood);

  if (!cityObj || !distObj || !neighObj) {
    const fullSlug = `${city}-${district}-${neighborhood}`;
    const dbContent = await getPageContent(fullSlug, siteId);
    
    if (dbContent) {
      neighObj = {
        name: sanitizeDisplayName(dbContent.title || neighborhood),
        slug: neighborhood
      } as any;
    }
  }

  if (!cityObj || !distObj || !neighObj) {
    return {
      title: "Sayfa Bulunamadı",
      robots: { index: false, follow: false, noarchive: true }
    };
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
  const hostHeader = (await headers()).get("host") || siteConfig.domain;
  const host = getCanonicalHost(hostHeader);

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
    let dbContent = await getPageContent(fullSlug, siteId);
    if (dbContent) {
      neighObj = { name: sanitizeDisplayName(dbContent.title || neighborhood), slug: neighborhood } as any;
      cityObj = cityObj || { name: turkishToUpper(city) };
      distObj = distObj || { name: turkishToUpper(district) };
    }
  }

  if (!cityObj || !distObj || !neighObj) notFound();

  const nName = sanitizeDisplayName(neighObj.name);
  const dName = sanitizeDisplayName(distObj.name);
  const cityName = sanitizeDisplayName(cityObj.name);
  
  const url = `https://${host}/${city}/${district}/${neighborhood}`;
  const { ratingValue, reviewCount } = getDeterministicRating(url);

  const ultraSchema = generateUltraGraphSchema({
    locationName: `${nName}`,
    city: cityName,
    description: `${cityName} ${dName} ${nName} bölgesinde VIP escort ajansı rehberi. En elit partnerler ve kaporasız randevu.`,
    url: url,
    categoryTitle: "VIP ESCORT AJANSI v16.0",
    faqs: [
      { q: `${nName} escort hizmetleri kaporasız mı?`, a: "Evet, tüm buluşmalarımız %100 kaporasız ve güvenlidir." },
      { q: `${nName} bölgesinde eve servis var mı?`, a: "Evet, seçkin modellerimiz hem eve hem de otellere servis sağlamaktadır." }
    ],
    telephone: siteConfig.contact.whatsappNumber ? `+${siteConfig.contact.whatsappNumber}` : "+90 501 635 50 53"
  });

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-(--primary-color)/30 selection:text-white">
      <link rel="amphtml" href={`https://${host}/amp?loc=${neighborhood}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ultraSchema) }} />
      <Navbar />
      
      <main className="pt-32">
        {/* 🔱 HERO SECTION: NEIGHBORHOOD AUTHORITY v10.0 */}
        <section className="max-w-7xl mx-auto px-6 mb-32 mt-20 relative">
          <div className="absolute -top-20 left-0 w-full h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent opacity-30" />
          
          <Breadcrumbs items={[{ name: cityName, item: `/${city}` }, { name: dName, item: `/${city}/${district}` }, { name: nName, item: `/${city}/${district}/${neighborhood}` }]} />
          
          <div className="inline-flex items-center gap-4 bg-zinc-950/40 backdrop-blur-2xl border border-(--primary-color)/20 px-8 py-3 rounded-full mb-16 animate-fade-in shadow-glow-(--primary-color) mt-12">
            <span className="w-2.5 h-2.5 bg-(--primary-color) rounded-full animate-glow-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400">
               {turkishToUpper(nName)} {host.includes('dorukcanay.digital') ? 'VIP COMPANION' : 'LOCAL AUTHORITY'}
            </span>
          </div>

          {(() => {
            const hostHash = host.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const primaryEmojis = ['💎', '👑', '⭐', '🔥', '⚡', '✨', '💋', '🍒'];
            const secondaryEmojis = ['🔥', '✨', '⚡', '👑', '💎', '💋', '🍒', '⭐'];
            const emoji1 = primaryEmojis[hostHash % primaryEmojis.length];
            const emoji2 = secondaryEmojis[(hostHash + 3) % secondaryEmojis.length];
            return (
              <h1 className="hero-title-dynamic text-6xl md:text-[10rem] mb-12 tracking-tighter leading-[0.85]! flex flex-col items-start uppercase italic">
                <span className="opacity-90 flex items-center gap-2">
                  {emoji1} {nName}
                </span>
                <span className="text-(--primary-color) drop-shadow-[0_0_50px_(--primary-color)] flex items-center gap-2">
                  {host.includes('dorukcanay.digital') ? 'VIP COMPANION' : 'ESCORT AJANSI'} {emoji2}
                </span>
              </h1>
            );
          })()}
          
          <p className="text-zinc-500 text-xl md:text-3xl font-black italic border-l-8 border-(--primary-color) pl-12 max-w-4xl leading-tight opacity-90">
            {host.includes('dorukcanay.digital') ? (
              <>
                {cityName} {dName} {nName} bölgesinde lüks yaşam tarzına özel <br className="hidden md:block"/>
                <span className="text-white border-b-2 border-(--primary-color)/30 pb-1">kaporasız elit model</span> refakatçiler.
              </>
            ) : (
              <>
                {cityName} {dName} {nName} bölgesindeki en elit escort rehberi ve <br className="hidden md:block"/>
                <span className="text-white border-b-2 border-(--primary-color)/30 pb-1">doğrulanmış gerçek</span> escort bayanlar.
              </>
            )}
          </p>
        </section>

        {/* 🏆 LOCAL SHOWCASE */}
        <div className="w-full relative z-0 mb-12">
            <DorukVitrin city={cityName} district={dName} neighborhood={nName} host={host} />
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

      <UserReviews locationName={nName} ratingValue={ratingValue} reviewCount={reviewCount} />
      <UltraFooter host={host} cityName={cityName} districtName={dName} />
    </div>
  );
}
