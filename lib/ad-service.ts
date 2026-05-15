import { prisma } from './prisma';
import { generateLocalPersonas } from './persona-engine';


/**
 * HYBRID PROFILE SERVICE
 * Merges real paid advertisements with procedural personas.
 */

export async function getHybridProfiles({
  city,
  district,
  neighborhood,
  category,
  limit = 8
}: {
  city: string;
  district?: string;
  neighborhood?: string;
  category?: string;
  limit?: number;
}) {
  try {
    // 1. Fetch Real Ads from Database
    const ads = await prisma.adProfile.findMany({
        where: {
          isActive: true,
          OR: [
            { citySlugs: { has: city } },
            { districtSlugs: { has: district || "" } }
          ],
          AND: [
            { OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }] }
          ]
        },
      orderBy: { tier: 'desc' }, // Higher tiers first
      take: limit
    });

    // 2. Map Database ads to Persona format
    const realProfiles = ads.map((ad: any) => ({
      id: ad.id,
      name: ad.name,
      age: ad.age,
      height: "1.70", // Default or add to schema if needed
      weight: "52",   // Default or add to schema if needed
      tier: ad.tier as any,
      features: ad.features,
      adultBoundaries: {
        included: ["Lüks Eşlik", "VIP Hizmet", "Gizli Randevu"],
        excluded: ["Korunmasız İlişki"]
      },
      image: ad.image || "https://vipescorthizmeti.com/images/profiles/vip-1.webp",
      phone: ad.phone,
      isAd: true
    }));

    // 3. Populate missing slots with procedural personas
    const remainingCount = Math.max(0, limit - realProfiles.length);
    if (remainingCount > 0) {
      const seed = neighborhood ? `${city}-${district}-${neighborhood}` : (district ? `${city}-${district}` : city);
      const catSeed = category ? `-${category}` : "";
      const proceduralProfiles = generateLocalPersonas(seed + catSeed, remainingCount);
      return [...realProfiles, ...proceduralProfiles];
    }

    return realProfiles;
  } catch (error) {
    console.error("🚨 Hybrid Profile Service Error (Resilience Fallback Activated):", error);
    
    // GUARANTEED FALLBACK: Never return 5xx to the user
    // We use the most specific location available for the fallback generator
    const fallbackSeed = neighborhood || district || city;
    return generateLocalPersonas(fallbackSeed, limit);
  }
}
