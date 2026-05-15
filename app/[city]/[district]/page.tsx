import Link from "next/link";
import { Suspense } from "react";
import { Metadata } from "next";
import { sanitizeDisplayName } from "@/lib/utils";
import { cities, getCitiesForHost, Neighborhood } from "@/lib/locations";
import { ThemeEngine } from "@/lib/theme-engine";
import { siteConfig } from "@/config/site";
import Breadcrumbs from "@/components/UI/Breadcrumbs";
import { DorukVitrin } from "@/components/SEO/DorukVitrin";
import { SEOContentEngine } from "@/components/SEO/SEOContentEngine";
import { StreamingSEOContent } from "@/components/SEO/StreamingSEOContent";
import { VIPBridge } from "@/components/UI/VIPBridge";
import { VIPEventHub } from "@/components/SEO/VIPEventHub";
import { UltraFooter } from "@/components/SEO/UltraFooter";
import { IstanbulConquestMatrix } from "@/components/SEO/IstanbulConquestMatrix";
import Navbar from "@/components/UI/Navbar";
import { VerificationBadge } from "@/components/UI/ConciergeSuite";
import { cityAdmins, defaultAdmin } from "@/config/admins";
import { Landmark as LandmarkIcon, Building, TreePine, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { SecureHTML } from "@/components/SecureHTML";
import { generateLocationMetadata } from "@/lib/seo-metadata";
import { headers } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import { generateGodModeContent } from "@/lib/seo-content";
import { generateUltraGraphSchema } from "@/lib/seo-schema";
import { taxonomyCategories } from "@/lib/taxonomy";
import EventAwareBanner from "@/components/UI/EventAwareBanner";
import { getHybridProfiles, getVitrinProfiles, getPageContent } from "@/lib/data-cache";
import { getSiteId } from "@/lib/site-context";
import { LivePhotoMarquee } from "@/components/UI/LivePhotoMarquee";

export const revalidate = 3600;
export const dynamicParams = true;

interface Params {
  city: string;
  district: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { city, district } = await params;
  let host = (await headers()).get("host") || siteConfig.domain;
  host = host.replace(/^www\./, '');

  // 🔱 HYDRA MISSION CHECK
  const allowedCities = getCitiesForHost(host);
  if (!allowedCities[city.toLowerCase()]) {
    return {}; 
  }

  const siteId = await getSiteId(host);
  
  // 🔱 PARALLEL DB PROBING
  const [dbCity, dbDist] = await Promise.all([
    getPageContent(city.toLowerCase(), siteId),
    getPageContent(district.includes(city) ? district : `${city}-${district}`, siteId)
  ]);

  let cityObj = (allowedCities as any)[city.toLowerCase()];
  if (!cityObj && dbCity) {
    cityObj = { name: sanitizeDisplayName(dbCity.title || city), slug: city, districts: [], landmarks: [] } as any;
  }

  let distObj = cityObj?.districts?.find((d: any) => d.slug === district) || (dbDist ? { name: sanitizeDisplayName(dbDist.title || district), slug: district } as any) : null;
  let landmarkObj = cityObj?.landmarks?.find((l: any) => l.slug === district);

  if (!cityObj || (!distObj && !landmarkObj)) {
    const formattedCity = city.replace(/-/g, ' ').replace(/escort|eskort/gi, '').trim().toUpperCase();
    const formattedDist = district.replace(/-/g, ' ').replace(/escort|eskort/gi, '').trim().toUpperCase();
    return generateLocationMetadata({
      city,
      cityName: formattedCity,
      district,
      districtName: formattedDist,
      domain: host,
      customTitle: `🔞 ${formattedDist} ESCORT BAYAN | %100 GERÇEK İLANLAR [2026]`
    });
  }

  const cityName = cityObj?.name || sanitizeDisplayName(city);
  const districtName = distObj?.name || landmarkObj?.name || sanitizeDisplayName(district);

  if (landmarkObj) {
    return generateLocationMetadata({
      city,
      cityName: cityName,
      landmarkName: districtName,
      domain: host
    });
  }

  return generateLocationMetadata({
    city,
    cityName: cityName,
    district,
    districtName: districtName,
    domain: host,
    customTitle: `🔞 ${districtName.toUpperCase()} ESCORT | VIP ESCORT BAYANLAR`
  });
}

export default async function DistrictHubPage({ params }: { params: Promise<Params> }) {
  const { city: rawCity, district: rawDistrict } = await params;
  const city = decodeURIComponent(rawCity).toLowerCase();
  const district = decodeURIComponent(rawDistrict);
  let host = (await headers()).get("host") || siteConfig.domain;
  host = host.replace(/^www\./, '');

  // 🔱 HYDRA MISSION CHECK
  const allowedCities = getCitiesForHost(host);
  if (!allowedCities[city]) {
    return notFound();
  }

  const siteId = await getSiteId(host);
  
  // 🔱 PARALLEL DB PROBING
  const [dbCity, dbDistRaw] = await Promise.all([
    getPageContent(city, siteId),
    getPageContent(district.includes(city) ? district : `${city}-${district}`, siteId)
  ]);

  const fallbackCityName = sanitizeDisplayName(city);
  const fallbackDistName = sanitizeDisplayName(district);

  let cityObj = (allowedCities as any)[city];
  if (!cityObj && dbCity) {
    cityObj = { name: dbCity.title || fallbackCityName, slug: city, districts: [], landmarks: [] } as any;
  } else if (!cityObj) {
    cityObj = { name: fallbackCityName, slug: city, districts: [], landmarks: [] } as any;
  }

  let distObj = cityObj?.districts?.find((d: any) => d.slug === district);
  const landmarkObj = cityObj?.landmarks?.find((l: any) => l.slug === district);

  if (!distObj && !landmarkObj) {
     distObj = dbDistRaw 
       ? { name: sanitizeDisplayName(dbDistRaw.title || fallbackDistName), slug: district, neighborhoods: [] } as any
       : { name: fallbackDistName, slug: district, neighborhoods: [] } as any;
  }

  const isLandmark = !!landmarkObj;
  const dName = String(isLandmark ? sanitizeDisplayName(landmarkObj.name) : (distObj?.name || fallbackDistName));
  const cityName = String(cityObj?.name || fallbackCityName);
  
  // 🛡️ Error #130 Prevention: Ensure nothing is an object
  const safeCityName = typeof cityName === 'string' ? cityName : "İstanbul";
  const safeDistName = typeof dName === 'string' ? dName : "Escort";

  // 🔱 GOD-MODE: PARALLEL DATA ACQUISITION
  const [profilesResult, vitrinProfiles] = await Promise.all([
    getHybridProfiles({ city, district, limit: 8 }).catch(() => []),
    getVitrinProfiles().catch(() => [])
  ]);
  
  const profiles = profilesResult;
  const theme = ThemeEngine.getTheme(host);
  const currentYear = new Date().getFullYear();

  const ultraSchema = generateUltraGraphSchema({
    locationName: `${safeDistName}`,
    city: safeCityName,
    description: `${safeDistName} bölgesinde VIP escort ajansı rehberi. En hiddetli escort bayan profilleri ve kaporasız randevu.`,
    url: `https://${host}/${city}/${district}`,
    categoryTitle: "VIP ESCORT AJANSI v16.0",
    faqs: [
      { q: `${safeDistName} escort hizmetleri kaporasız mı?`, a: "Evet, tüm buluşmalarımız %100 kaporasız ve güvenlidir." },
      { q: `${safeDistName} bölgesinde eve servis var mı?`, a: "Evet, seçkin modellerimiz hem eve hem de otellere servis sağlamaktadır." }
    ],
    telephone: "+905520949245"
  });

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-rose-600/30 selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ultraSchema) }} />
      <Navbar />
      
      <main className="pt-28">
        {/* 🏆 DRKCNAY VIP VİTRİN: DISTRICT PRIORITY */}
        <div className="w-full relative z-0 mb-12">
            <DorukVitrin city={String(safeCityName)} host={host} serverProfiles={vitrinProfiles} />
        </div>

        {/* 🔱 HERO SECTION: DISTRICT AUTHORITY v10.0 */}
        <section className="max-w-7xl mx-auto px-6 mb-32 mt-20 relative">
          <div className="absolute -top-20 left-0 w-full h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent opacity-30" />
          
          <Breadcrumbs items={[{ name: String(safeCityName), item: `/${city}` }, { name: String(safeDistName), item: `/${city}/${district}` }]} />
          
          <div className="inline-flex items-center gap-4 bg-zinc-950/40 backdrop-blur-2xl border border-rose-600/20 px-8 py-3 rounded-full mb-16 animate-fade-in shadow-glow-rose mt-12">
            <span className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-glow-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400">
               {String(safeDistName).toUpperCase()} VIP ESCORT MERKEZİ // DRKCNAY NETWORK
            </span>
          </div>

          <h1 className="hero-title-dynamic text-6xl md:text-[10rem] mb-12 tracking-tighter leading-[0.85]! flex flex-col items-start">
            <span className="opacity-90">{String(safeCityName)}</span>
            <span className="text-rose-600 drop-shadow-[0_0_50px_rgba(225,29,72,0.6)]">ESCORT AJANSI</span>
          </h1>
          
          <p className="text-zinc-500 text-xl md:text-3xl font-black italic border-l-8 border-rose-600 pl-12 max-w-4xl leading-tight opacity-90">
            {String(safeCityName)} bölgesindeki en yüksek hizmet standartları ve <br className="hidden md:block"/>
            <span className="text-white border-b-2 border-rose-600/30 pb-1">doğrulanmış gerçek</span> escort bayanlar.
          </p>

          <div className="mt-12 bg-rose-600/10 border border-rose-600/20 p-8 rounded-3xl max-w-2xl">
             <h4 className="text-rose-600 font-black uppercase tracking-widest text-sm mb-2">🏥 DRKCNAY PROTOKOLÜ</h4>
             <p className="text-xs text-zinc-400 italic">Dr. Dorukcan Ay tarafından akredite edilen hijyen ve sağlık standartları {String(safeDistName)} bölgesinde aktiftir. İlişki koçluğu ve biyolojik performans optimizasyonu için en hiddetli rehber.</p>
          </div>

        </section>


        {/* 🏆 VIP EVENT HUB: REGIONAL HOOK */}
        <div className="relative">
           <div className="absolute inset-0 bg-rose-600/5 blur-[120px] rounded-full -z-10" />
           <VIPEventHub />
        </div>

        {/* 🔱 VIP TRANSITION BRIDGE */}
        <VIPBridge />

        {/* 📝 LONG FORM CONTENT: AI-DRIVEN STREAMING SEO */}
        <Suspense fallback={<div className="h-96 bg-zinc-950/20 animate-pulse rounded-[5rem] mx-6 mb-40" />}>
          <StreamingSEOContent 
            city={city} 
            district={district}
            neighborhood={isLandmark ? String(landmarkObj.name) : undefined}
            host={host} 
            cityName={String(safeDistName)} 
          />
        </Suspense>

        {/* 💣 ISTANBUL DOMINATION HUB (Conditional) */}
        <Suspense fallback={null}>
          {String(safeCityName).toLowerCase() === 'istanbul' && <IstanbulConquestMatrix />}
        </Suspense>

        {/* 🔱 AGGRESSIVE SEO ENGINE: CONTENT & TAGS */}
        <Suspense fallback={null}>
          <SEOContentEngine cityName={String(safeCityName)} districtName={String(safeDistName)} host={host} />
        </Suspense>

      </main>

      <Suspense fallback={<div className="h-screen bg-black" />}>
        <UltraFooter host={host} cityName={String(safeCityName)} districtName={String(safeDistName)} />
      </Suspense>
    </div>
  );
}
