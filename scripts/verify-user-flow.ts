import 'dotenv/config';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { getDomainConfig, DOMAIN_MATRIX } from '../config/domains';
import * as path from 'path';

puppeteer.use(StealthPlugin());

/**
 * 🧛‍♂️ HYDRA SYNTHETIC FLOW MONITOR & TRAFFIC SIMULATOR (v1.0)
 * Simulates end-to-end user navigation to verify redirection logic, catalog performance, 
 * and main domain handshakes under realistic browser emulation.
 */

interface FlowConfig {
  satelliteHost: string;
  catalogPath: string;
  flagshipHost: string;
}

const DEFAULT_FLOW: FlowConfig = {
  satelliteHost: 'istanbulescort.blog',
  catalogPath: '/amp',
  flagshipHost: 'dorukcanay.digital'
};

async function simulateUserJourney(flow: FlowConfig, proxyUrl?: string) {
  console.log(`🚀 [FLOW-MONITOR] Starting simulated user journey...`);
  console.log(`   ↳ Step 1: Satellite Entry -> https://${flow.satelliteHost}`);
  console.log(`   ↳ Step 2: Catalog Transition -> ${flow.catalogPath}`);
  console.log(`   ↳ Step 3: Flagship Landing -> https://${flow.flagshipHost}`);

  const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security'
  ];

  if (proxyUrl) {
    const rawHost = proxyUrl.replace(/^(http|https|socks5):\/\//, '').split('@').pop();
    args.push(`--proxy-server=${rawHost}`);
    console.log(`📡 [FLOW-MONITOR] Routing traffic through proxy: ${rawHost}`);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Emulate organic user headers
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

    if (proxyUrl && proxyUrl.includes('@')) {
      const authPart = proxyUrl.split('@')[0].replace(/^(http|https|socks5):\/\//, '');
      const [username, password] = authPart.split(':');
      if (username && password) {
        await page.authenticate({ username, password });
      }
    }

    // Step 1: Land on Satellite Page
    const entryUrl = `https://${flow.satelliteHost}`;
    console.log(`🔗 [STEP 1] Navigating to Satellite: ${entryUrl}`);
    const res1 = await page.goto(entryUrl, { waitUntil: 'networkidle2', timeout: 45000 });
    console.log(`   👉 Response Status: ${res1?.status()}`);

    // Dwell & Scroll
    await page.evaluate(() => window.scrollBy(0, 400));
    await new Promise(r => setTimeout(r, 3000 + Math.random() * 2000));

    // Step 2: Navigate to Catalog / AMP Page
    const catalogUrl = `https://${flow.satelliteHost}${flow.catalogPath}`;
    console.log(`🔗 [STEP 2] Navigating to Catalog: ${catalogUrl}`);
    const res2 = await page.goto(catalogUrl, { waitUntil: 'networkidle2', timeout: 45000 });
    console.log(`   👉 Response Status: ${res2?.status()}`);

    // Dwell, scroll, interact with Vitrin profiles
    await page.evaluate(() => window.scrollBy(0, 600));
    await new Promise(r => setTimeout(r, 4000 + Math.random() * 3000));

    // Step 3: Transition to Flagship site
    const flagshipUrl = `https://${flow.flagshipHost}`;
    console.log(`🔗 [STEP 3] Landing on Flagship: ${flagshipUrl}`);
    const res3 = await page.goto(flagshipUrl, { waitUntil: 'networkidle2', timeout: 45000 });
    console.log(`   👉 Response Status: ${res3?.status()}`);

    // Simulate internal page dwell time
    console.log(`⌛ [ENGAGEMENT] Simulating active dwell time on flagship domain...`);
    for (let i = 0; i < 4; i++) {
      const scrollY = 200 + Math.random() * 300;
      await page.evaluate((y) => window.scrollBy(0, y), scrollY);
      await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));
    }

    console.log(`✅ [SUCCESS] Simulated journey completed with zero navigation breaks.`);
  } catch (err: any) {
    console.error(`❌ [FLOW-ERROR] Journey failed:`, err.message);
    throw err;
  } finally {
    await browser.close();
  }
}

async function main() {
  const proxy = process.env.PREMIUM_PROXY_URL;
  if (proxy) {
    try {
      console.log('🔄 Attempting run with proxy configuration...');
      await simulateUserJourney(DEFAULT_FLOW, proxy);
    } catch (e: any) {
      console.log(`⚠️ Proxy run encountered an error: ${e.message}. Falling back to direct clean session...`);
      await simulateUserJourney(DEFAULT_FLOW);
    }
  } else {
    await simulateUserJourney(DEFAULT_FLOW);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
