"use server";

import { prisma } from "@/lib/prisma";
import NodeCache from "node-cache";

// Initialize local cache with a default TTL of 3600 seconds (1 hour)
const vitrinCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
const CACHE_KEY = "vitrin_active_profiles";

export async function getActiveProfiles() {
  // Check memory cache first
  const cachedProfiles = vitrinCache.get(CACHE_KEY);
  if (cachedProfiles) {
    return cachedProfiles as any[];
  }

  try {
    const profiles = await prisma.adProfile.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    
    const mapped = profiles.map((p: { name: string; age: number; image?: string | null; phone?: string | null; tier?: string | null }) => ({
      title: p.name,
      src: p.image || "",
      phone: p.phone,
      niche: p.tier || "VIP Model",
      age: p.age
    }));

    // Cache the mapped result
    vitrinCache.set(CACHE_KEY, mapped);
    return mapped;
  } catch (error) {
    console.error("Error fetching vitrin profiles:", error);
    return [];
  }
}

