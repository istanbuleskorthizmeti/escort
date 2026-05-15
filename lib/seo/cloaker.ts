/**
 * ⚡ DRKCNAY CLOAKER ENGINE v1.0
 * Advanced Bot Detection & Traffic Routing
 */

export interface CloakResult {
  isBot: boolean;
  isTargetHuman: boolean; // True if Human from Target Region (TR)
  action: 'SHOW_MONEY_SITE' | 'SHOW_SEO_CONTENT' | 'SHOW_SAFE_PAGE' | 'SHOW_TOXIC_PAGE';
}

export class DRKCNAYCloaker {
  // Known bot signatures (Search Engines)
  private static BOTS = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 
    'yandexbot', 'sogou', 'exabot', 'facebot', 'ia_archiver'
  ];

  // Sabotage & Analysis Bots (Competitors)
  private static SABOTAGE_BOTS = [
    'ahrefs', 'semrush', 'dotbot', 'mj12bot', 'rogerbot', 
    'screaming frog', 'majestic', 'seomoz', 'blexbot'
  ];
  // Datacenter / Crawler IP keywords
  private static DC_KEYWORDS = [
    'amazon', 'google', 'microsoft', 'digitalocean', 'hetzner', 'ovh', 'linode'
  ];

  /**
   * Detects if the visitor is a bot or a target human.
   */
  static async analyze(request: { 
    userAgent: string; 
    ip: string; 
    geo?: string;
    referer?: string;
    cfBotScore?: number;
    isVerifiedBot?: boolean;
  }): Promise<CloakResult> {
    const ua = request.userAgent.toLowerCase();
    
    // 0. Cloudflare Paranoid Mode Check
    if (request.isVerifiedBot) {
      return { isBot: true, isTargetHuman: false, action: 'SHOW_SEO_CONTENT' };
    }
    if (request.cfBotScore !== undefined && request.cfBotScore < 20) {
      return { isBot: true, isTargetHuman: false, action: 'SHOW_SEO_CONTENT' };
    }



    // 1. Check for Sabotage Bots first (Competitor Analysis Tools)
    const isSabotageBot = this.SABOTAGE_BOTS.some(bot => ua.includes(bot));
    if (isSabotageBot) {
      console.log(`🕷️ [HONEYPOT] Sabotage Bot Detected: ${request.userAgent} - Serving Toxic Page.`);
      return { isBot: true, isTargetHuman: false, action: 'SHOW_TOXIC_PAGE' };
    }

    // 2. Check User-Agent for standard Search Engines
    const isBotUA = this.BOTS.some(bot => ua.includes(bot));
    
    // 3. Check for Headless Browsers or common scrapers
    const isScraper = ua.includes('headless') || ua.includes('puppeteer') || ua.includes('playwright') || ua.includes('phantomjs') || ua.includes('cypress');

    // 3.5 Check typical Data Center IP anomalies (App-Level Defense)
    // Cloudflare handles ASN blocking, but we double-check common DC names in UA/Headers just in case
    const isDatacenter = this.DC_KEYWORDS.some(dc => ua.includes(dc));

    // 4. Simple Geo Check (Assuming TR is target)
    const isTR = request.geo === 'TR' || !request.geo;

    if (isBotUA || isScraper || isDatacenter) {
      return { isBot: true, isTargetHuman: false, action: 'SHOW_SEO_CONTENT' };
    }

    // 5. Geo-Fencing & Link Attack Handler
    // Biz agresif PBN ve Web 2.0 (dış link) saldırıları yaptığımız için kullanıcılar
    // herhangi bir referer (kaynak) adresi ile gelebilir. 
    // Bu yüzden referer kısıtlamasını tamamen kaldırıyoruz.
    // Türkiye'den (TR) gelen tüm insanlar doğrudan Money Site'a (VIP) alınır.
    if (isTR) {
      return { isBot: false, isTargetHuman: true, action: 'SHOW_MONEY_SITE' };
    }

    // 6. Yabancı IP'ler veya diğer durumlar. Artık herkesi Money Site'a alıyoruz.
    return { isBot: false, isTargetHuman: true, action: 'SHOW_MONEY_SITE' };
  }
}
