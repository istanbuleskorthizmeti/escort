/**
 * DRKCNAY ELITE: TINYURL LINK ENGINE (GOD MODE v2.0)
 * High-performance URL shortening using TinyURL API (DR 93).
 */

import { ProxyHandler } from "./proxy-handler";

const TINYURL_API_URL = "https://api.tinyurl.com/create";

export interface TinyUrlResponse {
  data: {
    domain: string;
    alias: string;
    deleted: boolean;
    archived: boolean;
    analytics: {
      enabled: boolean;
      public: boolean;
    };
    tags: string[];
    created_at: string;
    expires_at: string;
    tiny_url: string;
    url: string;
  };
  code: number;
  errors: any[];
}

export interface ShortenParams {
  longUrl: string;
  tags?: string[];
  alias?: string;
}

/**
 * Creates a TinyURL link.
 * Fail-safe: Returns original URL on error.
 */
export async function shortenWithTinyUrl(params: ShortenParams): Promise<string> {
  const token = process.env.TINYURL_API_TOKEN;

  if (!token) {
    console.warn("⚠️ [TINYURL] ACCESS_TOKEN missing, using fallback.");
    return params.longUrl;
  }

  try {
    const payload: any = {
      url: params.longUrl,
      domain: "tinyurl.com"
    };

    if (params.alias) payload.alias = params.alias;
    // Removed tags injection because TinyUrl API forbids it on this token tier.

    let response = await fetch(TINYURL_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify(payload),
    });

    // Fallback: If alias is taken or forbidden (422), try again without alias
    if (response.status === 422 && payload.alias) {
      console.warn(`⏳ [TINYURL] Custom Alias rejected/taken (${payload.alias}). Retrying with standard random link...`);
      delete payload.alias;
      response = await fetch(TINYURL_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "accept": "application/json"
        },
        body: JSON.stringify(payload),
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      if (response.status === 429) {
        console.warn(`⏳ [TINYURL] Rate Limit Reached! Suspend protection active. Gracefully falling back to raw URL.`);
      } else {
        console.error(`❌ [TINYURL] Creation Error [${response.status}]:`, JSON.stringify(errorData));
      }
      return params.longUrl;
    }

    const data = await response.json() as TinyUrlResponse;

    console.log(`✅ [TINYURL] Premium Link Created: ${data.data.tiny_url}`);
    return data.data.tiny_url;
  } catch (error) {
    console.error("🔥 [TINYURL] Core Engine Error:", error);
    return params.longUrl;
  }
}
