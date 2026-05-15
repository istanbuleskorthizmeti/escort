import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { getSiteId } from "@/lib/site-context";
import { generateGodModeOmniContent } from "./ai-seo";
import { notifyGoogleIndexing } from "./seo/indexing-api";
import { SocialBomber } from "./seo/social-bomber";

interface GodModeParams {
  city: string;
  district?: string;
  neighborhood?: string;
  category?: string;
  host: string;
}

/**
 * 🧠 GOD MODE CONTENT GENERATOR v16.0 (GEMINI 3.1 PRO UPGRADE)
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
      return {
        html: cached.content,
        faqs: [
          { q: `${city} ${neighborhood || district || ""} ${category || ""} VIP escort hizmetleri güvenilir mi?`, a: "DORUKCANAY ELITE güvencesiyle %100 gerçek fotoğraflı ve güvenilir escort hizmeti sunulmaktadır." }
        ]
      };
    }

    // 2. 🧠 HYPER-SCALE AI GENERATION (FULL CONTENT - NO FALLBACK)
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build' || process.env.IS_BUILDING === 'true';
    if (isBuilding) throw new Error("BUILD_SKIP_AI");

    console.log(`🧠 [GOD MODE] Generating FULL content for ${locationSlug}...`);
    const aiContent = await generateGodModeOmniContent({ city, district, neighborhood, category, host });
    
    if (!aiContent || !aiContent.wordpress || !aiContent.wordpress.content) {
      throw new Error("AI_GENERATION_EMPTY");
    }

    const finalHtml = aiContent.wordpress.content;
    const finalTitle = aiContent.wordpress.title;

    // 🚀 [HYDRA INDEXING] Nuclear Broadcast to Google, Bing, and Yandex
    const fullUrl = `https://${host}${locationSlug === 'home' ? '' : '/' + locationSlug}`;
    const { googleIndexing } = require("./google-indexing");
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
        { q: `${city} bölgesinde escort hizmetleri güvenilir mi?`, a: "DRKCNAY ELITE ile sistemdeki tüm escort profilleri %100 doğrulanmış ve gerçek görsellidir." }
      ]
    };

  } catch (error) {
    console.error("❌ [HYDRA] Content Generation Failed:", error);
    
    // 🛡️ [FALLBACK] Return a high-quality localized template instead of throwing 500
    const fallbackTitle = `${(neighborhood || district || city).toUpperCase()} VIP ESCORT | %100 GERÇEK VE GİZLİ`;
    const fallbackHtml = `
      <div class="seo-fallback">
        <p>${city} ${district || ""} ${neighborhood || ""} bölgesinde elit ve profesyonel escort hizmetleri için en doğru adrestesiniz. DORUKCANAY ELITE güvencesiyle kaporasız ve gerçek profillerle tanışın.</p>
        <ul>
          <li>%100 Gerçek ve Güncel Fotoğraflar</li>
          <li>Kaporasız Güvenilir Randevu Sistemi</li>
          <li>Gizlilik ve Hijyen Garantili Hizmet</li>
        </ul>
      </div>
    `;

    return {
      html: fallbackHtml,
      faqs: [
        { q: `${city} bölgesinde hizmetleriniz devam ediyor mu?`, a: "Evet, tüm bölgelerimizde 7/24 kesintisiz ve güvenilir hizmetimiz devam etmektedir." }
      ]
    };
  }
}

