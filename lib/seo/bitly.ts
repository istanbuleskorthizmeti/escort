/**
 * DRKCNAY ELITE: BITLY LINK ENGINE (VIP Elite v4.0 - Black Hat SEO Edition)
 * High-performance URL shortening with Token Rotation, Custom SEO-Optimized Slugs,
 * PostgreSQL Database persistence, is.gd & clck.ru fallbacks.
 */

import { ProxyHandler } from "./proxy-handler";
import { prisma } from "../prisma";

const BITLY_BITLINKS_URL = "https://api-ssl.bitly.com/v4/bitlinks";

interface BitlyLinkResponse {
  link: string;
  id: string;
  long_url: string;
  title?: string;
  tags?: string[];
}

interface ShortenParams {
  longUrl: string;
  title?: string;
  tags?: string[];
  keyword?: string; // Optional custom SEO slug
}

// Global state for token rotation
let activeTokenIndex = 0;
let exhaustedTokens = new Set<string>();

/**
 * Creates an ultra SEO-optimized stealth redirect link.
 * Automatically injects "escort" and location niches in slugs for maximum SERP dominance.
 */
export async function shortenUrl(longUrlOrParams: string | ShortenParams): Promise<string> {
  const params: ShortenParams = typeof longUrlOrParams === 'string' 
    ? { longUrl: longUrlOrParams } 
    : longUrlOrParams;

  // 🔍 [DB LOOKUP OPTIMIZATION] Aynı hedef URL için zaten bit.ly linki var mı kontrol et!
  try {
    const existing = await prisma.shortLink.findFirst({
      where: { targetUrl: params.longUrl }
    });
    if (existing && existing.id.includes('bit.ly')) {
      console.log(`🎯 [DB CACHE HIT] Mevcut bit.ly linki yeniden kullanılıyor: ${existing.id} -> ${params.longUrl}`);
      return existing.id;
    }
  } catch (dbErr: any) {
    console.warn(`⚠️ [PRISMA] Önbellek kontrolü başarısız oldu:`, dbErr.message);
  }

  // 🎯 DYNAMIC SEO SLUG GENERATOR (Black Hat Semantic Anchor)
  let seoSlug = "";
  if (params.keyword) {
    seoSlug = params.keyword.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  } else if (params.title && (params.title.includes('Infiltration') || params.title.includes('VIP'))) {
    // E.g. "Şişli VIP Infiltration" -> "sisli-vip-escort-2026"
    const zone = params.title.split(' ')[0].toLowerCase()
      .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
      .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
    seoSlug = `${zone}-vip-escort-2026`;
  } else {
    // General high-intent escort keyword fallbacks
    const niches = ["vip-escort", "rus-escort", "kaporasiz-escort", "universiteli-escort"];
    const randomNiche = niches[Math.floor(Math.random() * niches.length)];
    seoSlug = `istanbul-${randomNiche}-${Math.floor(Math.random() * 1000 + 100)}`;
  }

  const rawTokens = process.env.BITLY_ACCESS_TOKEN || "";
  const tokens = rawTokens.split(',').map(t => t.trim()).filter(t => t.length > 0);

  // 1. Bitly (Tier 1) - Token Rotation with Custom SEO Back-Half
  if (tokens.length > 0) {
    let currentToken = tokens[activeTokenIndex % tokens.length];
    
    // Cycle through tokens if the current one is exhausted
    let attempts = 0;
    while (exhaustedTokens.has(currentToken) && attempts < tokens.length) {
        activeTokenIndex++;
        currentToken = tokens[activeTokenIndex % tokens.length];
        attempts++;
    }

    if (!exhaustedTokens.has(currentToken)) {
      try {
        console.log(`🔗 [BITLY] Creating base short URL for: ${params.longUrl.substring(0, 30)}...`);
        const response = await ProxyHandler.proxyFetch(BITLY_BITLINKS_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            long_url: params.longUrl,
            title: params.title || "Vip Escort Hizmeti SEO Link",
            domain: "bit.ly",
          }),
        });

        if (response.ok) {
          const data = await response.json() as BitlyLinkResponse;
          
          // Apply tags if specified
          if (params.tags && params.tags.length > 0) {
            await ProxyHandler.proxyFetch(`${BITLY_BITLINKS_URL}/${data.id}`, {
              method: "PATCH",
              headers: {
                "Authorization": `Bearer ${currentToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ tags: params.tags }),
            }).catch(() => {});
          }

          // 💎 Apply Branded SEO Custom Back-Half Slug (Premium Endpoint)
          console.log(`🏴‍☠️ [BLACK-HAT-SEO] Registering custom SEO slug: bit.ly/${seoSlug}`);
          const customRes = await ProxyHandler.proxyFetch("https://api-ssl.bitly.com/v4/custom_bitlinks", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${currentToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bitlink: data.id,
              custom_link: `bit.ly/${seoSlug}`
            })
          });

          if (customRes.ok) {
            console.log(`🔥 [SEO SUCCESS] Dynamic SEO Branded Bitlink Registered: https://bit.ly/${seoSlug}`);
            data.link = `https://bit.ly/${seoSlug}`;
          } else {
            // If custom slug is already taken, try adding a random suffix to make it unique while keeping the escort niche!
            const retrySlug = `${seoSlug}-${Math.floor(Math.random() * 90 + 10)}`;
            console.log(`⚠️ [SLUG TAKEN] Retrying with unique niche: bit.ly/${retrySlug}`);
            const retryRes = await ProxyHandler.proxyFetch("https://api-ssl.bitly.com/v4/custom_bitlinks", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${currentToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                bitlink: data.id,
                custom_link: `bit.ly/${retrySlug}`
              })
            });

            if (retryRes.ok) {
              console.log(`🔥 [SEO SUCCESS] Unique SEO Branded Bitlink Registered: https://bit.ly/${retrySlug}`);
              data.link = `https://bit.ly/${retrySlug}`;
            } else {
              console.log(`ℹ️ [SLUG FALLBACK] Reverting to generic high-trust Bitlink: ${data.link}`);
            }
          }

          // 💾 Save to Postgres Database
          await prisma.shortLink.upsert({
            where: { id: data.link },
            update: { targetUrl: params.longUrl },
            create: { id: data.link, targetUrl: params.longUrl }
          }).catch((e: any) => console.warn(`⚠️ [PRISMA] ShortLink Bitly save failed:`, e.message));

          return data.link;
        } else {
          let errorData;
          try { errorData = await response.json(); } catch (e) { errorData = { message: response.statusText }; }
          
          if (response.status === 429 || (errorData.message && errorData.message.includes('MONTHLY_ENCODE_LIMIT_REACHED')) || (errorData.description && errorData.description.includes('MONTHLY_ENCODE_LIMIT_REACHED')) || (errorData.description && errorData.description.includes('monthly quota'))) {
            console.warn(`⏳ [BITLY] Token Exhausted: ${currentToken.substring(0,6)}... Marking as dead.`);
            exhaustedTokens.add(currentToken);
            activeTokenIndex++; // Move to next for next request
          } else {
            console.error(`❌ [BITLY] Creation Error [${response.status}]`);
          }
        }
      } catch (error: any) {
        console.error("🔥 [BITLY] Core Engine Error, moving to fallback...", error.message);
      }
    }
  }

  // 2. Fallback: IS.GD (Tier 2) - No Auth, Generous Limits with Dynamic Custom SEO Slug
  console.log(`🛡️ [CLOAK] Falling back to is.gd with custom SEO keyword: ${seoSlug}`);
  try {
    const isgdUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(params.longUrl)}&shorturl=${encodeURIComponent(seoSlug)}`;
    const response = await ProxyHandler.proxyFetch(isgdUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data.shorturl) {
        console.log(`✅ [IS.GD] Branded Link Created: ${data.shorturl}`);
        
        await prisma.shortLink.upsert({
          where: { id: data.shorturl },
          update: { targetUrl: params.longUrl },
          create: { id: data.shorturl, targetUrl: params.longUrl }
        }).catch((e: any) => console.warn(`⚠️ [PRISMA] ShortLink is.gd save failed:`, e.message));

        return data.shorturl;
      }
    }
  } catch (err: any) {
    console.warn(`⚠️ [IS.GD] Failed:`, err.message);
  }

  // 3. Fallback: CLCK.RU (Tier 3) - No Auth, Russian Stealth
  console.log(`🥷 [CLOAK] Falling back to clck.ru...`);
  try {
    const clckUrl = `https://clck.ru/--?url=${encodeURIComponent(params.longUrl)}`;
    const response = await ProxyHandler.proxyFetch(clckUrl, { method: 'POST' });
    if (response.ok) {
      const text = await response.text();
      if (text && text.includes('clck.ru')) {
         console.log(`✅ [CLCK.RU] Link Created: ${text}`);
         
         await prisma.shortLink.upsert({
           where: { id: text },
           update: { targetUrl: params.longUrl },
           create: { id: text, targetUrl: params.longUrl }
         }).catch((e: any) => console.warn(`⚠️ [PRISMA] ShortLink clck.ru save failed:`, e.message));

         return text;
      }
    }
  } catch (err: any) {
    console.warn(`⚠️ [CLCK.RU] Failed:`, err.message);
  }

  // 4. Ultimate Fallback (Raw URL)
  console.warn(`🚨 [CLOAK] ALL ENGINES EXHAUSTED. Yielding RAW URL.`);
  return params.longUrl;
}
