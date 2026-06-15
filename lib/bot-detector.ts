/**
 * 🕵️ DRKCNAY BOT DETECTOR
 * Identifies search engine crawlers for Cloaking & Hacklink operations.
 */

export function isSearchEngineBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  
  // Broad and secure bot detection matching modern search engines, social crawlers, and inspection tools
  return /bot|crawler|spider|robot|lighthouse|google|yandex|bing|baidu|slurp|ia_archiver|facebookexternalhit|twitterbot/i.test(ua);
}
