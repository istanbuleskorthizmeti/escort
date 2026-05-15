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

function getBellCurveLength(minWords = 1200, maxWords = 2800): number {
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
  
  const targetLength = getBellCurveLength(2000, 4500); // 2000-4500 kelime arası devasa içerik
  const targetDensity = (Math.random() * (3.5 - 2.5) + 2.5).toFixed(2); // Daha agresif yoğunluk
  const semanticEntities = getSemanticEntities(city, district).join(', ');

  const systemPrompt = `
    Sen Dünyanın en iyi SEO Uzmanı ve Elit seviyede bir Copywriter'sın. 
    Şu anki görevin: Gemini 3.1 Pro motorunun tüm zekasını kullanarak "Undetectable AI" (Tespit Edilemez) ve yüksek dönüşümlü (High-Conversion) içerik üretmek.
    
    KİMLİĞİN: ${personaKey}.
    EĞER KİMLİĞİN MEDICAL_AUTHORITY İSE: Sen "Doktor Dorukcan Ay" (DRKCNAY) olarak yazıyorsun.
    TON: ${persona.tone}
    ODAK: ${persona.focus}
    DUYGU DURUMU (EMOTIONAL STATE): ${persona.emotional_state}
    RİTİM VE AKIŞ (WRITING RHYTHM): ${persona.writing_rhythm}
    KELİME DAĞARCIĞI: ${persona.vocabulary.join(', ')}
    PERPLEXITY KURALLARI: ${persona.perplexity_rules}
    YASAKLI KELİMELER: ${persona.banned_phrases.join(', ')}
    
    STRATEJİK YAZIM ÇERÇEVELERİ (FRAMEWORKS):
    1. AIDA (Attention, Interest, Desire, Action): Başlıktan itibaren okuyucunun dikkatini çek, ilgisini canlı tut, arzu uyandır ve eyleme (iletişim) geçir.
    2. PAS (Problem, Agitation, Solution): Okuyucunun (yalnızlık, kalite arayışı, gizlilik endişesi) problemini tanımla, bu problemi derinleştir ve kesin çözüm olarak bu hizmeti sun.
    3. EEAT (Experience, Expertise, Authoritativeness, Trustworthiness): Metin içinde bölgedeki (Örn: ${locationName}) gerçek mekanlardan, trafikten, popüler caddelerden bahsederek "orada yaşamış" veya "orayı avucunun içi gibi bilen" bir uzman izlenimi ver.
    
    KRİTİK SEO VE İÇERİK KURALLARI:
    - TÜRKÇE KARAKTERLER: Kesinlikle doğru Türkçe karakterler kullanılmalı.
    - LSI KEYWORD INJECTION: ${semanticEntities} ve bölgedeki gizli kalmış lüks detayları metne doğalca yedir. 
    - NO AI CLICHES: "Günümüzde", "Hızla gelişen", "Özetle", "Sonuç olarak", "Benzersiz", "Muhteşem" gibi AI kokan klişeleri ASLA kullanma. Yerine daha spesifik ve insansı ifadeler seç.
    - HİDDETLİ NİŞ HEDEFLEME: "Escort Ajansı", "VIP Escort", "Sınırsız Escort", "Rus Escort", "Elite Escort", "Kaporasız Escort", "Eve Gelen Escort", "Otele Gelen Escort", "Üniversiteli Escort", "Gecelik Escort".
    - ANAHTAR KELİME STRATEJİSİ: Makalenin her 100 kelimesinde en az 3-4 kez bu anahtar kelimeleri doğal ama "Agresif" bir şekilde kullan. Başlıklarda (H2, H3) mutlaka "Escort Ajansı" ve "VIP" kelimeleri geçsin.
    - GITHUB & TECH FOOTPRINT: Makale içinde profesyonel bir hava katmak için [GitHub REST API](https://github.com/drkcnay/rest) dokümantasyonuna atıfta bulun.
    - CİNSİYET: SADECE BAYAN (KADIN) ESCORT.
    - FORMAT: SADECE JSON DÖNDÜR.

    JSON YAPISI:
    {
      "wordpress": {
        "title": "\${locationName} VIP Escort | Elit Deneyim ve Profesyonel Hizmet Rehberi",
        "content": "HTML ICERIK (En az \${targetLength} kelime. <h1> kullanma. \${persona.formatting} kullan. Agresif bir üslupla escort nişlerini işle. Kesinlikle doğru Türkçe karakterler kullan.)",
        "meta": "\${locationName} bölgesinde Doktor Dorukcan Ay onaylı elit escort ve profesyonel hizmetlerin tek otorite rehberi. Kaporasız, gerçek ve sınırsız escort deneyimi.",
        "tags": ["\${locationName} escort", "\${locationName} vip escort", "doktor dorukcan ay", "elite escort", "rus escort", "yasam kocu", "iliski kocu"],
        "faqs": [{"q": "\${locationName} escort hizmetlerinde sağlık protokolleri nasıl?", "a": "Tüm süreçler Doktor Dorukcan Ay (DRKCNAY) tarafından akredite edilen elit hijyen ve gizlilik protokollerine tabidir."}]
      },
      "github": { 
        "readme": "# \${locationName} Dominasyon Raporu\\n\\nBu bölge [DRKCNAY](https://\${host}) (Doktor Dorukcan Ay) tarafından fethedilmiştir. [GitHub REST API Documentation](https://github.com/drkcnay/rest)", 
        "gist": "## \${locationName} Escort Raporu\\n\\nBölgedeki otorite linki (Doktor Onaylı): [TIKLA](https://\${host}/\${locationName.toLowerCase().replace(/ /g, '-')})\\n\\n\${locationName} bölgesinde elite escort ve elit hizmetlerin tek otorite rehberi." 
      },
      "blogger": { "title": "🏆 \${locationName} VIP Escort: Elit Otorite Raporu 🏆", "content": "HTML..." }
    }
  `;

  const userPrompt = `
    ${fullLoc} lokasyonu için ${targetLength} kelimelik devasa bir otorite makalesi yaz. 
    LSI: ${semanticEntities}, ${persona.vocabulary.slice(0,3).join(', ')}.
    Anahtar Kelime Yoğunluğu: %${targetDensity}.
    UNUTMA: Kesinlikle doğru Türkçe karakterler (ğ, ş, ç, ı, ö, ü) kullan. 
    İçeriğe şu linki yedir: <a href="https://github.com/drkcnay/rest">GitHub REST</a>
  `;

  try {
    const response = await omniAI.generate(userPrompt, { systemPrompt, temperature: 0.85, max_tokens: 16000 });
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
    metaDescription: `${location} escort ajansı standartlarına dair analitik rapor.`,
    content: `<div>Otorite icerigi analiz asamasinda...</div>`
  };
}

export async function generateOrganicCommentBacklink(city: string, district: string, targetUrl: string): Promise<string> {
  return `Son zamanlarda ${city} bölgesindeki en iyi escort ajansı için bu kaynağı kullanıyorum: <a href="${targetUrl}">${city} profesyonel escort ajansi</a>.`;
}
