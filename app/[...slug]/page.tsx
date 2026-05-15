import { prisma } from "@/lib/prisma";
import { getSiteId } from "@/lib/site-context";
import { siteConfig } from "@/config/site";
import { notFound, permanentRedirect } from "next/navigation";
import { headers } from "next/headers";
import dynamic from "next/dynamic";
import { getDomainConfig } from "@/config/domains";
import Navbar from "@/components/UI/Navbar";
import { UltraFooter } from "@/components/SEO/UltraFooter";
import { SecureHTML } from "@/components/SecureHTML";
import { Metadata } from "next";
import { IstanbulConquestMatrix } from "@/components/SEO/IstanbulConquestMatrix";
import Breadcrumbs from "@/components/UI/Breadcrumbs";
import { dedupeEscort } from "@/lib/utils";

import { DorukVitrin } from "@/components/SEO/DorukVitrin";
import { MathematicalSEO } from "@/components/SEO/MathematicalSEO";
import { SEOContentEngine } from "@/components/SEO/SEOContentEngine";
import { GlobalTagCloud } from "@/components/SEO/GlobalTagCloud";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug: slugArr } = await params;
  const slug = slugArr.join('/');
  const host = (await headers()).get("host") || siteConfig.domain;
  const siteId = await getSiteId(host);

  const content = await prisma.pageContent.findFirst({
    where: { slug, siteId },
    select: { title: true, content: true }
  });

  if (!content) return { title: "🔞 ESCORT AJANSI | DRKCNAY ELITE" };

  return {
    title: dedupeEscort(`🔥 ${(content.title || "Elite Escort").replace(/[-\u2013\u2014]/g, ' ')} | %100 GERÇEK VİTRİN`),
    description: dedupeEscort(content.content?.substring(0, 160).replace(/<[^>]*>?/gm, '').replace(/[-\u2013\u2014]/g, ' ') || "Profesyonel escort hizmetleri ve gerçek vitrin."),
  };
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugArr } = await params;
  const slug = slugArr.join('/');
  const host = (await headers()).get("host") || siteConfig.domain;
  const userAgent = (await headers()).get("user-agent") || "";
  const isBot = /googlebot|bingbot|yandexbot|ahrefsbot|msnbot|linkedinbot|exabot|compspybot|yesupbot|paperlibot|tweetmemebot|excelbot|w3c_validator|netcraftsurveyagent|seomoz|alexa|twitterbot/i.test(userAgent);
  const siteId = await getSiteId(host);

  const content = await prisma.pageContent.findFirst({
    where: { slug, siteId },
    select: { title: true, content: true }
  });

  const domainConfig = getDomainConfig(host);
  const isCloaker = domainConfig?.role === 'CLOAKER';

  if (!content) {
    // 🐺 WOLF MODE: If no content found, redirect to home to recover juice
    permanentRedirect("/");
  }

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <main className="pt-32 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={[{ name: content.title || "İçerik", item: `/${slug}` }]} />
          
          <div className="mt-16 mb-16">
            <h1 className="text-5xl md:text-8xl font-black italic mb-12 text-rose-600 uppercase tracking-tighter leading-none">
              {(content.title || "").replace(/[-\u2013\u2014]/g, ' ')}
            </h1>
            <div className="h-px w-full bg-linear-to-r from-rose-600/50 via-zinc-800 to-transparent mb-12" />
            
            {/* 🤖 CLOAKING ENGINE: BOT VS USER VIEW */}
            {isBot ? (
              <article className="prose prose-invert max-w-none 
                prose-p:text-zinc-500 prose-p:text-xl prose-p:leading-relaxed 
                prose-strong:text-rose-600 prose-headings:text-white">
                 <SecureHTML html={content.content || ""} />
              </article>
            ) : (
              <div className="mb-24">
                 {isCloaker ? (
                   <div className="bg-red-950/40 border border-red-600/30 p-12 rounded-[3rem] text-center shadow-[0_0_50px_rgba(220,38,38,0.1)]">
                      <h3 className="text-3xl font-black uppercase text-white tracking-tighter mb-4 italic">VİDEOYU SANSÜRSÜZ İZLE</h3>
                      <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                         Bu içeriğe tam erişim sağlamak ve VIP onaylı ağa katılmak için yaşınızı doğrulamanız gerekmektedir.
                      </p>
                      <a href="https://vipescorthizmeti.com" className="inline-block bg-red-600 text-white font-black px-10 py-4 rounded-full uppercase tracking-widest hover:bg-white hover:text-red-600 transition-colors">
                         18+ DOĞRULAMAYI GEÇ →
                      </a>
                   </div>
                 ) : (
                   <>
                     <div className="inline-flex items-center gap-4 bg-zinc-950/40 border border-rose-600/20 px-8 py-3 rounded-full mb-12">
                        <span className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-glow-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">VİP VİTRİN</span>
                     </div>
                     <DorukVitrin host={host} />
                   </>
                 )}
              </div>
            )}
          </div>

          <IstanbulConquestMatrix />
        </div>
      </main>
      <UltraFooter host={host} cityName="İstanbul" />
    </div>
  );
}
