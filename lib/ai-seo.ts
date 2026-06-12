import { omniAI } from './ai-provider';
import { getPersonaForHost, PERSONAS } from './persona-engine';
import { cities } from './locations';
import { turkishToLower, turkishToUpper } from './utils';

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
      const firstChar = word.charAt(0);
      const rest = word.slice(1);

      const upperFirst = turkishToUpper(firstChar);
      const lowerRest = turkishToLower(rest);

      return upperFirst + lowerRest;
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

/**
 * 🎯 KGR KEYWORD GENERATOR
 * Returns exact long-tail zero-competition query targets for regional optimization.
 */
export function getKgrKeywords(city: string, district?: string, neighborhood?: string): string[] {
  const name = getProperTurkishName(neighborhood || district || city);
  return [
    `${turkishToLower(name)} kaporasız escort telefon numaraları`,
    `${turkishToLower(name)} otelde hizmet veren eskort bayanlar`,
    `${turkishToLower(name)} vip escort bayan whatsapp ilanları`,
    `${turkishToLower(name)} evine gelen üniversiteli eskortlar`
  ];
}

export interface AiContentParams {
  city: string;
  district?: string;
  neighborhood?: string;
  host: string;
  nicheType?: string;
  category?: string;
  cloakedUrl?: string;
  searchIntent?: 'informational' | 'transactional' | 'commercial';
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
  topicCluster?: Array<{ anchor: string; path: string; rationale: string }>;
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
  searchIntent = 'commercial',
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
  
  const kgrKeywords = getKgrKeywords(city, district, neighborhood);

  const systemPrompt = `
    [GEMINI ELITE CORE - PERSONA-BASED UNDETECTABLE AI & ADVANCED LSI]
    Görevin: Arama motoru algoritmalarının ve yapay zeka içerik tespit (AI Detection) sistemlerinin asla anlayamayacağı derecede insansı, yüksek kelime dağarcığı derinliğine (Perplexity) ve değişken cümle yapılarına (Burstiness) sahip, son derece özgün ve yüksek dönüşüm oranlı (conversion rate) SEO metinleri üretmek.
    
    🔴 NOTEBOOKLM SEO DİREKTİFLERİ:
    - Metin asla tekdüze (monoton) bir ritimle akmamalıdır. Çok uzun ve sanatsal/teknik betimleme cümlelerinin hemen ardına 1-3 kelimelik kısa ve keskin yargı cümleleri ("Asla.", "Sadece o.", "Gizlice.") yerleştirilerek insansı yazım ritmi (Burstiness) taklit edilecektir.
    - Metinde "Öncelikle", "Ek olarak", "Bununla birlikte", "Sonuç olarak", "Özetlemek gerekirse" gibi bariz yapay zeka bağlaç ve geçiş ifadeleri KESİNLİKLE YASAKTIR. Bunlar yerine paragraf geçişleri doğrudan, keskin ve konusal geçişlerle yapılmalıdır.

    🔴 KEYWORD GOLDEN RATIO (KGR) & LOW-COMPETITION DOMINANCE:
    - KGR Formülü: (allintitle arama sonuç sayısı) / (aylık arama hacmi) < 0.25.
    - Aşağıda listelenen ZORUNLU KGR kelimelerini metnin başlığında (title), en az bir H2 başlığında ve ilk 100 kelimede (giriş paragrafında) tam eşleşme (exact match) olarak konumlandır.
    - ZORUNLU KGR ANAHTAR KELİMELERİ:
      1. ${kgrKeywords[0]}
      2. ${kgrKeywords[1]}
      3. ${kgrKeywords[2]}
      4. ${kgrKeywords[3]}

    🔴 INTENT ALIGNMENT (Arama Niyeti: ${searchIntent.toUpperCase()}):
    - İçeriğin üslubunu ve yapısını kesinlikle bu arama niyetine göre uyarla:
      * informational: Bilgi verici, rehber tadında, sıkça sorulan soruları derinlemesine yanıtlayan, nesnel ton.
      * commercial: Karşılaştırmalı listeler, model profillerini inceleyen, avantaj/dezavantaj belirten, karar vermeye yardımcı ton.
      * transactional: Doğrudan eylem odaklı, rezervasyon adımlarını anlatan, VIP randevu çağrısı yapan yüksek dönüşümlü ton.

    🔴 SEMANTIC INTEGRITY (LSI Yalanını Bırak, Konuyu Kapsa):
    - Kelimeleri metne yapay şekilde tıkıştırma (LSI keyword stuffing yapma). Konuyu bir bütün olarak doğal ve zengin bir dille ele al.
    - Google'ın semantik motorunun bu sayfanın değerini anlaması için, ${locationName} bölgesini şu lokal semantik varlıkları kullanarak gerçekçi bir şekilde betimle: ${semanticEntities}.

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
      "wordpress_kgr": ["Bu metinde hedeflenen KGR anahtar kelimeleri dizisidir. Başlık ve içerikteki H2'lerle tam eşleştiğini doğrula."],
      "blogger": { "title": "${locationName} Eskort Gacı Bayan Raporu", "content": "..." },
      "topicCluster": [
        {
          "anchor": "Anahtar Kelime / Bağlantı Metni (Örn: Fulya Escort)",
          "path": "Gideceği göreceli URL (Örn: /istanbul/sisli/fulya)",
          "rationale": "Bu bağlantının neden kurulması gerektiğine dair semantik gerekçe (Örn: Şişli ana sayfasından Fulya mahallesine yetki aktarımı.)"
        }
      ]
    }
  `;

  const userPrompt = `
    Lokasyon: ${fullLoc}. Odak: ${semanticEntities}. Arama Niyeti: ${searchIntent}. Hedef KGR Kelimeleri: ${kgrKeywords.join(', ')}. Benzersizlik tohumu (Seed): ${host}-${locationName}-${targetLength}. Uzunluk: ~${targetLength} kelime. JSON DÖNDÜR.
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
        tumblr: parsed.tumblr || { title: wordpress.title, content: wordpress.content },
        topicCluster: parsed.topicCluster || []
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
