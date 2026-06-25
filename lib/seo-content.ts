import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { getSiteId } from "@/lib/site-context";
import { generateGodModeOmniContent } from "./ai-seo";
import { notifyGoogleIndexing } from "./seo/indexing-api";
import { SocialBomber } from "./seo/social-bomber";
import { DRKCNAYSpintax } from "./spintax-engine";
import { SpintaxEngine } from "./seo/spintax-engine";
import { googleIndexing } from "./google-indexing";

interface GodModeParams {
  city: string;
  district?: string;
  neighborhood?: string;
  category?: string;
  host: string;
}

/**
 * 🧠 VIP Elite CONTENT GENERATOR v16.0 (GEMINI 3.1 PRO UPGRADE)
 * Generates unique, high-authority long-form content for any location or category.
 * Now utilizes the "Undetectable AI" engine to prevent Google algorithm flags.
 */
export async function generateGodModeContent({ city, district, neighborhood, category, host }: GodModeParams) {
  const siteId = await getSiteId(host);
  
  // Create a unique slug based on the full path
  let locationSlug = neighborhood 
    ? `${city}-${district}-${neighborhood}`.toLowerCase()
    : district 
      ? `${city}-${district}`.toLowerCase()
      : city.toLowerCase();
  
  if (category) {
    locationSlug += `-kategori-${category}`.toLowerCase();
  }
  
  locationSlug = locationSlug.replace(/\s+/g, '-');

  try {
    // 1. Check DB Cache (Try site-specific first, then global fallback)
    const cached = await prisma.pageContent.findFirst({
      where: { 
        slug: locationSlug,
        OR: [
          { siteId: siteId },
          { siteId: null }
        ]
      },
      orderBy: {
        siteId: 'desc' // Ensures site-specific (not null) comes first
      }
    });

    if (cached && cached.content && cached.content.length > 100) {
      const spintax = new DRKCNAYSpintax(host + "-" + locationSlug);
      const spunContent = spintax.resolve(cached.content);

      return {
        html: spunContent,
        faqs: [
          { q: `${city} ${neighborhood || district || ""} ${category || ""} VIP escort hizmetleri güvenilir mi?`, a: "DORUKCANAY ELITE güvencesiyle %100 gerçek fotoğraflı ve güvenilir escort hizmeti sunulmaktadır. Hemen şimdi WhatsApp üzerinden yerinizi ayırtın ve VIP deneyimi başlatın." }
        ]
      };
    }

    // 2. 🧠 HYPER-SCALE AI GENERATION (FULL CONTENT - NO FALLBACK)
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build' || process.env.IS_BUILDING === 'true';
    if (isBuilding) throw new Error("BUILD_SKIP_AI");

    console.log(`🧠 [VIP Elite] Generating FULL content for ${locationSlug}...`);
    const aiContent = await generateGodModeOmniContent({ city, district, neighborhood, category, host });
    
    if (!aiContent || !aiContent.wordpress || !aiContent.wordpress.content) {
      throw new Error("AI_GENERATION_EMPTY");
    }

    const finalHtml = aiContent.wordpress.content;
    const finalTitle = aiContent.wordpress.title;

    // 🚀 [HYDRA INDEXING] Nuclear Broadcast to Google, Bing, and Yandex
    const fullUrl = `https://${host}${locationSlug === 'home' ? '' : '/' + locationSlug}`;
    googleIndexing.broadcast(fullUrl).catch((e: any) => console.error("Indexing failed:", e));
    SocialBomber.blast(fullUrl, finalTitle).catch((e: any) => console.error("Social Blast failed:", e));

    // 3. Persist
    const existing = await prisma.pageContent.findFirst({ where: { slug: locationSlug, siteId } });
    if (existing) {
      await prisma.pageContent.update({ where: { id: existing.id }, data: { content: finalHtml, title: finalTitle, updatedAt: new Date() } });
    } else {
      await prisma.pageContent.create({ data: { siteId, slug: locationSlug, title: finalTitle, content: finalHtml } });
    }

    return {
      html: finalHtml,
      faqs: aiContent.wordpress.faqs || [
        { q: `${city} bölgesinde escort hizmetleri güvenilir mi?`, a: "DRKCNAY ELITE ile sistemdeki tüm escort profilleri %100 doğrulanmış ve gerçek görsellidir. Siz de premium bir seans için hemen şimdi bizimle iletişime geçin." }
      ]
    };

  } catch (error) {
    console.error("❌ [HYDRA] Content Generation Failed:", error);
    
    // 🛡️ [FALLBACK] Return a high-quality localized template generated dynamically via SpintaxEngine
    const fallbackHtml = SpintaxEngine.generateMonsterContent(neighborhood || district || city, host, category || "VIP Escort");
    let fallbackTitle = `${(neighborhood || district || city).toUpperCase()} VIP ESCORT | %100 GERÇEK VE GİZLİ`;

    if (host.includes('istanbulescort.blog')) {
      const locTitle = (neighborhood || district || city).toUpperCase();
      fallbackTitle = `🔥 ${locTitle} Escort Bayan | VIP Ateşli Eskort ❤️🔥`;
    }

    return {
      html: fallbackHtml,
      faqs: [
        { q: `${city} bölgesinde hizmetleriniz devam ediyor mu?`, a: "Evet, tüm bölgelerimizde 7/24 kesintisiz ve güvenilir hizmetimiz devam etmektedir. Ayrıcalıklı randevunuzu oluşturmak için şimdi bize yazın." }
      ]
    };
  }
}

