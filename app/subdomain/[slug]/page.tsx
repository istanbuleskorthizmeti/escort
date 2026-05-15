import React from 'react';
import { generateUltraContextualContent } from '@/lib/ai-seo';
import { LinkWheel } from '@/components/SEO/LinkWheel';
import { DorukVitrin } from '@/components/SEO/DorukVitrin';
import { siteConfig } from "@/config/site";
import { headers } from "next/headers";
import { generateUltraGraphSchema } from "@/lib/seo-schema";

// ⚡ DRKCNAY ELITE: DRKCNAY PORTAL 2026 ⚡
// This dynamically catches any subdomain and renders a high-conversion Elite portal.

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const location = slug ? slug.replace(/-/g, ' ').toUpperCase() : 'ISTANBUL';
  let host = "";
  try {
    const headersList = await headers();
    host = headersList.get("host") || "";
  } catch (e) {}

  const baseUrl = `https://${host}`;

  return {
    title: `💎 ${location} Escort Partner | DRKCNAY ELITE 2026`,
    description: `${location} bölgesinde kaporasız ve %100 gerçek escort rehberi. DRKCNAY ELITE ile güvenli ve gizli VIP deneyimi.`,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: `💎 ${location} Escort Partner | DRKCNAY ELITE 2026`,
      description: `${location} bölgesinde kaporasız ve %100 gerçek escort rehberi.`,
      url: baseUrl,
    }
  };
}

export default async function SubdomainPage({ params }: any) {
  const { slug } = await params;
  
  // Clean and format the subdomain string
  const location = slug ? slug.replace(/-/g, ' ').toUpperCase() : 'ISTANBUL';
  
  let host = "";
  try {
    const headersList = await headers();
    host = headersList.get("host") || "";
  } catch (e) {}

  // Generate on-the-fly content specific to this subdomain
  let aiContent: any;
  try {
    // 🔥 GOD-MODE PERFORMANCE: Limit API/DB call to 3.5 seconds to prevent 502/504 Gateway Timeouts
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 3500);

    // Assuming generateUltraContextualContent supports an abort signal or we wrap it in a timeout promise
    aiContent = await Promise.race([
      generateUltraContextualContent({
        city: 'Istanbul',
        district: location,
        category: 'VIP Escort',
        host: host
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_GOD_MODE')), 3500))
    ]);
    
    clearTimeout(timeoutId);
  } catch (error) {
    // 🔥 HIGH-QUALITY GOD MODE FALLBACK
    aiContent = {
      wordpress: {
        title: `🔥 İSTANBUL VİP ESCORT - DRKCNAY ELITE 2026 | ${location} VIP REHBERİ`,
        content: `
          <div class="fallback-god-mode">
            <h2 class="text-4xl font-black text-[#ff8600] mb-8 uppercase italic">${location} Escort & Sansürsüz Elite Rehber</h2>
            <p class="text-zinc-300 text-lg leading-loose mb-6">
              Türkiye'nin en seçkin bölgilerinde %100 doğrulanmış profiller ve gizlilik odaklı VIP deneyimi sunan <strong>DRKCNAY ELITE</strong> platformuna hoş geldiniz. 
              Şu anda yoğunluk sebebiyle sistemlerimiz en seçkin profilleri listelemektedir. VIP hizmetlerimiz kesintisiz devam etmektedir.
            </p>
            <p class="text-zinc-400 mb-8">
              Kaporasız, güvenilir ve tamamen elit escort arayanlar için en doğru adrestesiniz. Sansürsüz VIP deneyimi yaşamak için iletişim kanallarımızı kullanın. 
              DRKCNAY ELITE olarak ${location} bölgesindeki her bir randevuyu titizlikle planlıyor ve size unutulmaz bir akşam vaat ediyoruz.
            </p>
            <div class="p-10 border-2 border-[#ff8600] rounded-3xl bg-black text-center">
              <h3 class="text-2xl font-black text-white mb-6 uppercase">HEMEN BAĞLANIN</h3>
              <a href={siteConfig.contact.whatsappLink} className="text-3xl font-black text-[#ff8600] hover:underline">+${siteConfig.contact.whatsappNumber}</a>
            </div>
          </div>
        `
      },
      blogger: { title: "", content: "" },
      tumblr: { title: "", content: "" }
    };
  }

  const ultraSchema = generateUltraGraphSchema({
    locationName: `${location} Escort`,
    city: location,
    description: aiContent.wordpress.title || `${location} bölgesinde kaporasız ve %100 gerçek escort rehberi.`,
    url: `https://${slug}.${siteConfig.domain}`,
    categoryTitle: "VIP Escort & Elite Partner",
    telephone: siteConfig.contact.whatsappNumber
  });

  return (
    <main className="w-full bg-[#000000] text-white min-h-screen selection:bg-[#ff8600] selection:text-black">
      {/* ELITE HEADER: DRKCNAY ELITE AESTHETICS */}
      <header className="relative bg-black p-8 text-center border-b-[5px] border-[#FF0000] shadow-[0_0_50px_rgba(255,134,0,0.2)]">
        <h1 className="relative text-4xl md:text-7xl font-black text-[#ff8600] uppercase tracking-tighter italic drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
          {location} <span className="text-white">ESCORT PARTNER</span>
        </h1>
        <div className="relative mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-[#FF0000]"></div>
          <p className="text-white font-bold tracking-[0.2em] text-sm uppercase">
            DRKCNAY <span className="text-[#ff8600]">ELITE NETWORK</span> 2026
          </p>
          <div className="h-px w-8 bg-[#FF0000]"></div>
        </div>
      </header>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ultraSchema) }}
      />

      {/* DORUK VITRIN: THE SHOWCASE */}
      <div className="my-0 w-full max-w-[1200px] mx-auto bg-black">
        <DorukVitrin city={location} />
      </div>

      <article className="max-w-5xl mx-auto p-6 md:p-12 mt-4 bg-zinc-950/50 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-900/50">
        <h2 className="text-3xl md:text-4xl font-black text-[#ff8600] mb-8 border-b border-[#FF0000] pb-6 tracking-tight uppercase">
          {aiContent.wordpress.title}
        </h2>
        
        {(() => {
          let finalContent = aiContent.wordpress.content;
          // 🛡️ [GOD-MODE SAFETY] If content is a corrupted JSON string, extract the HTML part
          if (typeof finalContent === 'string' && finalContent.trim().startsWith('{')) {
            try {
              const parsed = JSON.parse(finalContent);
              finalContent = parsed.content || finalContent;
            } catch (e) {
              // Not JSON or parse error, keep original
            }
          }
          return (
            <div 
              className="prose prose-invert max-w-none prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:text-lg prose-h3:text-[#ff8600] prose-h4:text-zinc-100 prose-strong:text-white"
              dangerouslySetInnerHTML={{ __html: finalContent }}
            />
          );
        })()}
        
        {/* PREMIUM CTA */}
        <div className="mt-16 p-10 bg-gradient-to-br from-zinc-900 to-black rounded-3xl border-2 border-[#FF0000] text-center relative overflow-hidden group">
          <h3 className="text-3xl font-black text-[#ff8600] uppercase mb-6 tracking-tighter">VİP REZERVASYON</h3>
          <p className="text-zinc-400 mb-10 text-lg max-w-2xl mx-auto italic">
            "Sıradanlığın ötesinde, DRKCNAY Elite kalitesiyle en lüks deneyim için kapora ödemeden ulaşın."
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <a href={siteConfig.contact.whatsappLink} className="bg-[#ff8600] hover:bg-orange-400 text-black font-black py-5 px-12 rounded-xl transition-all shadow-[0_0_30px_rgba(255,134,0,0.4)] hover:scale-105 uppercase tracking-widest">
              TELEGRAM KANALI
            </a>
            <a href={siteConfig.contact.whatsappLink} className="bg-white hover:bg-zinc-200 text-black font-black py-5 px-12 rounded-xl transition-all hover:scale-105 uppercase tracking-widest">
              HEMEN ARA
            </a>
          </div>
        </div>
      </article>

      {/* ELITE FOOTER */}
      <footer className="mt-12 bg-black border-t-[5px] border-[#FF0000] py-12 relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <LinkWheel currentHost={slug + `.${siteConfig.domain}`} />
          <div className="text-center mt-12 text-[#ff8600] text-[12px] font-black uppercase tracking-[0.5em]">
            🔥 DRKCNAY ELITE NETWORK &copy; 2026 🔥
          </div>
        </div>
      </footer>
    </main>
  );
}
