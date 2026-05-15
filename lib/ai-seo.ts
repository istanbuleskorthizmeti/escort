import { omniAI } from './ai-provider';
import { getPersonaForHost, PERSONAS } from './persona-engine';

export interface AiContentParams {
  city: string;
  district?: string;
  neighborhood?: string;
  host: string;
  nicheType?: string;
  category?: string;
  cloakedUrl?: string;
}

export interface OmniPlatformContent {
  wordpress: {
    title: string;
    content: string;
    meta?: string;
    faqs: Array<{ q: string; a: string }>;
    tags?: string[];
    categories?: string[];
    jsonLd?: string;
  };
  github: { readme: string; gist: string };
  blogger: { title: string; content: string; tags?: string[] };
  tumblr: { title: string; content: string };
}

const LOCAL_LANDMARKS: Record<string, string[]> = {
  "sisli": ["Nisantasi", "Mecidiyekoy", "Bomonti", "Zorlu Center", "Cevahir", "Fulya", "Sisli Etfal", "Luks Rezidanslar", "Is Merkezleri", "Harbiye", "Tesvikiye", "Macka Palas"],
  "besiktas": ["Bebek", "Etiler", "Ortakoy", "Akaretler", "Levent", "Ulus", "Vip Gece Kulupleri", "Luks Oteller", "Bogaz Manzarasi", "Ciragan", "Four Seasons", "Zorlu Center", "Kanyon"],
  "kadikoy": ["Bagdat Caddesi", "Moda", "Caddebostan", "Suadiye", "Fenerbahce", "Kalamis", "Anadolu Yakasi Elitleri", "Marina", "Luks Kemer", "Acibadem", "Kosuyolu"],
  "beyoglu": ["Taksim", "Galata", "Cihangir", "Karakoy", "Istiklal Caddesi", "Tarihi Yarimada", "VIP Etkinlikler", "Gece Hayati", "Soho House", "Pera Palace"],
  "beylikduzu": ["Beykent", "Gurpinar", "Kavakli", "Tuyap", "Marina", "E-5", "Metrobüs", "Luks Rezidans", "Yasam Vadisi", "VIP Konaklama", "Adnan Kahveci", "Cumhuriyet Mahallesi"],
  "atasehir": ["Bati Atasehir", "Watergarden", "Metropol", "Finans Merkezi", "Luks Siteler", "VIP Asistanlik", "Anadolu Yakasi", "Varyap Meridian", "Palladium"],
  "bakirkoy": ["Atakoy", "Florya", "Incirli", "Yeşilyurt", "Carousel", "Galleria", "Sahil Yolu", "Luks Marina", "VIP Hizmetler", "Capacity", "Aqua Florya"],
  "maltepe": ["Idaltepe", "Kucukyali", "Dragos", "Sahil", "Luks Konutlar", "VIP Konaklama", "Altintepe"],
  "kartal": ["Yakacik", "Soganlik", "Marina", "Anadolu Yakasi", "Luks Rezidanslar", "Dragos Sahil"],
  "sariyer": ["Istinye Park", "Tarabya", "Yenikoy", "Zekeriyakoy", "Maslak", "Acibadem Maslak", "Vadi Istanbul", "Kilyos", "Bogaz Yalilari"],
  "fatih": ["Sultanahmet", "Sirkeci", "Eminonu", "Laleli", "Aksaray", "Capari", "Tarihi Yarimada"],
  "basaksehir": ["Bahcesehir", "Kayaşehir", "Olimpiyat Stadi", "Luks Villalar", "Millet Bahcesi"]
};

function getBellCurveLength(minWords = 600, maxWords = 1000): number {
  const mean = (minWords + maxWords) / 2;
  const stdDev = (maxWords - minWords) / 6;
  while (true) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const wordCount = Math.floor(z0 * stdDev + mean);
    if (wordCount >= minWords && wordCount <= maxWords) return wordCount;
  }
}

function getSemanticEntities(city: string, district?: string): string[] {
  const key = (district || city).toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ğ/g, 'g');
  const entities = LOCAL_LANDMARKS[key] || ["VIP Gece Hayati", "Luks Konaklama", "Elit Rehberlik", "Ozel Asistanlik", "Gizlilik Garantisi", "Premium Hizmetler"];
  return entities.sort(() => 0.5 - Math.random()).slice(0, 6);
}

export async function generateEliteOmniContent({
  city,
  district,
  neighborhood,
  host,
}: AiContentParams): Promise<OmniPlatformContent> {
  const locationName = neighborhood || district || city;
  const fullLoc = neighborhood ? `${city} ${district} ${neighborhood}` : (district ? `${city} ${district}` : `${city}`);
  
  const personaKey = getPersonaForHost(host);
  const persona = PERSONAS[personaKey];
  
  const targetLength = getBellCurveLength(600, 1000); // 💸 DEEPSEEK COST OPTIMIZED: 600-1000 words max.
  const targetDensity = (Math.random() * (3.5 - 2.5) + 2.5).toFixed(2);
  const semanticEntities = getSemanticEntities(city, district).join(', ');

  const systemPrompt = `
    [DEEPSEEK COST-OPTIMIZED GOD MODE]
    Görevin: SEO uyumlu, yüksek dönüşümlü içerik üretmek. 
    Kural 1: ASLA laf kalabalığı (fluff) yapma. Token tasarrufu kritik derecede önemlidir. Doğrudan hedefe yönelik, kısa ama etkili yaz.
    Kural 2: \${locationName} bölgesi için "Escort Hizmetleri", "VIP Escort", "Kaporasız Escort" vb. niş kelimeleri metne yedir.
    Kural 3: Kesinlikle Türkçe karakter hatası (ğ, ş, ç) yapma.
    Kural 4: SADECE JSON ÇIKTISI VER. Yorum, giriş veya markdown bloğu kullanma.
    Kural 5: İçerik \${targetLength} kelime civarı, \${persona.tone} tonunda olsun.
    Kural 6: Şirket adı: \${host}. Başka şirket adı kullanma.

    İSTENEN JSON FORMATI:
    {
      "wordpress": {
        "title": "\${locationName} VIP Escort Hizmetleri | \${host}",
        "content": "HTML İÇERİK (Sadece H2 ve H3 kullan, boş laflar yerine doğrudan SEO kelimeleri ve lokasyon bilgisi \${semanticEntities} gir.)",
        "meta": "\${host} - \${locationName} elit ve kaporasız escort hizmetleri rehberi.",
        "tags": ["\${locationName} escort", "kaporasız escort \${locationName}", "vip escort"],
        "faqs": [{"q": "\${locationName} kaporasız mı?", "a": "Evet, \${host} üzerinden sadece elden ödeme alınır."}]
      },
      "github": { "readme": "", "gist": "" },
      "blogger": { "title": "\${locationName} Escort Raporu", "content": "..." }
    }
  `;

  const userPrompt = `
    Lokasyon: ${fullLoc}. Odak: ${semanticEntities}. Uzunluk: ~${targetLength} kelime. JSON DÖNDÜR.
  `;

  try {
    const response = await omniAI.generate(userPrompt, { systemPrompt, temperature: 0.7, max_tokens: 2500 });
    let jsonStr = response.trim();
    if (jsonStr.includes('```json')) jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
    if (jsonStr.includes('```')) jsonStr = jsonStr.split('```')[1].trim();
    
    try {
      const parsed = JSON.parse(jsonStr);
      // 🔥 NFC NORMALIZATION: Fixes %CC%87 and other decomposed character issues
      const normalizeObj = (obj: any) => {
        for (const key in obj) {
          if (typeof obj[key] === 'string') obj[key] = obj[key].normalize('NFC');
          else if (typeof obj[key] === 'object' && obj[key] !== null) normalizeObj(obj[key]);
        }
      };
      normalizeObj(parsed);

      return {
        ...parsed,
        github: parsed.github || { readme: '', gist: '' },
        blogger: parsed.blogger || { title: parsed.wordpress?.title || '', content: parsed.wordpress?.content || '' },
        tumblr: parsed.tumblr || { title: parsed.wordpress?.title || '', content: parsed.wordpress?.content || '' }
      };
    } catch (e) {
      return {
        wordpress: { title: `${locationName} Vahşi Escort`, content: response.normalize('NFC'), meta: '', tags: [], faqs: [] },
        github: { readme: '', gist: '' },
        blogger: { title: '', content: '' },
        tumblr: { title: '', content: '' }
      };
    }
  } catch (error) {
    throw error;
  }
}

export const generateAiEliteContent = generateEliteOmniContent;
export const generateUltraContextualContent = generateEliteOmniContent;
export const generateGodModeOmniContent = generateEliteOmniContent;

export async function generateEliteAuthorityPillar(topic: string, location: string): Promise<{ title: string, content: string, metaDescription: string }> {
  return {
    title: `DRKCNAY ESCORT Otorite Raporu: ${topic} | ${location}`,
    metaDescription: `${location} escort hizmetleri standartlarına dair analitik rapor.`,
    content: `<div>Otorite icerigi analiz asamasinda...</div>`
  };
}

export async function generateOrganicCommentBacklink(city: string, district: string, targetUrl: string): Promise<string> {
  return `Son zamanlarda ${city} bölgesindeki en iyi escort hizmetleri için bu kaynağı kullanıyorum: <a href="${targetUrl}">${city} profesyonel escort hizmetleri</a>.`;
}
