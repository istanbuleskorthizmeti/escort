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

function getSemanticEntities(city: string, district?: string, host?: string): string[] {
  const key = (district || city).toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ğ/g, 'g');
  const entities = [...(LOCAL_LANDMARKS[key] || ["VIP Gece Hayati", "Luks Konaklama", "Elit Rehberlik", "Ozel Asistanlik", "Gizlilik Garantisi", "Premium Hizmetler"])];
  
  // Mix in domain specific dynamic LSI terms
  const domainSpecificLsi = [
    "kaporasız eskort gacı", "buluşmak için bayan", "randevu için çıtır",
    "otel escort bayan", "eve gelen eskort gacı", "bireysel eskort bayan"
  ];
  
  const seed = host ? host.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : Math.floor(Math.random() * 100);
  const shuffled = [...entities, ...domainSpecificLsi].sort(() => {
    const r = Math.sin(seed + Math.random()) * 10000;
    return r - Math.floor(r) - 0.5;
  });
  
  return shuffled.slice(0, 7);
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
    [DEEPSEEK HYDRA CORE - HOST-SPECIFIC OBFUSCATION AND UNIQUE LSI]
    Görevin: Her alan adına tamamen özgün, kopya içerik filtrelerini (duplicate content) aşacak şekilde son derece agresif ve manipülatif SEO metni üretmek.
    
    🔴 ALAN ADINA ÖZEL OBFUSCATION VE BENZERSİZLİK (Host: ${host}):
    Metnin yapısını, kelime seçimlerini ve LSI örüntülerini tamamen bu hosta (${host}) özel olarak kurgula. Diğer alan adları ile ortak tek bir cümle bile olmasın!
    
    Kural 1: ASLA laf kalabalığı (fluff) yapma. Token tasarrufu ve semantik yoğunluk maksimum olmalı.
    Kural 2: ${locationName} bölgesi için "escort", "eskort", "gacı", "bayan", "genç kız", "çıtır", "buluşmak için", "randevu almak için", "iletişim için" gibi arama hacmi yüksek işlemsel anahtar kelimeleri agresifçe metnin doğal akışına yedir.
    Kural 3: Kesinlikle Türkçe karakter hatası yapma.
    Kural 4: SADECE JSON ÇIKTISI VER.
    Kural 5: İçerik ~${targetLength} kelime civarı, ${persona.tone} tonunda ve tamamen özgün cümle yapılarıyla olsun.
    Kural 6: Şirket adı: ${host}. 

    🔴 KRİTİK LİNKLEME KURALLARI (MANDATORY LINKS):
    Metin içerisinde en az 2 adet şu linklerden birini kullan: 
    1. <a href="https://${host}">https://${host}</a>
    2. <a href="https://bit.ly/dorukcanmanay">https://bit.ly/dorukcanmanay</a>
    
    Linklerin anchor text'leri kesinlikle şu agresif ifadelerden biri olmalı: "${locationName} eskort gacı", "kaporasız buluşmak için", "çıtır genç kız randevu", "${locationName} escort bayan", "iletişim telefon numarası".

    İSTENEN JSON FORMATI:
    {
      "wordpress": {
        "title": "${locationName} Escort | ${host} Eskort Gacı Bayan Randevu",
        "content": "HTML İÇERİK (H2, H3, strong ve <a href='...'> etiketlerini MUTLAKA benzersiz bir kurguyla kullan.)",
        "meta": "${host} - ${locationName} bölgesinde buluşmak için eskort gacı, randevu almak için eskort bayan ve çıtır genç kız ilanları.",
        "tags": ["${locationName} escort", "${locationName} eskort", "gacı", "çıtır bayan", "kaporasız", "randevu"],
        "faqs": [{"q": "${locationName} eskort buluşması kaporasız mı?", "a": "Evet, ${host} platformundaki çıtır eskort gacı ve bayan modellerimizle buluşmak için ön ödeme veya kapora istenmez. Ödeme elden yapılır."}]
      },
      "github": { "readme": "", "gist": "" },
      "blogger": { "title": "${locationName} Eskort Gacı Bayan Raporu", "content": "..." }
    }
  `;

  const userPrompt = `
    Lokasyon: ${fullLoc}. Odak: ${semanticEntities}. Benzersizlik tohumu (Seed): ${host}-${locationName}-${targetLength}. Uzunluk: ~${targetLength} kelime. JSON DÖNDÜR.
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

/**
 * 🧛‍♂️ HYDRA TEMPLATE ENGINE
 * Generates reusable content drafts with placeholders to save tokens.
 */
export async function generateTemplateContent({
  city,
  host,
}: { city: string, host: string }): Promise<OmniPlatformContent> {
  const systemPrompt = `
    [DEEPSEEK HYDRA TEMPLATE ENGINE]
    Görevin: Herhangi bir ilçe için özelleştirilebilir bir "Master Template" üretmek.
    Kural 1: İlçe isimleri yerine {{LOCATION}} placeholder'ını kullan. Örn: "{{LOCATION}} VIP Escort".
    Kural 2: İçerik çok kaliteli ve genel bir ${city} escort rehberi tadında olsun.
    Kural 3: ASLA spesifik bir ilçe adı yazma, sadece {{LOCATION}} kullan.
    Kural 4: SADECE JSON ÇIKTISI VER.
  `;

  const userPrompt = `Şehir: ${city}. Şirket: ${host}. {{LOCATION}} içeren zengin bir içerik template'i üret.`;

  return generateEliteOmniContent({ city, district: "{{LOCATION}}", host });
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
