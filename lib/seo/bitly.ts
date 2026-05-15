/**
 * DRKCNAY ELITE: BITLY LINK ENGINE (VIP Elite v3.0)
 * High-performance URL shortening with Token Rotation, is.gd & clck.ru fallbacks.
 * Zero-Footprint Architecture.
 */

import { ProxyHandler } from "./proxy-handler";

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
}

// Global state for token rotation
let activeTokenIndex = 0;
let exhaustedTokens = new Set<string>();

/**
 * Creates a stealth redirect link.
 * Tiers: Bitly (Token Rotation) -> is.gd -> clck.ru -> Raw URL.
 */
export async function shortenUrl(longUrlOrParams: string | ShortenParams): Promise<string> {
  const params: ShortenParams = typeof longUrlOrParams === 'string' 
    ? { longUrl: longUrlOrParams } 
    : longUrlOrParams;

  const rawTokens = process.env.BITLY_ACCESS_TOKEN || "";
  const tokens = rawTokens.split(',').map(t => t.trim()).filter(t => t.length > 0);

  // 1. Bitly (Tier 1) - Token Rotation
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
        const response = await ProxyHandler.proxyFetch(BITLY_BITLINKS_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            long_url: params.longUrl,
            title: params.title || "DRKCNAY Elite Redirect",
            domain: "bit.ly",
          }),
        });

        if (response.ok) {
          const data = await response.json() as BitlyLinkResponse;
          
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

          console.log(`✅ [BITLY] Premium Link Created: ${data.link}`);
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

  // 2. Fallback: IS.GD (Tier 2) - No Auth, Generous Limits
  console.log(`🛡️ [CLOAK] Falling back to is.gd for: ${params.longUrl.substring(0, 30)}...`);
  try {
    const isgdUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(params.longUrl)}`;
    const response = await ProxyHandler.proxyFetch(isgdUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data.shorturl) {
        console.log(`✅ [IS.GD] Link Created: ${data.shorturl}`);
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
