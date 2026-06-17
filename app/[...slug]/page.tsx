import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";

// Relative Imports (Linux/Production Safe)
import { prisma } from "../../lib/prisma";
import { getSiteId, getCanonicalHost } from "../../lib/site-context";
import { siteConfig } from "../../config/site";
import { getDomainConfig } from "../../config/domains";
import { dedupeEscort, toTitleCaseTR, turkishToUpper } from "../../lib/utils";

// Component Imports
import Navbar from "../../components/UI/Navbar";
import { UltraFooter } from "../../components/SEO/UltraFooter";
import { SecureHTML } from "../../components/SecureHTML";
import { IstanbulConquestMatrix } from "../../components/SEO/IstanbulConquestMatrix";
import Breadcrumbs from "../../components/UI/Breadcrumbs";
import { DorukVitrin } from "../../components/SEO/DorukVitrin";

import { getPageContent } from "../../lib/data-cache";
import { generateUltraGraphSchema } from "../../lib/seo-schema";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug: slugArr } = await params;
  const slug = slugArr.join('/');
  const hostHeader = (await headers()).get("host") || siteConfig.domain;
  const host = getCanonicalHost(hostHeader);
  const siteId = await getSiteId(host);

  const content = await getPageContent(slug, siteId);

  if (!content) {
    const rawCityPart = slug.includes('/') ? slug.split('/').pop() : slug.split('-')[0];
    const cityFromName = rawCityPart || "istanbul";
    const cityName = toTitleCaseTR(cityFromName);
    return {
      title: dedupeEscort(`🔞 ${cityName} Escort Bayan | %100 GERÇEK VİTRİN`),
      description: dedupeEscort(`${cityName} genelinde lüks ve seçkin escort model rehberi. Ön ödemesiz, kaporasız ve %100 güvenli buluşmalar için VIP model partnerler.`),
    };
  }

  return {
    title: dedupeEscort(`🔥 ${(content.title || "Elite Escort").replace(/[-\u2013\u2014]/g, ' ')} | %100 GERÇEK VİTRİN`),
    description: dedupeEscort(content.content?.substring(0, 160).replace(/<[^>]*>?/gm, '').replace(/[-\u2013\u2014]/g, ' ') || "Profesyonel escort hizmetleri ve gerçek vitrin."),
  };
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugArr } = await params;
  const slug = slugArr.join('/');
  const hostHeader = (await headers()).get("host") || siteConfig.domain;
  const host = getCanonicalHost(hostHeader);
  const userAgent = (await headers()).get("user-agent") || "";
  const isBot = /googlebot|bingbot|yandexbot|ahrefsbot|msnbot|linkedinbot|exabot|compspybot|yesupbot|paperlibot|tweetmemebot|excelbot|w3c_validator|netcraftsurveyagent|seomoz|alexa|twitterbot/i.test(userAgent);
  const siteId = await getSiteId(host);

  const content = await getPageContent(slug, siteId);

  const domainConfig = getDomainConfig(host);
  const isCloaker = domainConfig?.role === 'CLOAKER';

  if (!content) {
    if (!isBot) {
      permanentRedirect('/');
    }

    const rawCityPart = slug.includes('/') ? slug.split('/').pop() : slug.split('-')[0];
    const cityFromName = rawCityPart || "istanbul";
    const cityName = toTitleCaseTR(cityFromName);
    const fallbackTitle = `${cityName} Escort Bayan | VIP Vitrin`;
    const fallbackParagraph = `${cityName} genelinde VIP model partnerler, elite escort hizmetleri ve kaporasız doğrudan elden ödemeli güvenilir buluşmalar. Telefon numaraları ve aktif WhatsApp hattı ile 7/24 randevu planlayın.`;

    const schema = generateUltraGraphSchema({
      locationName: cityName,
      city: "İstanbul",
      description: fallbackParagraph,
      url: `https://${host}/${slug}`,
      categoryTitle: "VIP ESCORT VİTRİNİ"
    });

    return (
      <div className="min-h-screen bg-black text-white antialiased selection:bg-rose-600/30">
        <link rel="amphtml" href={`https://${host}/amp?loc=${slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <Navbar />
        <main className="pt-32 pb-32">
          <div className="max-w-7xl mx-auto px-6">
            <Breadcrumbs items={[{ name: fallbackTitle, item: `/${slug}` }]} />
            
            <div className="mt-16 mb-16">
              <h1 className="text-5xl md:text-8xl font-black italic mb-12 text-rose-600 uppercase tracking-tighter leading-none">
                {fallbackTitle}
              </h1>
              <div className="h-px w-full bg-linear-to-r from-rose-600/50 via-zinc-800 to-transparent mb-12" />
              
              <div className="grid grid-cols-1 gap-12">
                  <div className="w-full prose prose-invert">
                      <p className="text-zinc-400 text-xl leading-relaxed">
                        {fallbackParagraph}
                      </p>
                  </div>
              </div>
  
              <div className="mt-24">
                  <div className="inline-flex items-center gap-4 bg-zinc-950/40 border border-rose-600/20 px-8 py-3 rounded-full mb-12">
                      <span className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-glow-pulse" />
                      <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">VİP VİTRİN</span>
                  </div>
                  <DorukVitrin host={host} />
              </div>
            </div>
  
            <IstanbulConquestMatrix />
          </div>
        </main>
        <UltraFooter host={host} cityName={turkishToUpper(cityName)} />
      </div>
    );
  }

  const rawCityPart = slug.includes('/') ? slug.split('/').pop() : slug.split('-')[0];
  const cityFromName = rawCityPart || "istanbul";
  const cityName = toTitleCaseTR(cityFromName);

  const schema = generateUltraGraphSchema({
    locationName: content.title || cityName,
    city: "İstanbul",
    description: content.content?.substring(0, 160).replace(/<[^>]*>?/gm, '').replace(/[-\u2013\u2014]/g, ' ') || "VIP escort hizmetleri.",
    url: `https://${host}/${slug}`,
    categoryTitle: "VIP ESCORT PORTALI"
  });

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-rose-600/30">
      <link rel="amphtml" href={`https://${host}/amp?loc=${slug}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Navbar />
      <main className="pt-32 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={[{ name: content.title || "İçerik", item: `/${slug}` }]} />
          
          <div className="mt-16 mb-16">
            <h1 className="text-5xl md:text-8xl font-black italic mb-12 text-rose-600 uppercase tracking-tighter leading-none">
              {(content.title || "").replace(/[-\u2013\u2014]/g, ' ')}
            </h1>
            <div className="h-px w-full bg-linear-to-r from-rose-600/50 via-zinc-800 to-transparent mb-12" />
            
            {/* 🤖 GLOBAL CONTENT ENGINE: VIDEOS & TEXT FOR ALL */}
            <div className="grid grid-cols-1 gap-12">
                {/* 🎥 VIDEO PLAYER SECTION (Priority for Users) */}
                <div className="w-full">
                    <SecureHTML html={content.content || ""} />
                </div>

                {/* 📝 SEO CONTENT (Lower priority for users, High for bots) */}
                <article className="prose prose-invert max-w-none 
                    prose-p:text-zinc-500 prose-p:text-xl prose-p:leading-relaxed 
                    prose-strong:text-rose-600 prose-headings:text-white mt-12">
                    {/* Botlar zaten yukarıdaki SecureHTML içindeki metni de görüyor */}
                </article>
            </div>

            <div className="mt-24">
                <div className="inline-flex items-center gap-4 bg-zinc-950/40 border border-rose-600/20 px-8 py-3 rounded-full mb-12">
                    <span className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-glow-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">VİP VİTRİN</span>
                </div>
                <DorukVitrin host={host} />
            </div>
          </div>

          <IstanbulConquestMatrix />
        </div>
      </main>
      <UltraFooter host={host} cityName="İSTANBUL" />
    </div>
  );
}
