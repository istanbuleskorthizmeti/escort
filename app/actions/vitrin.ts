"use server";

import { prisma } from "@/lib/prisma";

export async function getActiveProfiles() {
  try {
    const profiles = await prisma.adProfile.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    
    return profiles.map((p: { name: string; age: number; image?: string | null; phone?: string | null; tier?: string | null }) => ({
      title: p.name,
      src: p.image || "",
      phone: p.phone,
      niche: p.tier || "VIP Model",
      age: p.age
    }));
  } catch (error) {
    console.error("Error fetching vitrin profiles:", error);
    return [];
  }
}
