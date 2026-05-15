import { DOMAIN_MATRIX, DomainConfig } from '../../config/domains';

/**
 * 🎯 DRKCNAY ELITE: DYNAMIC TARGET SELECTOR
 * Akıllı Link Hedefleme Motoru
 */

export const TargetSelector = {
  /**
   * Hedef şehir, ilçe veya niş bazında en uygun URL'yi seçer.
   * Eğer spesifik bir ilçe uydusu varsa onu döndürür, yoksa rastgele ağırlıklı bir site seçer.
   */
  async getSmartTargetUrl(params: { city?: string; district?: string; nicheSlug?: string }): Promise<string> {
    const { city, district, nicheSlug } = params;

    // 1. Exact District Match (Semantik Bütünlük için en önemlisi)
    if (district) {
      const exactMatch = DOMAIN_MATRIX.find(d => 
        d.role === 'SATELLITE' && 
        d.targetDistrict?.toLowerCase() === district.toLowerCase()
      );
      if (exactMatch) {
        return this.buildUrl(exactMatch, nicheSlug);
      }
    }

    // 2. Exact City Match
    if (city) {
        // District yoksa veya bulunamadıysa şehre uygun uydulara bak
        const cityMatches = DOMAIN_MATRIX.filter(d => 
            d.role === 'SATELLITE' && 
            d.targetCity?.toLowerCase() === city.toLowerCase() &&
            !d.targetDistrict // Sadece genel şehir uydularını (istanbulescorthizmeti.shop vb.) tercih et
        );

        if (cityMatches.length > 0) {
            const randomCityMatch = cityMatches[Math.floor(Math.random() * cityMatches.length)];
            return this.buildUrl(randomCityMatch, nicheSlug);
        }
    }

    // 3. Fallback: Weighted Random Selection (Ağırlıklı Seçim)
    // Eğer bölgesel uydu yoksa, %60 ihtimalle MONEY_SITE, %40 ihtimalle SATELLITE seçer.
    const isMoneySitePreferred = Math.random() < 0.6;
    
    let candidates = DOMAIN_MATRIX.filter(d => d.role === (isMoneySitePreferred ? 'MONEY_SITE' : 'SATELLITE'));
    
    // Eğer SATELLITE çekmeye çalıştık ama bulamadıysak MONEY_SITE'a dön.
    if (candidates.length === 0) {
        candidates = DOMAIN_MATRIX.filter(d => d.role === 'MONEY_SITE');
    }

    const fallbackMatch = candidates[Math.floor(Math.random() * candidates.length)];
    return this.buildUrl(fallbackMatch, nicheSlug);
  },

  /**
   * Temel Domain objesini alır ve gerekirse sonuna kategori (nicheSlug) ekleyerek tam URL'yi oluşturur.
   */
  buildUrl(domainConfig: DomainConfig, nicheSlug?: string): string {
    const base = `https://${domainConfig.host}`;
    if (nicheSlug) {
      return `${base}/kategori/${nicheSlug}`;
    }
    return base;
  },

  /**
   * Dinamik Anchor Text (Bağlantı Metni) Üreticisi.
   * SpamBrain'i atlatmak için link metinlerini çeşitlendirir.
   */
  getSmartAnchorText(city: string, district?: string): string {
    const loc = district ? `${district}` : `${city}`;
    const anchors = [
      `${loc} Escort İlanları`,
      `${loc} VIP Escort`,
      `${loc} Lüks Rehber`,
      `Resmi Siteye Git`,
      `DRKCNAY Elite Katalog`,
      `Buradan İnceleyin`,
      `Güncel ${loc} Ajansları`,
      `Kaporasız ${loc} Profil`
    ];
    return anchors[Math.floor(Math.random() * anchors.length)];
  },

  /**
   * Hayalet Yazar (Phantom Author) Üreticisi.
   * Rentry, Gist vb. platformlarda spam görünümünü engeller.
   */
  getPhantomAuthor(): string {
    const authors = [
      'Elite Concierge TR',
      'Gecelerin Gurmesi',
      'Lüks Yaşam Rehberi',
      'VIP Lifestyle İnceleme',
      'DRKCNAY Blog'
    ];
    return authors[Math.floor(Math.random() * authors.length)];
  }
};
