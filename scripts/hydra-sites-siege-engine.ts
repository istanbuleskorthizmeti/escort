import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { ISTANBUL_NEIGHBORS } from '../lib/seo/neighborhood-map';
import { TelegramService } from '../lib/crm/telegram';
import path from 'path';
import os from 'os';
import fs from 'fs';

puppeteer.use(StealthPlugin());

/**
 * 🧛‍♂️ HYDRA GOOGLE SITES SIEGE ENGINE (ULTRA-ROBUST v6.0 - WATCHDOG READY)
 * Optimized for RDP stability and automated re-runs.
 */

const STATE_FILE = path.join(process.cwd(), 'data', 'siege_state.json');
const RETRY_LIMIT = 2;

interface SiegeState {
    round: number;
    completed: string[];
    lastUpdate: string;
}

function loadState(): SiegeState {
    if (fs.existsSync(STATE_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        } catch (e) {
            console.error("⚠️ Error reading state file, starting fresh.");
        }
    }
    return { round: 1, completed: [], lastUpdate: new Date().toISOString() };
}

function saveState(state: SiegeState) {
    state.lastUpdate = new Date().toISOString();
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

async function runSiege() {
    const state = loadState();
    
    while (true) { // 🧛‍♂️ INFINITE GOD MODE WATCHDOG
        let browser;
        try {
            const allDistricts = Object.keys(ISTANBUL_NEIGHBORS);
            const pendingDistricts = allDistricts.filter(d => !state.completed.includes(d));

            if (pendingDistricts.length === 0) {
                console.log("🏁 All districts completed! Victory is ours.");
                process.exit(0);
            }

            const districtSlug = pendingDistricts[0];
            console.log(`🏴‍☠️ [GOD MODE] Targeting: ${districtSlug.toUpperCase()}`);

            const userDataDir = path.join(process.cwd(), 'data', 'hydra_god_chrome');
            const chromePath = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

            if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

            browser = await puppeteer.launch({
                headless: false,
                userDataDir: userDataDir,
                executablePath: chromePath,
                defaultViewport: { width: 1366, height: 768 },
                args: [
                    '--start-maximized',
                    '--disable-blink-features=AutomationControlled',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--force-device-scale-factor=1'
                ]
            });

            const [page] = await browser.pages();
            
            // 🛡️ LOGIN CHECK
            await page.goto('https://sites.google.com/new', { waitUntil: 'load', timeout: 120000 });
            if (page.url().includes('signin')) {
                console.log("⚠️ [ACTION] Lutfen GIRIS YAP.");
                await page.waitForFunction(() => !window.location.href.includes('signin'), { timeout: 0 });
                await page.goto('https://sites.google.com/new', { waitUntil: 'load', timeout: 120000 });
            }


            // Execute the step
            await executeSiegeStep(page, districtSlug, state.round);
            
            // SUCCESS
            state.completed.push(districtSlug);
            saveState(state);
            console.log(`✅ [SUCCESS] ${districtSlug} pinned to the mesh.`);
            
            await browser.close();
            await new Promise(r => setTimeout(r, 5000)); // Cool down

        } catch (err: any) {
            console.error(`💥 [ERROR] God Mode encountered a glitch: ${err.message}`);
            if (browser) {
                try { await browser.close(); } catch (e) {}
            }
            console.log("⏳ Restarting engine in 10s...");
            await new Promise(r => setTimeout(r, 10000));
        }
    }
}


async function executeSiegeStep(page: any, districtSlug: string, round: number) {
    const neighbors = ISTANBUL_NEIGHBORS[districtSlug];
    const districtName = districtSlug.charAt(0).toUpperCase() + districtSlug.slice(1);
    const title = generateTitle(districtName, neighbors, round);
    const publishSlug = `${districtSlug}escort-drkcnay${round}-${Math.floor(Math.random() * 1000)}`;

    console.log(`🚀 [GOD MODE] ${districtName} operasyonu basladi...`);

    // 1. Create Site (Dashboard already loaded)
    console.log("🖱️ '+' (Yeni site) butonuna tiklaniyor...");
    const createSelectors = [
        '[aria-label="Create new site"]', '[aria-label="Yeni site oluştur"]', '[aria-label="Boş"]',
        '.docs-homescreen-templates-templateview-preview', '[data-tooltip="Create new site"]'
    ];
    
    // Wait for at least one to appear
    await page.waitForSelector(createSelectors.join(','), { timeout: 60000 });

    const clicked = await page.evaluate((selList: string[]) => {
        for (const sel of selList) {
            const el = document.querySelector(sel) as HTMLElement;
            if (el) { el.click(); return true; }
        }
        return false;
    }, createSelectors);

    if (!clicked) throw new Error("COULD_NOT_FIND_CREATE_BUTTON");
    
    console.log("⏳ Editorun yuklenmesi bekleniyor (Balyoz Mod)...");
    
    let editorLoaded = false;
    let clickAttempts = 0;

    while (!editorLoaded && clickAttempts < 3) {
        // Wait for navigation OR the appearance of the editor input
        const result = await Promise.race([
            page.waitForNavigation({ waitUntil: 'load', timeout: 20000 }).then(() => 'nav'),
            page.waitForSelector('input[aria-label="Document name"], input[aria-label="Doküman adı"]', { timeout: 20000 }).then(() => 'selector'),
            new Promise(r => setTimeout(r, 21000)).then(() => 'timeout')
        ]);

        if (result !== 'timeout') {
            editorLoaded = true;
        } else {
            clickAttempts++;
            console.log(`⚠️ Editor acilmadi, tekrar tiklaniyor (Deneme ${clickAttempts})...`);
            await page.evaluate((selList: string[]) => {
                for (const sel of selList) {
                    const el = document.querySelector(sel) as HTMLElement;
                    if (el) {
                        el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                        el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                        el.click();
                        return true;
                    }
                }
                return false;
            }, createSelectors);
        }
    }

    if (!editorLoaded) throw new Error("EDITOR_LOAD_TIMEOUT_AFTER_RETRIES");

    // Handle potential new tab
    const pages = await page.browser().pages();
    if (pages.length > 2) {
        console.log("📑 Yeni sekme algilandi, oraya geciliyor...");
        page = pages[pages.length - 1];
        await page.bringToFront();
    }

    await new Promise(r => setTimeout(r, 8000));
    console.log("✅ Editor hazir!");


    // 2. Set Document Name
    console.log(`✍️ Baslik yaziliyor: ${title}`);

    const nameSelector = 'input[aria-label="Document name"], input[aria-label="Doküman adı"]';
    await page.waitForSelector(nameSelector, { timeout: 30000 });
    await page.type(nameSelector, title);
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 4000));

    // 3. Embed Content
    console.log("🔗 Yerlestirme (Embed) menusu aciliyor...");
    const embedClicked = await page.evaluate(() => {
        const selectors = ['[aria-label="Embed"]', '[aria-label="Yerleştir"]', '[data-tooltip="Yerleştir"]'];
        for (const sel of selectors) {
            const el = document.querySelector(sel) as HTMLElement;
            if (el) { el.click(); return true; }
        }
        return false;
    });
    if (!embedClicked) throw new Error("COULD_NOT_FIND_EMBED_BUTTON");
    
    await page.waitForSelector('div[role="tablist"] div:nth-child(2)', { timeout: 15000 });
    await page.evaluate(() => (document.querySelectorAll('div[role="tablist"] div')[1] as HTMLElement).click());
    
    const tagPool = generateTagPool(districtName, neighbors);
    const embedCode = `
        <div style="width:100%; height:2000px; overflow:hidden;">
            <iframe src="https://istanbulescort.blog/" width="100%" height="2000px" frameborder="0"></iframe>
        </div>
        <div style="margin-top:20px; font-size:12px; color:#666; font-family: sans-serif;">
            <h3>${districtName} Escort Rehberi Anahtar Kelimeler</h3>
            <p>${tagPool}</p>
        </div>
    `.trim();

    console.log("📝 Iframe ve Tag kodlari yapistiriliyor...");
    await page.waitForSelector('textarea', { timeout: 15000 });
    await page.type('textarea', embedCode);
    
    console.log("➡️ 'Ileri' butonuna tiklaniyor...");
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const next = btns.find(b => ['next', 'ileri', 'sonraki'].some(t => b.textContent?.toLowerCase().includes(t)));
        if (next) next.click();
    });
    await new Promise(r => setTimeout(r, 4000));
    
    console.log("📥 'Ekle' butonuna tiklaniyor...");
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const insert = btns.find(b => ['insert', 'ekle'].some(t => b.textContent?.toLowerCase().includes(t)));
        if (insert) insert.click();
    });
    await new Promise(r => setTimeout(r, 5000));

    // 4. PUBLISH FLOW
    console.log("📡 'Yayinla' (Publish) baslatiliyor...");
    await page.evaluate(() => {
        const selectors = ['[aria-label="Publish"]', '[aria-label="Yayınla"]', '[data-tooltip="Yayınla"]'];
        for (const sel of selectors) {
            const el = document.querySelector(sel) as HTMLElement;
            if (el) { el.click(); return true; }
        }
    });
    
    await page.waitForSelector('input[name="site-url"]', { timeout: 15000 });
    console.log(`🔗 Web adresi ayarlaniyor: ${publishSlug}`);
    await page.type('input[name="site-url"]', publishSlug);
    await new Promise(r => setTimeout(r, 4000));

    // CLICK FINAL PUBLISH
    console.log("🚀 FINAL: Yayina aliniyor...");
    const published = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const pub = btns.find(b => b.textContent?.toLowerCase() === 'yayınla' || b.textContent?.toLowerCase() === 'publish');
        if (pub) { pub.click(); return true; }
        return false;
    });

    if (!published) throw new Error("FINAL_PUBLISH_FAILED");

    // 5. Wait & Verification
    console.log("⏳ Yayinin aktiflesmesi bekleniyor (15sn)...");
    await new Promise(r => setTimeout(r, 15000));
    
    const liveUrl = `https://sites.google.com/view/${publishSlug}`;
    
    // Save live URL for Tier 2 Bombardment
    const G_SITES_FILE = path.join(process.cwd(), 'data', 'live_google_sites.json');
    let liveSites: string[] = [];
    if (fs.existsSync(G_SITES_FILE)) {
        try { liveSites = JSON.parse(fs.readFileSync(G_SITES_FILE, 'utf8')); } catch (e) {}
    }
    if (!liveSites.includes(liveUrl)) {
        liveSites.push(liveUrl);
        fs.writeFileSync(G_SITES_FILE, JSON.stringify(liveSites, null, 2));
    }

    await TelegramService.sendMessage(`✅ <b>HYDRA SIEGE: GOD MODE</b>\n🎯 ${districtName}\n🔄 Round: ${round}\n🔗 ${liveUrl}\n🔥 Status: LIVE`);
}



async function findButton(page: any, texts: string[]) {
    const buttons = await page.$$('button');
    for (const btn of buttons) {
        const btnText = await page.evaluate((el: any) => el.textContent, btn);
        const isVisible = await page.evaluate((el: any) => {
            const style = window.getComputedStyle(el);
            return style && style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0;
        }, btn);
        
        if (isVisible && texts.some(t => btnText?.toLowerCase().includes(t.toLowerCase()))) return btn;
    }
    return null;
}


function generateTitle(district: string, neighbors: string[], round: number): string {
    const n1 = neighbors[0] || "İstanbul";
    const n2 = neighbors[1] || "Türkiye";
    if (round === 1) return `${district} Escort | ${n1} Escort | ${n2} Escort`;
    if (round === 2) return `${district} Üniversiteli Escort | Kaporasız Escort`;
    return `Elite ${district} Escort | VIP ${n1} Escort | %100 Gerçek`;
}

function generateTagPool(district: string, neighbors: string[]): string {
    const n1 = neighbors[0] || "İstanbul";
    const n2 = neighbors[1] || "Türkiye";
    const keywords = [
        `${district} escort`, `vip ${district} escort`, `${district} escort bayan`,
        `${n1} escort`, `${n2} escort`, `kaporasız ${district} escort`,
        `${district} üniversiteli escort`, `${district} elit partner`, `${district} escort katalog`,
        `${district} eve gelen escort`, `${district} otelde escort`
    ];
    return keywords.join(', ');
}

runSiege();

