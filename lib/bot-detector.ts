/**
 * 🕵️ DRKCNAY BOT DETECTOR
 * Identifies search engine crawlers for Cloaking & Hacklink operations.
 */

export function isSearchEngineBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  
  const botKeywords = [
    'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp', 
    'baiduspider', 'ia_archiver', 'twitterbot', 'facebookexternalhit'
  ];
  
  const ua = userAgent.toLowerCase();
  return botKeywords.some(keyword => ua.includes(keyword));
}
