
import { prisma } from "@/lib/prisma";
import { getSiteId } from "@/lib/site-context";
import { siteConfig } from "@/config/site";
import { headers } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import Navbar from "@/components/UI/Navbar";
import { UltraFooter } from "@/components/SEO/UltraFooter";
import { SecureHTML } from "@/components/SecureHTML";
import { Metadata } from "next";
import { IstanbulConquestMatrix } from "@/components/SEO/IstanbulConquestMatrix";
import { DorukVitrin } from "@/components/SEO/DorukVitrin";
import Breadcrumbs from "@/components/UI/Breadcrumbs";
import { dedupeEscort } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug: slugArr } = await params;
  const slug = slugArr.join('/');
  const host = (await headers()).get("host") || siteConfig.domain;
  const siteId = await getSiteId(host);

  const content = await prisma.pageContent.findFirst({
    where: { slug, siteId }
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
  const siteId = await getSiteId(host);

  const content = await prisma.pageContent.findFirst({
    where: { slug, siteId }
  });

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
          
          <div className="mt-16 mb-24">
            <h1 className="text-5xl md:text-8xl font-black italic mb-12 text-rose-600 uppercase tracking-tighter leading-none">
              {(content.title || "").replace(/[-\u2013\u2014]/g, ' ')}
            </h1>
            <div className="h-px w-full bg-linear-to-r from-rose-600/50 via-zinc-800 to-transparent mb-12" />
            
            <article className="prose prose-invert max-w-none 
              prose-p:text-zinc-500 prose-p:text-2xl prose-p:leading-relaxed prose-p:italic prose-p:font-medium
              prose-strong:text-rose-600 prose-headings:text-white prose-headings:font-black prose-headings:italic">
               <SecureHTML html={content.content || ""} />
            </article>
          </div>

          <div className="my-32">
             <div className="inline-flex items-center gap-4 bg-zinc-950/40 border border-rose-600/20 px-8 py-3 rounded-full mb-12">
                <span className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-glow-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">VİP VİTRİN</span>
             </div>
             <DorukVitrin />
          </div>

          <IstanbulConquestMatrix />
        </div>
      </main>
      <UltraFooter host={host} />
    </div>
  );
}
