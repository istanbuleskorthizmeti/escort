
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { ProxyHandler } from '../lib/seo/proxy-handler';

puppeteer.use(StealthPlugin());

/**
 * 🧛‍♂️ RESIDENTIAL TRAFFIC MONSTER v2.0
 * Premium Proxy-Cheap altyapısı ile güvenli ve organik trafik simülasyonu.
 */

const TARGET_URL = "https://bit.ly/dorukcanmanay";

async function sendSafeVisit() {
    // 🛡️ Proxy URL'ini al (Rotasyon aktif)
    const proxyUrl = ProxyHandler.getProxyUrl(true);
    
    const launchArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox'
    ];

    if (proxyUrl) {
        launchArgs.push(`--proxy-server=${proxyUrl}`);
        console.log(`📡 [SAFE-TRAFFIC] Using Residential Proxy: ${proxyUrl.split('@')[1] || 'Hidden'}`);
    } else {
        console.warn(`⚠️ [SAFE-TRAFFIC] No proxy found! Check .env (PREMIUM_PROXY_URL)`);
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: launchArgs
    });

    try {
        const page = await browser.newPage();
        
        // 🕵️‍♂️ Random User-Agent
        const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
        await page.setUserAgent(ua);

        console.log(`🌐 [SAFE-TRAFFIC] Visiting: ${TARGET_URL}`);
        
        await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // 🧠 AI Behavior Simulation (DeepSeek Logic)
        const scrollAmount = Math.floor(Math.random() * 600) + 200;
        await page.evaluate((y) => window.scrollBy(0, y), scrollAmount);
        
        const dwellTime = 15000 + Math.random() * 30000;
        console.log(`📄 Reading for ${Math.round(dwellTime/1000)}s...`);
        await new Promise(r => setTimeout(r, dwellTime));
        
        console.log('✅ Visit Successfully Completed via Residential IP.');

    } catch (err: any) {
        console.error('❌ Visit Failed:', err.message);
    } finally {
        await browser.close();
    }
}

async function startSafeMonster() {
    console.log('🛡️ [SAFE-MONSTER] Residential Traffic Engine Started...');
    while (true) {
        await sendSafeVisit();
        // 1-3 dakika arası rastgele bekleme (Doğallık için)
        const wait = 60 + Math.random() * 120;
        console.log(`😴 Cooling down for ${Math.round(wait)}s...`);
        await new Promise(r => setTimeout(r, wait * 1000));
    }
}

startSafeMonster().catch(console.error);
