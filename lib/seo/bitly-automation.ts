import { shortenUrl } from "./bitly";
import { prisma } from "../prisma";

/**
 * DRKCNAY SEO: BITLY AUTOMATION ENGINE
 * Generates and stores short links for all priority SEO endpoints.
 */

export async function getOrGenerateShortLink(slug: string, longUrl?: string) {
  if (!longUrl) return slug; // Fallback if no target is provided
  const settingKey = `shortlink_${slug.replace(/\//g, '_')}`;
  
  try {
    // 1. Check if we already have it in DB
    const existing = await prisma.systemSetting.findUnique({
      where: { key: settingKey }
    });

    if (existing) return existing.value;

    // 2. DRKCNAY Cloak Engine (Replaces TinyURL/Bitly to keep traffic internal)
    console.log(`📡 [SEO ROULETTE] Generating DRKCNAY Cloak Link for: ${slug}`);
    
    // Create a 6-character random hash
    const randomHash = Math.random().toString(36).substring(2, 8);
    const shortLink = `https://vipescorthizmeti.com/go/${randomHash}`;
    
    // Store the mapping: `cloak_hash` -> longUrl
    await prisma.systemSetting.create({
      data: {
        key: `cloak_${randomHash}`,
        value: longUrl
      }
    });

    // Store the original setting so we don't regenerate for this slug
    await prisma.systemSetting.create({
      data: {
        key: settingKey,
        value: shortLink
      }
    });

    return shortLink;
  } catch (error) {
    console.error(`❌ [SEO] DRKCNAY Cloak Error for ${slug}:`, error);
    return longUrl;
  }
}
