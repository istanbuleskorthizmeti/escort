import 'dotenv/config';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { siteConfig } from '../config/site';
import * as path from 'path';

puppeteer.use(StealthPlugin());

interface DistrictGeo {
  name: string;
  slug: string;
  lat: number;
  lng: number;
}

const DISTRICT_COORDINATES: DistrictGeo[] = [
  { name: "Karaköy", slug: "karakoy", lat: 41.0224, lng: 28.9734 },
  { name: "Şişli", slug: "sisli", lat: 41.0602, lng: 28.9877 },
  { name: "Beşiktaş", slug: "besiktas", lat: 41.0428, lng: 29.0075 },
  { name: "Kadıköy", slug: "kadikoy", lat: 40.9910, lng: 29.0270 },
  { name: "Esenyurt", slug: "esenyurt", lat: 41.0343, lng: 28.6801 },
  { name: "Beylikdüzü", slug: "beylikduzu", lat: 40.9914, lng: 28.6489 },
  { name: "Bakırköy", slug: "bakirkoy", lat: 40.9783, lng: 28.8720 },
  { name: "Ataşehir", slug: "atasehir", lat: 40.9847, lng: 29.1064 },
  { name: "Ümraniye", slug: "umraniye", lat: 41.0248, lng: 29.1244 },
  { name: "Maltepe", slug: "maltepe", lat: 40.9246, lng: 29.1311 },
  { name: "Sarıyer", slug: "sariyer", lat: 41.1667, lng: 29.0500 }
];

async function conquerDistrict(district: DistrictGeo, targetHost: string, proxyUrl?: string) {
  console.log(`🚀 [CONQUEROR-WORKER] Targeting ${district.name} (${district.lat}, ${district.lng})...`);
  
  const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process'
  ];
  
  const useProxy = proxyUrl && !process.env.SKIP_PROXY_LAUNCH;

  if (useProxy) {
    const rawHost = proxyUrl.replace(/^(http|https|socks5):\/\//, '').split('@').pop();
    args.push(`--proxy-server=${rawHost}`);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(`https://${targetHost}`, ['geolocation']);
    await page.setGeolocation({
      latitude: district.lat,
      longitude: district.lng,
      accuracy: 100
    });

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

    if (useProxy && proxyUrl && proxyUrl.includes('@')) {
      const authPart = proxyUrl.split('@')[0].replace(/^(http|https|socks5):\/\//, '');
      const [username, password] = authPart.split(':');
      if (username && password) {
        await page.authenticate({ username, password });
      }
    }

    const targetUrl = `https://${targetHost}/istanbul/${district.slug}`;
    console.log(`📡 [CONQUEROR-WORKER] Navigating: ${targetUrl}`);
    
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log(`🖱️ [CONQUEROR-WORKER] Scrolling: ${district.name}...`);
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 350));
      await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
    }

    const screenshotPath = path.join(process.cwd(), 'scratch', `conquest_parallel_${district.slug}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 [CONQUEROR-WORKER] Captured: ${screenshotPath}`);
    
  } catch (err: any) {
    console.error(`❌ [CONQUEROR-WORKER ERROR] Failed ${district.name}:`, err.message);
  } finally {
    await browser.close();
  }
}

async function startParallelConquest() {
  console.log('⚔️ [PARALLEL CONQUEROR] Launching Multithreaded local conquest (3 parallel threads)...');
  const targetHost = 'istanbulescort.blog';
  const proxy = process.env.PREMIUM_PROXY_URL;
  
  // Split into chunks of 3 for parallel execution
  const concurrencyLimit = 3;
  for (let i = 0; i < DISTRICT_COORDINATES.length; i += concurrencyLimit) {
    const chunk = DISTRICT_COORDINATES.slice(i, i + concurrencyLimit);
    console.log(`\n🧵 [CONQUEROR] Processing parallel chunk: ${chunk.map(d => d.name).join(', ')}`);
    
    await Promise.all(chunk.map(district => conquerDistrict(district, targetHost, proxy)));
    
    if (i + concurrencyLimit < DISTRICT_COORDINATES.length) {
      console.log('⏳ [CONQUEROR] Chunk complete. Cooldown before next chunk...');
      await new Promise(r => setTimeout(r, 6000));
    }
  }
  
  console.log('🏁 [PARALLEL CONQUEROR] Finished all target districts.');
}

startParallelConquest().catch(console.error);
