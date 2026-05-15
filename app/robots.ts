import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

/**
 * 🛡️ NUCLEAR ROBOTS.TXT GENERATOR
 * Applies a strict blocking policy to all satellite domains simultaneously.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get("host") || "vipescorthizmeti.com";

  return {
    rules: [
      {
        userAgent: [
          'AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'Rogerbot', 'Exabot', 'DeepCrawl', 'SeznamBot'
        ],
        disallow: '/',
      },
      {
        userAgent: [
          'GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot', 'PerplexityBot', 'anthropic-ai', 'Claude-Web'
        ],
        allow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/_next/',
          '/api/',
          '/admin/',
          '/wp-admin/',
          '/wp-content/',
          '/wp-includes/',
          '/wp-xml/',
          '/*.php',
          '/*.sql',
          '/*.env',
          '/*.json',
          '/*.config',
          '/aaabbbccc',
          '/kikikoko',
          '/.rbenv-version',
          '/.env-example',
        ],
      }
    ],
    sitemap: `https://${host}/sitemap.xml`,
  };
}
