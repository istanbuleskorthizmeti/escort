import { prisma } from "./prisma";

/**
 * DRKCNAY ELITE CONTACT ENGINE v1.0
 * Centralized WhatsApp Management for VIP Elite Dominance.
 */

const CONTACT_SETTING_KEY = "global_whatsapp";
const SHORTLINK_SETTING_KEY = "global_shortlink";
const DEFAULT_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "905016355053";
const DEFAULT_SHORTLINK = process.env.NEXT_PUBLIC_SHORTLINK || "https://istanbulescort.blog/wa";

export interface ContactInfo {
  number: string;
  link: string;
  shortLink: string;
  formatted: string;
}

/**
 * Fetches the global contact details. 
 * VIP Elite FAIL-SAFE: If DB is down, uses ENV fallbacks.
 */
export async function getGlobalContact(): Promise<ContactInfo> {
  try {
    // Attempt DB fetch
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: { in: [CONTACT_SETTING_KEY, SHORTLINK_SETTING_KEY] }
      }
    });

    const number = settings.find((s: any) => s.key === CONTACT_SETTING_KEY)?.value || DEFAULT_WHATSAPP;
    const shortLink = settings.find((s: any) => s.key === SHORTLINK_SETTING_KEY)?.value || DEFAULT_SHORTLINK;
    
    return {
      number,
      shortLink,
      link: `https://wa.me/${number.replace(/\D/g, "")}`,
      formatted: `+${number.slice(0, 2)} (${number.slice(2, 5)}) ${number.slice(5, 8)} ${number.slice(8, 10)} ${number.slice(10, 12)}`,
    };
  } catch (error) {
    // DB Down Fallback
    console.warn("⚠️ Database unreachable for settings, using ENV fallbacks.");
    return {
      number: DEFAULT_WHATSAPP,
      shortLink: DEFAULT_SHORTLINK,
      link: `https://wa.me/${DEFAULT_WHATSAPP.replace(/\D/g, "")}`,
      formatted: `+${DEFAULT_WHATSAPP.slice(0, 2)} (${DEFAULT_WHATSAPP.slice(2, 5)}) ${DEFAULT_WHATSAPP.slice(5, 8)} ${DEFAULT_WHATSAPP.slice(8, 10)} ${DEFAULT_WHATSAPP.slice(10, 12)}`,
    };
  }
}

/**
 * Updates the global contact number.
 */
export async function updateGlobalContact(newNumber: string): Promise<void> {
  const cleanNumber = newNumber.replace(/\D/g, "");
  await prisma.systemSetting.upsert({
    where: { key: CONTACT_SETTING_KEY },
    update: { value: cleanNumber },
    create: { key: CONTACT_SETTING_KEY, value: cleanNumber },
  });
  console.log(`✅ Global contact updated to: ${cleanNumber}`);
}
