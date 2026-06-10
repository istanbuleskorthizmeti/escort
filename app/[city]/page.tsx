import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

// Relative Imports (Linux/Production Safe)
import { getCitiesForHost, City } from "../../lib/locations";
import { siteConfig } from "../../config/site";
import { getSiteId, getCanonicalHost } from "../../lib/site-context";
import { getVitrinProfiles, getPageContent } from "../../lib/data-cache";
import { generateLocationMetadata } from "../../lib/seo-metadata";
import { generateUltraGraphSchema } from "../../lib/seo-schema";
import { sanitizeDisplayName } from "../../lib/utils";

// Component Imports
import Navbar from "../../components/UI/Navbar";
import Breadcrumbs from "../../components/UI/Breadcrumbs";
import { DorukVitrin } from "../../components/SEO/DorukVitrin";
import { StreamingSEOContent } from "../../components/SEO/StreamingSEOContent";
import { VIPBridge } from "../../components/UI/VIPBridge";
import { VIPEventHub } from "../../components/SEO/VIPEventHub";
import { UltraFooter } from "../../components/SEO/UltraFooter";
import { IstanbulConquestMatrix } from "../../components/SEO/IstanbulConquestMatrix";
import { LivePhotoMarquee } from "../../components/UI/LivePhotoMarquee";
import { SEOContentEngine } from "../../components/SEO/SEOContentEngine";
import { UserReviews } from "../../components/SEO/UserReviews";
import { getDeterministicRating } from "../../lib/seo-schema";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const hostHeader = (await headers()).get("host") || siteConfig.domain;
  const host = getCanonicalHost(hostHeader);

  const allowedCities = getCitiesForHost(host);
  if (!allowedCities[city.toLowerCase()]) {
    return {
      title: "Sayfa Bulunamadı",
      robots: { index: false, follow: false, noarchive: true }
    };
  }

  const siteId = await getSiteId(host);
  const dbContent = await getPageContent(city, siteId);
  let cityObj: City | undefined = allowedCities[city.toLowerCase()];

  if (!cityObj && dbContent) {
      cityObj = {
        name: sanitizeDisplayName(dbContent.title || city),
        slug: city,
        districts: [],
      };
  }

  if (!cityObj) {
    return {
      title: "Sayfa Bulunamadı",
      robots: { index: false, follow: false, noarchive: true }
    };
  }

  const cityName = (cityObj?.name || sanitizeDisplayName(city)).replace(/escort|eskort/gi, '').trim();
  
  return generateLocationMetadata({
    city,
    cityName: cityName,
    domain: host,
  });
}

export default async function CityHubPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const hostHeader = (await headers()).get("host") || siteConfig.domain;
  const host = getCanonicalHost(hostHeader);

  const allowedCities = getCitiesForHost(host);
  if (!allowedCities[city.toLowerCase()]) {
    return notFound();
  }

  const siteId = await getSiteId(host);
  const baseUrl = `https://${host}`;

  const [dbContent, vitrinProfiles] = await Promise.all([
    getPageContent(city, siteId),
    getVitrinProfiles().catch(() => [])
  ]);

  let cityObj: City | undefined = allowedCities[city.toLowerCase()];
  if (!cityObj && dbContent) {
    cityObj = {
      name: dbContent.title || (city.charAt(0).toUpperCase() + city.slice(1)),
      slug: city,
      districts: []
    };
  } else if (!cityObj) {
    cityObj = { name: sanitizeDisplayName(city), slug: city, districts: [] };
  }
  
  const cityName = (cityObj?.name || sanitizeDisplayName(city)).replace(/escort|eskort/gi, '').trim();
  const url = `https://${host}/${city}`;
  const { ratingValue, reviewCount } = getDeterministicRating(url);

  const ultraSchema = generateUltraGraphSchema({
    locationName: `${cityName}`,
    city: cityName,
    description: `${cityName} genelinde VIP escort ajansı rehberi. En iyi escort bayan profilleri.`,
    url: url,
    categoryTitle: "VIP ESCORT AJANSI v16.0",
    faqs: [],
    telephone: siteConfig.contact.whatsappNumber
  });

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-[var(--primary-color)]/30 selection:text-white">
      <link rel="amphtml" href={`https://${host}/amp?loc=${city}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ultraSchema) }} />
      <Navbar />
      
      <main className="pt-28">
        <div className="w-full relative z-0 mb-12">
           <DorukVitrin city={cityName} host={host} serverProfiles={vitrinProfiles} />
        </div>

        <LivePhotoMarquee />

        <section className="max-w-7xl mx-auto px-6 mb-32 mt-20 relative">
          <div className="absolute -top-20 left-0 w-full h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent opacity-30" />
          
          <Breadcrumbs items={[{ name: cityName, item: `${baseUrl}/${city}` }]} />
          
          <div className="inline-flex items-center gap-4 bg-zinc-950/40 backdrop-blur-2xl border border-[var(--primary-color)]/20 px-8 py-3 rounded-full mb-16 shadow-glow-[var(--primary-color)] mt-12">
            <span className="w-2.5 h-2.5 bg-[var(--primary-color)] rounded-full animate-glow-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400">
               {cityName.toUpperCase()} {host.includes('dorukcanay.digital') ? 'VIP COMPANION PARTNERLER' : 'VIP ESCORT AJANSI'}
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
                  {emoji1} {cityName}
                </span>
                <span className="text-[var(--primary-color)] drop-shadow-[0_0_50px_var(--primary-color)] uppercase flex items-center gap-2">
                  {host.includes('dorukcanay.digital') ? 'VIP COMPANION' : 'ESCORT AJANSI'} {emoji2}
                </span>
              </h1>
            );
          })()}
          
          <p className="text-zinc-500 text-xl md:text-3xl font-black italic border-l-8 border-[var(--primary-color)] pl-12 max-w-4xl leading-tight opacity-90">
            {host.includes('dorukcanay.digital') ? (
              <>
                {cityName} genelinde lüks yaşam stiline özel <br className="hidden md:block"/>
                <span className="text-white border-b-2 border-[var(--primary-color)]/30 pb-1">kaporasız elit model</span> refakatçi profilleri.
              </>
            ) : (
              <>
                {cityName} bölgesindeki en yüksek hizmet standartları ve <br className="hidden md:block"/>
                <span className="text-white border-b-2 border-[var(--primary-color)]/30 pb-1">doğrulanmış gerçek</span> escort bayanlar.
              </>
            )}
          </p>
        </section>

        <div className="relative">
           <div className="absolute inset-0 bg-[var(--primary-color)]/5 blur-[120px] rounded-full -z-10" />
           <VIPEventHub />
        </div>

        <VIPBridge />

        <StreamingSEOContent 
          city={city} 
          host={host} 
          cityName={cityName} 
        />

        {cityName.toLowerCase() === 'istanbul' && <IstanbulConquestMatrix />}

        <SEOContentEngine cityName={cityName} host={host} />

      </main>

      <UserReviews locationName={cityName} ratingValue={ratingValue} reviewCount={reviewCount} />
      <UltraFooter host={host} cityName={cityName} />
    </div>
  );
}
