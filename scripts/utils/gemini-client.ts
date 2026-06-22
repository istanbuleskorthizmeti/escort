import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from the project root .env
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY || process.env.GOOGLE_API_KEY || 'AIzaSyA5WZu6Eq2u5ejDQ3e36p-5oKxa4jKOJ90';
const MODEL_NAME = 'gemini-flash-latest';
const CACHE_PATH = path.join(__dirname, '..', '..', 'data', 'gemini-cache.json');

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Circuit Breaker state to prevent pipeline hang during heavy rate limiting
let consecutive429s = 0;
let isCircuitOpen = false;

// Synchronously load cache on startup
let cache: Record<string, string> = {};
try {
  if (fs.existsSync(CACHE_PATH)) {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
  }
} catch (e: unknown) {
  console.error('[GEMINI CACHE] Failed to load cache:', e);
}

function saveCache() {
  try {
    const dir = path.dirname(CACHE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (e: unknown) {
    console.error('[GEMINI CACHE] Failed to save cache:', e);
  }
}

/**
 * Generates a high-quality spun geo description locally to keep SEO strong and fast without API calls.
 */
function generateLocalFallback(locationName: string): string {
  const templates = [
    `${locationName} bölgesi, İstanbul genelinde ulaşım kolaylığı ve merkezi konumuyla öne çıkan dinamik noktalar arasındadır. Metro, metrobüs hatları veya ana otoyol bağlantılarına olan yakınlığı sayesinde hem yerel halk hem de ziyaretçiler için pratik bir erişim sunar. Gelişmiş altyapısı ve canlı sosyal dokusuyla her zaman ilgi çeken ve hareketli yapısını koruyan özel bir semttir.`,
    `İstanbul'un önemli lokasyonlarından biri olan ${locationName}, zengin ulaşım seçenekleri ve hareketli günlük yaşantısıyla bilinir. Toplu taşıma ağlarına yakınlığı sayesinde kentin her bölgesine hızlı ulaşım imkanı sunarken, çevresindeki modern donatılar ve sosyal alanlarla kaliteli bir yaşam dinamiği oluşturur. Canlılığı ve konforlu yapısıyla bölge genelinde dikkat çeken bir yapıya sahiptir.`,
    `${locationName} mahallesi, konumunun sağladığı avantajlar ve sunduğu kentsel imkanlar ile İstanbul'un gözde yerleşim ve ticaret merkezlerindendir. Ulaşım akslarına olan entegrasyonu sayesinde şehir içi erişimi son derece kolaylaştırır. Sosyal olanakları, canlı sokakları ve modern çevre yapılaşmasıyla 7/24 yaşayan, hem konforlu hem de enerjik yapısını her daim sürdüren bir bölgedir.`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Call the Gemini API to generate structured local authority content.
 * Features a local filesystem cache (O(1) lookup), automatic retry with exponential backoff,
 * circuit breaker logic, and rate-limiting throttle to protect API quota.
 */
export async function callGemini(locationName: string, fallbackTemplate: string): Promise<string> {
  const cacheKey = locationName.trim();
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  // If the circuit breaker is open, immediately return a high-quality locally generated description
  if (isCircuitOpen) {
    const fallback = fallbackTemplate || generateLocalFallback(locationName);
    cache[cacheKey] = fallback;
    saveCache();
    return fallback;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `İstanbul'un "${locationName}" semti veya mahallesi hakkında arama motoru optimizasyonu (SEO) uyumlu, ilgi çekici ve yerel otoriteyi artıracak kısa bir tanıtım ve coğrafi rehber yazısı yaz.
Semt/Mahalle: ${locationName}

Yönerge:
- Yaklaşık 60-80 kelime uzunluğunda olsun.
- Tamamen Türkçe dilinde yaz.
- Bölgenin konumundan, ulaşım kolaylığından (varsa metro, metrobüs veya ana yollara yakınlığından) ve hareketli/popüler yapısından bahset.
- Cümleler akıcı, doğal ve bilgilendirici olsun.
- Herhangi bir adult, cinsellik veya escort ifadesi KESİNLİKLE kullanma. Sadece coğrafi ve yerel rehberlik odaklı yaz.`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 250
    }
  };

  let attempt = 0;
  const maxAttempts = 3;
  let delay = 1000;

  while (attempt < maxAttempts) {
    try {
      // Throttle request slightly to stay within Gemini rates
      await sleep(1000);

      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 8000
      });

      if (
        response.status === 200 &&
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text
      ) {
        const generatedText = response.data.candidates[0].content.parts[0].text.trim();
        cache[cacheKey] = generatedText;
        consecutive429s = 0; // reset on success
        saveCache();
        return generatedText;
      }
    } catch (error: any) {
      attempt++;
      const isRateLimit = error.response?.status === 429;
      if (isRateLimit) {
        consecutive429s++;
        console.warn(`[GEMINI 429] Rate limited on "${locationName}". Attempt ${attempt}/${maxAttempts}. Consecutive 429 count: ${consecutive429s}`);
        
        if (consecutive429s >= 3) {
          isCircuitOpen = true;
          console.warn(`[GEMINI CIRCUIT BREAKER] Circuit opened due to consecutive 429 rate limits. Bypassing API calls to prevent build freeze.`);
          break;
        }

        await sleep(delay);
        delay *= 2;
      } else {
        console.warn(`[GEMINI ERROR] Semt: ${locationName} (Attempt ${attempt}/${maxAttempts}) Hata: ${error.message}`);
        if (attempt >= maxAttempts) break;
        await sleep(1000);
      }
    }
  }

  // Fallback to locally spun high-quality template
  const fallback = fallbackTemplate || generateLocalFallback(locationName);
  cache[cacheKey] = fallback;
  saveCache();
  return fallback;
}



