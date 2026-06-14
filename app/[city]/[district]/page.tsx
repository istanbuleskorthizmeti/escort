import { Suspense } from "react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

// Relative Imports (Linux/Production Safe - 3 Levels Deep)
import { sanitizeDisplayName, turkishToLower, turkishToUpper } from "../../../lib/utils";
import { getCitiesForHost, City, District, Landmark } from "../../../lib/locations";
import { siteConfig } from "../../../config/site";
import { getVitrinProfiles, getPageContent } from "../../../lib/data-cache";
import { getSiteId, getCanonicalHost } from "../../../lib/site-context";
import { generateLocationMetadata } from "../../../lib/seo-metadata";
import { generateUltraGraphSchema } from "../../../lib/seo-schema";

// Component Imports
import Navbar from "../../../components/UI/Navbar";
import Breadcrumbs from "../../../components/UI/Breadcrumbs";
import { DorukVitrin } from "../../../components/SEO/DorukVitrin";
import { SEOContentEngine } from "../../../components/SEO/SEOContentEngine";
import { StreamingSEOContent } from "../../../components/SEO/StreamingSEOContent";
import { VIPBridge } from "../../../components/UI/VIPBridge";
import { VIPEventHub } from "../../../components/SEO/VIPEventHub";
import { UltraFooter } from "../../../components/SEO/UltraFooter";
import { IstanbulConquestMatrix } from "../../../components/SEO/IstanbulConquestMatrix";
import { LivePhotoMarquee } from "../../../components/UI/LivePhotoMarquee";
import { UserReviews } from "../../../components/SEO/UserReviews";
import { getDeterministicRating } from "../../../lib/seo-schema";

export const dynamic = "force-dynamic";
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
  const { city: rawCity, district: rawDistrict } = await params;
  const city = turkishToLower(decodeURIComponent(rawCity));
  const district = turkishToLower(decodeURIComponent(rawDistrict));
  const hostHeader = (await headers()).get("host") || siteConfig.domain;
  const host = getCanonicalHost(hostHeader);

  const allowedCities = getCitiesForHost(host);
  if (!allowedCities[city]) {
    return {
      title: "Sayfa Bulunamadı",
      robots: { index: false, follow: false, noarchive: true }
    }; 
  }

  const siteId = await getSiteId(host);
  const [dbCity, dbDist] = await Promise.all([
    getPageContent(city, siteId),
    getPageContent(district.includes(city) ? district : `${city}-${district}`, siteId)
  ]);

  let cityObj: City | undefined = (allowedCities as Record<string, City>)[city];
  if (!cityObj && dbCity) {
    cityObj = { name: sanitizeDisplayName(dbCity.title || city), slug: city, districts: [], landmarks: [] };
  }

  const distObj: District | null = cityObj?.districts?.find((d) => d.slug === district) || (dbDist ? { name: sanitizeDisplayName(dbDist.title || district), slug: district, neighborhoods: [] } : null);
  const landmarkObj: Landmark | undefined = cityObj?.landmarks?.find((l) => l.slug === district);

  if (!cityObj || (!distObj && !landmarkObj)) {
    return {
      title: "Sayfa Bulunamadı",
      robots: { index: false, follow: false, noarchive: true }
    };
  }

  const cityName = cityObj?.name || sanitizeDisplayName(city);
  const districtName = distObj?.name || landmarkObj?.name || sanitizeDisplayName(district);

  return generateLocationMetadata({
    city,
    cityName: cityName,
    district,
    districtName: districtName,
    domain: host,
  });
}

export default async function DistrictHubPage({ params }: { params: Promise<Params> }) {
  const { city: rawCity, district: rawDistrict } = await params;
  const city = turkishToLower(decodeURIComponent(rawCity));
  const district = turkishToLower(decodeURIComponent(rawDistrict));
  const hostHeader = (await headers()).get("host") || siteConfig.domain;
  const host = getCanonicalHost(hostHeader);

  const allowedCities = getCitiesForHost(host);
  if (!allowedCities[city]) {
    return notFound();
  }

  const siteId = await getSiteId(host);
  const [dbCity, dbDistRaw] = await Promise.all([
    getPageContent(city, siteId),
    getPageContent(district.includes(city) ? district : `${city}-${district}`, siteId)
  ]);

  const fallbackCityName = sanitizeDisplayName(city);
  const fallbackDistName = sanitizeDisplayName(district);

  let cityObj: City | undefined = (allowedCities as Record<string, City>)[city];
  if (!cityObj && dbCity) {
    cityObj = { name: dbCity.title || fallbackCityName, slug: city, districts: [], landmarks: [] };
  } else if (!cityObj) {
    cityObj = { name: fallbackCityName, slug: city, districts: [], landmarks: [] };
  }

  let distObj: District | undefined = cityObj?.districts?.find((d) => d.slug === district);
  const landmarkObj: Landmark | undefined = cityObj?.landmarks?.find((l) => l.slug === district);

  if (!distObj && !landmarkObj) {
     if (!dbDistRaw) {
       return notFound();
     }
     distObj = { name: sanitizeDisplayName(dbDistRaw.title || fallbackDistName), slug: district, neighborhoods: [] };
  }

  const isLandmark = !!landmarkObj;
  const dName = String(isLandmark ? sanitizeDisplayName(landmarkObj.name) : (distObj?.name || fallbackDistName));
  const cityName = String(cityObj?.name || fallbackCityName);
  
  const safeCityName = typeof cityName === 'string' ? cityName : "İstanbul";
  const safeDistName = typeof dName === 'string' ? dName : "Escort";

  const [vitrinProfiles] = await Promise.all([
    getVitrinProfiles().catch(() => [])
  ]);
  const url = `https://${host}/${city}/${district}`;
  const { ratingValue, reviewCount } = getDeterministicRating(url);
  
  const ultraSchema = generateUltraGraphSchema({
    locationName: `${safeDistName}`,
    city: safeCityName,
    description: `${safeDistName} bölgesinde VIP escort ajansı rehberi. En hiddetli escort bayan profilleri ve kaporasız randevu.`,
    url: url,
    categoryTitle: "VIP ESCORT AJANSI v16.0",
    faqs: [
      { q: `${safeDistName} escort hizmetleri kaporasız mı?`, a: "Evet, tüm buluşmalarımız %100 kaporasız ve güvenlidir." },
      { q: `${safeDistName} bölgesinde eve servis var mı?`, a: "Evet, seçkin modellerimiz hem eve hem de otellere servis sağlamaktadır." }
    ],
    telephone: siteConfig.contact.whatsappNumber ? `+${siteConfig.contact.whatsappNumber}` : "+905520949245"
  });

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-(--primary-color)/30 selection:text-white">
      <link rel="amphtml" href={`https://${host}/amp?loc=${district}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ultraSchema) }} />
      <Navbar />
      
      <main className="pt-28">
        <div className="w-full relative z-0 mb-12">
             <DorukVitrin city={String(safeCityName)} host={host} serverProfiles={vitrinProfiles} />
         </div>
 
         <LivePhotoMarquee />
 
         <section className="max-w-7xl mx-auto px-6 mb-32 mt-20 relative">
           <div className="absolute -top-20 left-0 w-full h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent opacity-30" />
           
           <Breadcrumbs items={[{ name: String(safeCityName), item: `/${city}` }, { name: String(safeDistName), item: `/${city}/${district}` }]} />
           
           <div className="inline-flex items-center gap-4 bg-zinc-950/40 backdrop-blur-2xl border border-(--primary-color)/20 px-8 py-3 rounded-full mb-16 shadow-glow-(--primary-color) mt-12">
             <span className="w-2.5 h-2.5 bg-(--primary-color) rounded-full animate-glow-pulse" />
             <span className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400">
                {String(safeDistName).toUpperCase()} {host.includes('dorukcanay.digital') ? 'VIP COMPANION PORTALI' : 'VIP ESCORT MERKEZİ'} // DRKCNAY NETWORK
             </span>
           </div>
           
           {(() => {
             const hostHash = host.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
             const primaryEmojis = ['💎', '👑', '⭐', '🔥', '⚡', '✨', '💋', '🍒'];
             const secondaryEmojis = ['🔥', '✨', '⚡', '👑', '💎', '💋', '🍒', '⭐'];
             const emoji1 = primaryEmojis[hostHash % primaryEmojis.length];
             const emoji2 = secondaryEmojis[(hostHash + 3) % secondaryEmojis.length];
             return (
               <h1 className="text-6xl md:text-[10rem] mb-12 tracking-tighter leading-none flex flex-col items-start font-black italic">
                 <span className="opacity-90 flex items-center gap-2">
                   {emoji1} {String(safeDistName)}
                 </span>
                 <span className="text-(--primary-color) drop-shadow-[0_0_50px_(--primary-color)] uppercase flex items-center gap-2">
                   {host.includes('dorukcanay.digital') ? 'VIP COMPANION' : 'ESCORT AJANSI'} {emoji2}
                 </span>
               </h1>
             );
           })()}
           
           <p className="text-zinc-500 text-xl md:text-3xl font-black italic border-l-8 border-(--primary-color) pl-12 max-w-4xl leading-tight opacity-90">
             {host.includes('dorukcanay.digital') ? (
               <>
                 {String(safeDistName)} genelinde lüks yaşam stiline özel <br className="hidden md:block"/>
                 <span className="text-white border-b-2 border-(--primary-color)/30 pb-1">kaporasız elit model</span> refakatçi profilleri.
               </>
             ) : (
               <>
                 {String(safeDistName)} bölgesindeki en yüksek hizmet standartları ve <br className="hidden md:block"/>
                 <span className="text-white border-b-2 border-(--primary-color)/30 pb-1">doğrulanmış gerçek</span> escort bayanlar.
               </>
             )}
           </p>
 
           <div className="mt-12 bg-(--primary-color)/10 border border-(--primary-color)/20 p-8 rounded-3xl max-w-2xl">
              <h4 className="text-(--primary-color) font-black uppercase tracking-widest text-sm mb-2">🔱 {host.includes('dorukcanay.digital') ? 'DORUKCANAY ELITE PROTOKOLÜ' : 'DRKCNAY PROTOKOLÜ'}</h4>
              <p className="text-xs text-zinc-400 italic">
                {host.includes('dorukcanay.digital') ? (
                  <>Dorukcan Ay Premium Standartları çerçevesinde doğrulanmış hijyen ve sağlık protokolleri {String(safeDistName)} bölgesinde aktiftir.</>
                ) : (
                  <>Dr. Dorukcan Ay tarafından akredite edilen hijyen ve sağlık standartları {String(safeDistName)} bölgesinde aktiftir.</>
                )}
              </p>
           </div>
         </section>

        <VIPEventHub />
        <VIPBridge />

        <Suspense fallback={<div className="h-96 bg-zinc-950/20 animate-pulse rounded-[5rem] mx-6 mb-40" />}>
          <StreamingSEOContent 
            city={city} 
            district={district}
            neighborhood={isLandmark ? String(landmarkObj.name) : undefined}
            host={host} 
            cityName={String(safeDistName)} 
          />
        </Suspense>

        {String(safeCityName).toLowerCase() === 'istanbul' && <IstanbulConquestMatrix />}
        <SEOContentEngine cityName={String(safeCityName)} districtName={String(safeDistName)} host={host} />

      </main>

      <UserReviews locationName={String(safeDistName)} ratingValue={ratingValue} reviewCount={reviewCount} />
      <UltraFooter host={host} cityName={String(safeCityName)} districtName={String(safeDistName)} />
    </div>
  );
}
