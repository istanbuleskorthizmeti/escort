/**
 * ⚡ DRKCNAY ELITE: CUSTOM SHORTLINK ENGINE (GOD MODE v3.0)
 * Replaces Bitly with a self-hosted, DB-driven redirector.
 * Protects main domains from 3rd party PBN spam flags.
 */

import { prisma } from '../prisma';

export interface ShortenParams {
  longUrl: string;
  title?: string;
  tags?: string[];
}

function generateShortId(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Creates a custom ShortLink in the database.
 * Returns the short URL pointing to the "Clean Domain" redirector.
 */
export async function shortenUrl(longUrlOrParams: string | ShortenParams): Promise<string> {
  const params: ShortenParams = typeof longUrlOrParams === 'string' 
    ? { longUrl: longUrlOrParams } 
    : longUrlOrParams;

  const redirectorDomain = process.env.SHORTENER_DOMAIN || 'https://vipescorthizmeti.com';
  
  try {
    const id = generateShortId();
    
    await prisma.shortLink.create({
      data: {
        id,
        targetUrl: params.longUrl,
      }
    });

    console.log(`✅ [SHORTENER] Custom Link Created: ${redirectorDomain}/go/${id} -> ${params.longUrl}`);
    return `${redirectorDomain}/go/${id}`;
    
  } catch (error) {
    console.error("🔥 [SHORTENER] Core Engine Error. Falling back to original URL:", error);
    return params.longUrl;
  }
}
