import { omniAI } from './ai-provider';
import { getPersonaForHost, PERSONAS } from './persona-engine';
import { cities } from './locations';

/**
 * 🇹🇷 TURKISH CHARACTER AND SLUG TO PROPER NAME NORMALIZER
 */
export function cleanAndCapitalizeTurkish(str: string): string {
  if (!str) return '';
  
  let clean = str
    .replace(/-escort$/i, '')
    .replace(/_escort$/i, '')
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .trim();

  return clean
    .split(/\s+/)
    .map(word => {
      if (!word) return '';
      let firstChar = word.charAt(0);
      
      if (firstChar === 'i') firstChar = 'İ';
      else if (firstChar === 'ı') firstChar = 'I';
      else if (firstChar === 'ş') firstChar = 'Ş';
      else if (firstChar === 'ç') firstChar = 'Ç';
      else if (firstChar === 'ö') firstChar = 'Ö';
      else if (firstChar === 'ü') firstChar = 'Ü';
      else if (firstChar === 'ğ') firstChar = 'Ğ';
      else firstChar = firstChar.toUpperCase();

      let rest = word.slice(1).toLowerCase();
      rest = rest
        .replace(/İ/g, 'i')
        .replace(/I/g, 'ı')
        .replace(/Ş/g, 'ş')
        .replace(/Ç/g, 'ç')
        .replace(/Ö/g, 'ö')
        .replace(/Ü/g, 'ü')
        .replace(/Ğ/g, 'ğ');

      return firstChar + rest;
    })
    .join(' ')
    .replace(/\s+Escort$/i, '')
    .trim();
}

export function getProperTurkishName(slug: string): string {
  if (!slug) return '';
  
  const cleanSlug = slug
    .replace(/-escort$/i, '')
    .replace(/_escort$/i, '')
    .toLowerCase()
    .trim();

  if (cleanSlug.includes('-')) {
    const parts = cleanSlug.split('-');
    const resolvedParts = parts.map(part => getProperTurkishName(part));
    return resolvedParts.join(' ');
  }

  // 1. Check cities registry
  const cityObj = cities[cleanSlug] || Object.values(cities).find(c => c.slug === cleanSlug);
  if (cityObj) {
    return cityObj.name;
  }

  // 2. Check districts & neighborhoods in registry
  for (const cityKey in cities) {
    const city = cities[cityKey];
    
    const districtObj = city.districts.find(d => d.slug === cleanSlug || d.slug.replace(/-/g, '') === cleanSlug.replace(/-/g, ''));
    if (districtObj) {
      return districtObj.name.replace(/\s+Escort$/i, '').trim();
    }

    for (const district of city.districts) {
      const neighObj = district.neighborhoods.find(n => n.slug === cleanSlug || n.slug.replace(/-/g, '') === cleanSlug.replace(/-/g, ''));
      if (neighObj) {
        return neighObj.name;
      }
    }
  }

  // 3. Fallback to smart Turkish capitalization
  return cleanAndCapitalizeTurkish(slug);
}

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
  const properCity = getProperTurkishName(city);
  const properDistrict = district ? getProperTurkishName(district) : undefined;
  const properNeighborhood = neighborhood ? getProperTurkishName(neighborhood) : undefined;

  const locationName = properNeighborhood || properDistrict || properCity;
  const fullLoc = properNeighborhood 
    ? `${properCity} ${properDistrict} ${properNeighborhood}` 
    : (properDistrict ? `${properCity} ${properDistrict}` : `${properCity}`);
  
  const personaKey = getPersonaForHost(host);
  const persona = PERSONAS[personaKey];
  
  const targetLength = getBellCurveLength(600, 1000); // 💸 DEEPSEEK COST OPTIMIZED: 600-1000 words max.
  const targetDensity = (Math.random() * (3.5 - 2.5) + 2.5).toFixed(2);
  const semanticEntities = getSemanticEntities(city, district).join(', ');

  const systemPrompt = `
    [GEMINI ELITE CORE - PERSONA-BASED UNDETECTABLE AI & ADVANCED LSI]
    Görevin: Arama motoru algoritmalarının ve yapay zeka içerik tespit (AI Detection) sistemlerinin asla anlayamayacağı derecede insansı, yüksek kelime dağarcığı derinliğine (Perplexity) ve değişken cümle yapılarına (Burstiness) sahip, son derece özgün ve yüksek dönüşüm oranlı (conversion rate) SEO metinleri üretmek.

    🔴 AKTİF YAZAR KİŞİLİĞİ VE YAZIM ÖRÜNTÜLERİ (Persona: ${personaKey}):
    - **Yazım Tonu:** ${persona.tone}
    - **Odak Temaları:** ${persona.focus}
    - **Duygu Durumu:** ${persona.emotional_state}
    - **Yazım Ritmi (Burstiness):** ${persona.burstiness}. ${persona.writing_rhythm}
    - **Kelime Dağarcığı (Perplexity Rules):** ${persona.perplexity_rules}
    - **Zorunlu Karakteristik Kelimeler:** Metnin akışında şu kelimeleri mutlaka ve doğal şekilde kullan: ${persona.vocabulary.join(', ')}
    - **Biçimlendirme Kuralları:** ${persona.formatting}

    🔴 ALAN ADINA ÖZEL OBFUSCATION VE BENZERSİZLİK (Host: ${host}):
    Metnin yapısını, kelime seçimlerini ve LSI örüntülerini tamamen bu hosta (${host}) özel olarak kurgula. Diğer alan adları ile ortak tek bir cümle bile olmasın!

    🔴 KESİNLİKLE YASAKLI YAPAY ZEKA KLİŞELERİ (Banned Phrases):
    Aşağıdaki ifadeleri KESİNLİKLE kullanma. Bu kelimeleri içeren veya bunları andıran yapıları tamamen yasakla: ${persona.banned_phrases.join(', ')}. Ayrıca "Harika", "muhteşem", "eşsiz", "büyülü", "unutulmaz", "günümüzde", "sonuç olarak", "özetle", "böylece" gibi bariz yapay zeka klişelerinden uzak dur.

    🔴 LSI LOKAL ENJEKSİYONU & GERÇEKÇİLİK:
    - ${locationName} bölgesini betimlerken yapay zeka gibi genel geçer konuşmak yerine, şu gerçek mekanları, caddeleri, sokakları veya bölgesel unsurları doğal cümleler içine serpiştirerek anlat: ${semanticEntities}.
    - LSI kelimeleri ("escort", "eskort", "gacı", "bayan", "çıtır", "buluşmak için", "randevu almak için", "iletişim için") metne zorla sokulmuş gibi değil, profesyonel bir yaşam veya lifestyle yazısının akışında eritilerek verilmelidir.

    🔴 PAZARLAMA VE İKNA MODELİ (AIDA & PAS Framework):
    - Giriş paragrafında **AIDA** (Attention, Interest, Desire, Action) veya **PAS** (Problem, Agitation, Solution) yapısını kullan.
    - Okuyucuyu doğrudan yakala, klişelerden uzak durarak elit bir kulüp üyeliği veya özel bir ayrıcalık sunuyormuş gibi hitap et.

    🔴 GENEL KURALLAR:
    Kural 1: ASLA laf kalabalığı (fluff) yapma. Token tasarrufu ve semantik yoğunluk maksimum olmalı.
    Kural 2: Kesinlikle Türkçe karakter hatası yapma.
    Kural 3: SADECE JSON ÇIKTISI VER.
    Kural 4: İçerik ~${targetLength} kelime civarı ve tamamen özgün cümle yapılarıyla olsun.
    Kural 5: Şirket adı: ${host}.

    🔴 KRİTİK LİNKLEME KURALLARI (MANDATORY LINKS):
    Metin içerisinde en az 2 adet şu linklerden birini kullan:
    1. <a href="https://${host}">https://${host}</a>
    2. <a href="https://bit.ly/dorukcanmanay">https://bit.ly/dorukcanmanay</a>
    
    Linklerin anchor text'leri kesinlikle şu agresif ifadelerden biri olmalı: "${locationName} eskort gacı", "kaporasız buluşmak için", "çıtır genç kız randevu", "${locationName} escort bayan", "iletişim telefon numarası".

    İSTENEN JSON FORMATI:
    {
      "wordpress": {
        "title": "${locationName} Escort | ${host} Eskort Gacı Bayan Randevu",
        "content": "HTML İÇERİK (H2, H3, strong ve <a href='...'> etiketlerini MUTLAKA persona biçimlendirme kurallarına göre kullan.)",
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

      const wordpress = parsed.wordpress || {
        title: parsed.title || `${locationName} Escort | ${host} Eskort Gacı`,
        content: parsed.content || '',
        meta: parsed.meta || '',
        tags: parsed.tags || [],
        faqs: parsed.faqs || []
      };

      return {
        wordpress,
        github: parsed.github || { readme: '', gist: '' },
        blogger: parsed.blogger || { title: wordpress.title, content: wordpress.content },
        tumblr: parsed.tumblr || { title: wordpress.title, content: wordpress.content }
      };
    } catch (e) {
      console.warn("⚠️ [OMNIAI] JSON parsing failed, returning robust fallback object:", e);
      return {
        wordpress: { title: `${locationName} Escort | ${host} Eskort Gacı`, content: response.normalize('NFC'), meta: '', tags: [], faqs: [] },
        github: { readme: '', gist: '' },
        blogger: { title: `${locationName} Escort`, content: response.normalize('NFC') },
        tumblr: { title: `${locationName} Escort`, content: response.normalize('NFC') }
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
