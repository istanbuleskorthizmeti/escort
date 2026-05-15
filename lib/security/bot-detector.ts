/**
 * 🛡️ DRKCNAY HYDRA: BOT DETECTOR (Core Engine)
 * Identifies Googlebot, malicious scrapers, and real users.
 */

export interface CloakingDecision {
  action: 'SHOW_MONEY_SITE' | 'SHOW_SEO_CONTENT' | 'SHOW_SAFE_PAGE' | 'SHOW_TOXIC_PAGE';
  reason: string;
}

export class BotDetector {
  private static googleBotIPs = [
    '66.249.', '64.233.', '72.14.', '209.85.', '216.239.' // Common Google IP ranges
  ];

  private static toxicUserAgents = [
    'DotBot', 'PetalBot', 'YandexBot', 'Baiduspider', 'python-requests', 'curl', 'wget', 'Go-http-client'
  ];

  static async analyze(params: {
    userAgent: string;
    ip: string;
    geo?: string;
    referer?: string;
    cfBotScore?: number;
    isVerifiedBot?: boolean;
    isPbnProxy?: boolean;
  }): Promise<CloakingDecision> {
    const { userAgent, ip, geo, cfBotScore, isVerifiedBot, isPbnProxy } = params;
    const uaUpper = userAgent.toUpperCase();

    // 0. IS IT OUR OWN PBN CLOUDFLARE WORKER?
    // If the request comes with our secret header, it's our Worker asking for content to feed Google.
    if (isPbnProxy) {
       return { action: 'SHOW_SEO_CONTENT', reason: 'Verified PBN Proxy - Show God Mode SEO' };
    }

    // 1. IS IT GOOGLE? (The Holy Grail)
    // If it claims to be Google AND comes from a Google IP (or is verified by CF)
    const claimsGoogle = uaUpper.includes('GOOGLEBOT') || uaUpper.includes('GOOGLE-INSPECTIONTOOL');
    const isGoogleIP = this.googleBotIPs.some(range => ip.startsWith(range));
    
    if (claimsGoogle && (isGoogleIP || isVerifiedBot)) {
      return { action: 'SHOW_SEO_CONTENT', reason: 'Verified Googlebot - Show God Mode SEO' };
    }

    // 1.5. IS IT A SEO ANALYSIS TOOL? (Ahrefs, Semrush, Majestic)
    // The user correctly noted: If Ahrefs/Semrush sees a toxic/blank page, they won't index our backlinks
    // and our Domain Rating (DR) will drop. Google doesn't penalize us for Ahrefs, but Ahrefs calculates our power.
    // So we MUST show them the SEO Content (God Mode) just like Googlebot.
    const seoTools = ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'Rogerbot', 'Xenu', 'Screaming Frog', 'Majestic'];
    const isSeoTool = seoTools.some(bot => uaUpper.includes(bot.toUpperCase()));
    
    if (isSeoTool) {
      return { action: 'SHOW_SEO_CONTENT', reason: 'SEO Tool Detected - Show God Mode to boost DR/UR' };
    }

    // 2. IS IT A COMPETITOR / SCRAPER? (Toxic Honeypot)
    // We only block aggressive, non-value scrapers (Python, curl, generic bots)
    const isToxicUA = this.toxicUserAgents.some(bot => uaUpper.includes(bot.toUpperCase()));
    if (isToxicUA || (cfBotScore !== undefined && cfBotScore < 30 && !isVerifiedBot && !isGoogleIP && !isSeoTool)) {
      return { action: 'SHOW_TOXIC_PAGE', reason: 'Malicious Scraper Detected - Send to Honeypot' };
    }

    // 3. IS IT A BTK / MANUAL REVIEWER? (Safe Mode)
    // The user explicitly stated: "We need to make money, we cannot show safe pages to normal users (even tourists/foreigners)."
    // Therefore, we route ALL humans (regardless of Geo) to the Money Site to maximize conversion.
    // We only use Safe Mode if we specifically flag an IP manually in the future.

    // 4. IT'S A REAL USER (Money Site)
    return { action: 'SHOW_MONEY_SITE', reason: 'Human User (TR or Global) - Show VIP Catalog' };
  }
}
