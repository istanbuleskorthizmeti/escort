import { omniAI } from '../ai-provider';
import { getUniqueness } from './uniqueness-engine';

/**
 * 📰 HYDRA NEWS ENGINE
 * Uydular için her hafta otomatik, semt bazlı "Lifestyle" içerikler üretir.
 * Google'ın "Freshness" (Tazelik) puanını maksimize eder.
 */

const NEWS_TOPICS = [
  "İstanbul Gece Hayatında Bu Hafta: En Popüler Mekanlar",
  "VIP Yaşam: Prestijli Partner Seçiminde Nelere Dikkat Edilmeli?",
  "Modern Sosyalleşme: Elit Refakat Hizmetlerinin Yükselişi",
  "Kaporasız Güvenli Randevu: Sektördeki Yeni Güvenlik Standartları",
  "Lüks ve Konfor: İstanbul'un En İyi VIP Konaklama Otelleri"
];

export class NewsEngine {
  
  static async generateLocalizedNews(city: string, district: string) {
    const topic = NEWS_TOPICS[Math.floor(Math.random() * NEWS_TOPICS.length)];
    const uniqueness = getUniqueness(`${district}.${city}.news`);

    const systemPrompt = `Sen bir lüks yaşam ve magazin editörüsün. 
    ${district} bölgesi için haftalık taze bir haber/makale yazacaksın. 
    Dilin elit, akıcı ve merak uyandırıcı olsun.
    
    KURALLAR:
    1. İçerik 150-250 kelime arası olsun (Hızlı tüketim için).
    2. Mutlaka ${district}, ${city} ve "elit partner" kelimelerini doğalca kullan.
    3. AI olduğu asla anlaşılmamalı (Human-like).
    4. HTML formatında dön (Sadece paragraf ve vurgular).`;

    const prompt = `KONU: ${topic}
    LOKASYON: ${district}, ${city}
    
    Lütfen bu semte özel haftalık güncel bir içerik oluştur.`;

    try {
      const content = await omniAI.generate(prompt, { systemPrompt, temperature: 0.8 });
      return {
        title: `${topic} - ${district} Özel Raporu`,
        content: content.replace(/```html/g, '').replace(/```/g, '').trim(),
        date: new Date().toLocaleDateString('tr-TR')
      };
    } catch (err) {
      console.error("News Generation Failed:", err);
      return {
        title: `${topic}`,
        content: `<p>${district} bölgesinde lüks ve prestij odaklı hizmet standartlarımız her geçen gün yükseliyor. ${uniqueness.fallbackMessage}</p>`,
        date: new Date().toLocaleDateString('tr-TR')
      };
    }
  }
}
