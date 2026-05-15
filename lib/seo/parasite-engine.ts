import { generateGodModeOmniContent } from '../ai-seo';

/**
 * 💣 PARASITE SIEGE ENGINE (Tier 2/3)
 * Tumblr, Blogger, WordPress.com gibi platformlar için "Nuclear" içerik üretir.
 * Bu içerik agresiftir, spam eşiğindedir ve maksimum otorite transferi hedefler.
 */
export class ParasiteEngine {
  
  /**
   * Parazit platformlar için "Zehirli" (Nuclear) içerik üretir.
   */
  static async generateNuclearParasiteContent(city: string, district: string) {
    console.log(`[PARASITE] ${district} için Nuclear içerik üretiliyor...`);
    
    const params = {
      city,
      district,
      category: 'Agresif Escort İlanları',
      nicheType: 'Nuclear Spam (Eskord, Ucuz, Hemen Ara)',
      host: 'parasite-network.com' // Virtual host for context
    };

    const baseContent = await generateGodModeOmniContent(params);

    // İçeriği daha da agresifleştir (Keywords Injection)
    const aggressiveKeywords = [
      'eskord', 'eskrot', 'ucuz escort', 'istanbul escort bayan', 
      'gecelik fiyatlar', 'hemen ara', 'kaporasız ilanlar'
    ];

    let nuclearContent = baseContent.wordpress.content;
    
    // Her paragrafın sonuna rastgele agresif kelimeler enjekte et
    nuclearContent = nuclearContent.replace(/<\/p>/g, () => {
      const kw = aggressiveKeywords[Math.floor(Math.random() * aggressiveKeywords.length)];
      return ` <span style="display:none">${kw}</span></p>`;
    });

    return {
      title: `${city} ${district} Escort İlanları - %100 Gerçek ve Ucuz`,
      content: nuclearContent,
      tags: aggressiveKeywords.join(',')
    };
  }

  /**
   * Linkleme Stratejisi: Parazit -> Uydulara link verir.
   */
  static injectTierLinks(content: string, satelliteUrl: string) {
    const linkText = "Güncel katalog ve gerçek fotoğraflar için BURAYA TIKLAYIN.";
    const anchor = `<p><strong><a href="${satelliteUrl}" target="_blank" rel="nofollow">${linkText}</a></strong></p>`;
    return content + "\n" + anchor;
  }
}
