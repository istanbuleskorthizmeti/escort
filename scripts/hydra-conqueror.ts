import 'dotenv/config';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { siteConfig } from '../config/site';

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
  console.log(`🚀 [CONQUEROR] Targeting ${district.name} (${district.lat}, ${district.lng})...`);
  
  const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process'
  ];
  
  // Validate and format proxy if present
  // If the premium proxy returns a 407 or has auth issues, we skip proxy argument to prevent navigation blocks
  const useProxy = proxyUrl && 
                   (proxyUrl.startsWith('http://') || proxyUrl.startsWith('https://') || proxyUrl.startsWith('socks5://') || proxyUrl.includes('proxy-cheap.com')) &&
                   !process.env.SKIP_PROXY_LAUNCH;

  if (useProxy) {
    // Remove protocol prefix if it is purely passed to chrome --proxy-server
    const rawHost = proxyUrl.replace(/^(http|https|socks5):\/\//, '').split('@').pop();
    console.log(`📡 [CONQUEROR] Using proxy server: ${rawHost}`);
    args.push(`--proxy-server=${rawHost}`);
  } else {
    console.log('📡 [CONQUEROR] Bypassing proxy server, launching clean direct browser session...');
  }

  const browser = await puppeteer.launch({
    headless: true,
    args
  });

  try {
    const page = await browser.newPage();
    
    // Set custom viewport to simulate standard desktop
    await page.setViewport({ width: 1280, height: 800 });
    
    // Override geolocation permissions and set coords
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(`https://${targetHost}`, ['geolocation']);
    await page.setGeolocation({
      latitude: district.lat,
      longitude: district.lng,
      accuracy: 100
    });

    // Emulate human-like headers
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

    // Parse and handle proxy authentication if credentials exist and proxy is active
    if (useProxy && proxyUrl && proxyUrl.includes('@')) {
      try {
        const authPart = proxyUrl.split('@')[0].replace(/^(http|https|socks5):\/\//, '');
        const [username, password] = authPart.split(':');
        if (username && password) {
          console.log(`🔒 [CONQUEROR] Authenticating proxy tunnel for user: ${username}...`);
          await page.authenticate({ username, password });
        }
      } catch (err: any) {
        console.error('⚠️ [CONQUEROR] Proxy authentication parsing error:', err.message);
      }
    }

    const targetUrl = `https://${targetHost}/istanbul/${district.slug}`;
    console.log(`📡 [CONQUEROR] Navigating to: ${targetUrl}`);
    
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    // Simulate human-like interaction: Scroll down slowly to trigger lazy assets and bypass bot detectors
    console.log(`🖱️ [CONQUEROR] Simulating scrolling engagement for ${district.name}...`);
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 300));
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
    }

    // Capture screenshot for audit/verification
    const screenshotPath = `/root/esc/scratch/conquest_${district.slug}.png`;
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 [CONQUEROR] Captured conquest snapshot: ${screenshotPath}`);

    // Rate limiting delay between requests
    await new Promise(r => setTimeout(r, 3000));
    
  } catch (err: any) {
    console.error(`❌ [CONQUEROR ERROR] Failed to conquer ${district.name}:`, err.message);
  } finally {
    await browser.close();
  }
}

async function startConquest() {
  console.log('⚔️ [CONQUEROR] Starting Hydra Local Conquest (Phase 3 GPS & CTR Engine)...');
  
  // Directly use the active satellite domain that returns 200 OK without redirecting
  const targetHost = 'istanbulescort.blog';
  console.log(`📡 [CONQUEROR] Targeted Conquest Domain: ${targetHost}`);

  const proxy = process.env.PREMIUM_PROXY_URL;
  
  for (const district of DISTRICT_COORDINATES) {
    await conquerDistrict(district, targetHost, proxy);
  }
  
  console.log('🏁 [CONQUEROR] All districts targeted successfully.');
}

if (require.main === module) {
  startConquest().then(() => process.exit(0)).catch(console.error);
}
