
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { exec } from 'child_process';
import { promisify } from 'util';

puppeteer.use(StealthPlugin());
const execAsync = promisify(exec);

/**
 * 🧛‍♂️ TOR TRAFFIC MONSTER v1.0
 * Onion Network üzerinden siteye anonim trafik basar.
 */

const TARGET_URL = "https://bit.ly/dorukcanmanay";

async function changeTorIdentity() {
    try {
        // TOR servisine yeni bir kimlik (IP) alması için sinyal gönderir
        await execAsync('echo "SIGNAL NEWNYM" | nc -q 1 localhost 9051');
        console.log('🔄 [TOR] Identity Changed (New IP Generated)');
    } catch (err) {
        console.error('❌ TOR Signal Failed (Make sure TOR is running with ControlPort)');
    }
}

async function sendOnionVisit() {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--proxy-server=socks5://127.0.0.1:9050' // TOR SOCKS5 Proxy
        ]
    });

    try {
        const page = await browser.newPage();
        console.log(`📡 [ONION] Visiting: ${TARGET_URL}`);
        
        await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // Rastgele gezinme
        await page.evaluate(() => window.scrollBy(0, Math.random() * 500));
        await new Promise(r => setTimeout(r, 10000 + Math.random() * 20000));
        
        console.log('✅ Visit Success via TOR');
    } catch (err: any) {
        console.error('❌ Onion Visit Failed:', err.message);
    } finally {
        await browser.close();
    }
}

async function startMonster() {
    console.log('👹 [MONSTER] TOR Traffic Simulation Started...');
    while (true) {
        await changeTorIdentity();
        await sendOnionVisit();
        const wait = 30 + Math.random() * 60;
        console.log(`😴 Waiting ${Math.round(wait)}s for next ghost visit...`);
        await new Promise(r => setTimeout(r, wait * 1000));
    }
}

startMonster().catch(console.error);
