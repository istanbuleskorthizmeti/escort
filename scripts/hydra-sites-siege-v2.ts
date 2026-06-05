// 🧛‍♂️ HYDRA ENGINE REFRESHED: 2026-05-16 13:43
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { ISTANBUL_NEIGHBORS } from '../lib/seo/neighborhood-map';
import { istanbulCity } from '../scripts/lib/locations-registry/istanbul';
import { TelegramService } from '../lib/crm/telegram';
import path from 'path';
import os from 'os';
import fs from 'fs';
import readline from 'readline';

puppeteer.use(StealthPlugin());

/**
 * 🏴‍☠️ HYDRA GOOGLE SITES SIEGE ENGINE v2.0 (GOD MODE)
 * Includes: Training Mode, Memory Support, Semantic Tagging, and 2000px Embeds.
 */

const POOL_PATH = path.join(__dirname, '../lib/seo/sites-link-pool.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const wait = (msg: string) => new Promise(resolve => rl.question(`👉 [TRAINING] ${msg} (Press Enter to continue...)`, () => resolve(true)));

const CREDENTIALS = {
    email: "info@dorukcanay.digital",
    password: "212jeAmind!"
};

async function handleGoogleLogin(page: any) {
    console.log("🔐 [SYSTEM] Checking login status...");
    
    // Check if we are on a login page
    const isLoginPage = await page.evaluate(() => {
        return document.querySelector('input[type="email"]') !== null || document.body.innerText.includes('Sign in');
    });

    if (!isLoginPage) {
        console.log("✅ [SYSTEM] Already logged in or no login required.");
        return;
    }

    console.log("🚀 [LOGIN] Entering credentials...");
    
    try {
        await page.waitForSelector('input[type="email"]', { timeout: 10000 });
        await page.type('input[type="email"]', CREDENTIALS.email, { delay: 100 });
        await page.keyboard.press('Enter');
        
        await page.waitForSelector('input[type="password"]', { visible: true, timeout: 20000 });
        await page.type('input[type="password"]', CREDENTIALS.password, { delay: 100 });
        await page.keyboard.press('Enter');
        
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
        console.log("✅ [LOGIN] Login successful.");
    } catch (err: any) {
        console.error("❌ [LOGIN-ERROR] Login failed or timeout:", err.message);
        console.log("💡 [TRAINING] Lutfen manuel giris yap.");
        await wait("Manuel giris bekleniyor...");
    }
}

async function runSiege() {
    const args = process.argv.slice(2);
    const round = parseInt(args[0] || '1');
    const limit = parseInt(args[1] || '39');
    const isTraining = args[2] === 'true';

    const finalChromePath = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";
    const userDataDir = path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data');
    const lockFile = path.join(userDataDir, 'SingletonLock');

    // 🛡️ GOD-MODE: Auto-unlock if singleton lock exists
    if (fs.existsSync(lockFile)) {
        try {
            console.log("⚠️ [SYSTEM] SingletonLock detected. Attempting to clear...");
            fs.unlinkSync(lockFile);
        } catch (e) {
            console.warn("⚠️ [SYSTEM] Could not delete SingletonLock. Chrome might still be open.");
        }
    }

    console.log(`🏴‍☠️ [HYDRA-SIEGE V2] Round ${round} | Training: ${isTraining}`);
    console.log(`👤 [SYSTEM] Profile: ${userDataDir}`);
    console.log(`🚀 [DEBUG] Executable: ${finalChromePath}`);

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false,
            userDataDir: userDataDir,
            executablePath: finalChromePath,
            defaultViewport: null,
            args: [
                '--start-maximized', 
                '--disable-blink-features=AutomationControlled',
                '--profile-directory=Default',
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
    } catch (launchError: any) {
        if (launchError.message.includes('already running')) {
            console.error("\n❌ [FATAL] Chrome hala acik! Lutfen tum Chrome pencerelerini kapatip tekrar dene.");
            console.error("💡 [TIP] Gorev Yoneticisi'nden (Task Manager) tum 'chrome.exe' sureclerini sonlandir.");
            process.exit(1);
        }
        throw launchError;
    }

    try {
        const districts = Object.keys(ISTANBUL_NEIGHBORS).slice(0, limit);
        
        const page = await browser.newPage();
        for (const districtSlug of districts) {
            try {
                await executeSiegeStep(page, districtSlug, round, isTraining);
                console.log(`✅ [SUCCESS] ${districtSlug} completed.`);
            } catch (err: any) {
                console.error(`❌ [ERROR] ${districtSlug}: ${err.message}`);
            }
        }
        await page.close();
    } catch (fatal: any) {
        console.error("❌ [SIEGE-FATAL]", fatal.message);
    } finally {
        await browser.close();
        if (isTraining) {
            console.log("\n🏁 [TRAINING] Oturum tamamlandı.");
        }
        process.exit(0);
    }
}

async function executeSiegeStep(page: any, districtSlug: string, round: number, isTraining: boolean) {
    const neighbors = ISTANBUL_NEIGHBORS[districtSlug];
    const districtName = districtSlug.charAt(0).toUpperCase() + districtSlug.slice(1);
    const title = generateTitle(districtName, neighbors, round);
    let publishSlug = `${districtSlug}escort-drkcnay${round}`;

    console.log(`\n💎 [GOD-MODE] Target: ${districtName} | Round: ${round}`);
    
    // 1. MESH NETWORK LOGIC: Grab a backlink from the pool
    let meshLink = "https://istanbulescdrkcn.com/";
    const GAS_GATEWAY_URL = "https://script.google.com/macros/s/AKfycbydyYobsAT4p-Tbi8n72TydN8YajdUEfGwB3GhwhoYodeHSthZ8jPxkvYK7GHn-q7GZ/exec";

    try {
        if (fs.existsSync(POOL_PATH)) {
            const pool = JSON.parse(fs.readFileSync(POOL_PATH, 'utf-8'));
            const prevRound = (round - 1).toString();
            if (pool.rounds[prevRound]) {
                const keys = Object.keys(pool.rounds[prevRound]);
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                meshLink = pool.rounds[prevRound][randomKey];
                console.log(`🔗 [MESH] Injecting Backlink from Round ${prevRound}: ${meshLink}`);
            }
        }
    } catch (e) { console.warn("⚠️ [MESH] Pool not ready, using money site."); }

    if (isTraining) await wait("Sites anasayfasına gidiliyor...");
    await page.goto('https://sites.google.com/new', { waitUntil: 'networkidle2', timeout: 60000 });

    // Handle Login if needed
    await handleGoogleLogin(page);

    if (isTraining) await wait("Yeni site oluşturuluyor...");
    await page.waitForSelector('[aria-label="Create new site"]', { timeout: 30000 });
    await page.click('[aria-label="Create new site"]');
    
    // INVINCIBLE: Wait for editor or retry navigation
    try {
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 });
    } catch (e) { console.log("⏳ [SYSTEM] Slow navigation, continuing..."); }

    if (isTraining) await wait(`Başlık yazılıyor: ${title}`);
    await page.waitForSelector('input[aria-label="Document name"]', { timeout: 20000 });
    await page.type('input[aria-label="Document name"]', title, { delay: 50 });
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000));

    if (isTraining) await wait("Embed menüsü ve Kod Enjeksiyonu...");
    await page.click('[aria-label="Embed"]');
    await page.waitForSelector('div[role="tablist"] div:nth-child(2)', { timeout: 5000 });
    await page.click('div[role="tablist"] div:nth-child(2)'); 
    
    const tagPool = generateTagPool(districtName, neighbors);
    
    // 🗺️ LOCAL SEO: Inject Google Maps for specific locations
    let mapsEmbed = "";
    if (districtSlug.toLowerCase().includes("bayrampasa")) {
        mapsEmbed = `
            <div style="margin-top:20px; border-radius:15px; overflow:hidden;">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5941.904782347167!2d28.900171167755694!3d41.03983291142028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cabb20713024fb%3A0x4b7ad63607485ae1!2sBayrampa%C5%9Fa%20Escort!5e0!3m2!1str!2str!4v1778938305862!5m2!1str!2str" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        `;
    }

    const embedCode = `
        <div style="width:100%; height:2000px; overflow:hidden; border:2px solid #e11d48; border-radius:15px; box-shadow: 0 10px 30px rgba(225, 29, 72, 0.3);">
            <iframe src="${GAS_GATEWAY_URL}" width="100%" height="2000px" frameborder="0"></iframe>
        </div>
        ${mapsEmbed}
        <div style="margin-top:20px; padding:20px; background:linear-gradient(135deg, #111 0%, #222 100%); border-radius:10px; font-family:sans-serif; color:#fff;">
            <h2 style="color:#e11d48; margin-top:0;">💎 ${districtName} VIP Deneyimi</h2>
            <p style="color:#ccc; line-height:1.6; font-size:14px;">${tagPool}</p>
            <div style="margin-top:15px; padding-top:15px; border-top:1px dashed #444;">
                <span style="color:#e11d48; font-weight:bold;">📍 Bölgesel Otorite:</span> 
                <a href="${meshLink}" style="color:#fff; text-decoration:none; font-size:12px;">${districtName} Partner Network →</a>
            </div>
            <!-- SEMANTIC NEIGHBORHOOD CLOUD (GOD MODE) -->
            <div style="margin-top:20px; font-size:10px; color:#444; line-height:1.2; text-align:justify; opacity:0.6;">
                ${generateKeywordCloud(districtSlug)}
            </div>
        </div>
    `.trim();

    await page.waitForSelector('textarea', { timeout: 5000 });
    await page.type('textarea', embedCode, { delay: 5 });
    
    const nextBtn = await findButton(page, 'Next');
    if (nextBtn) await nextBtn.click();
    await new Promise(r => setTimeout(r, 2000));
    
    const insertBtn = await findButton(page, 'Insert');
    if (insertBtn) await insertBtn.click();
    await new Promise(r => setTimeout(r, 3000));

    // SMART PUBLISH: Handle slug conflicts
    let published = false;
    let slugAttempt = 0;

    while (!published && slugAttempt < 5) {
        if (isTraining) await wait(`Publishing with slug: ${publishSlug}`);
        await page.click('[aria-label="Publish"]');
        await page.waitForSelector('input[name="site-url"]', { timeout: 10000 });
        
        // Clear and type slug
        await page.click('input[name="site-url"]', { clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.type('input[name="site-url"]', publishSlug, { delay: 30 });
        await new Promise(r => setTimeout(r, 2000));

        // 🌍 [GOD-MODE] Ensure PUBLIC access (Workspace Bypass)
        if (slugAttempt === 0) {
            try {
                const manageLink = await page.evaluateHandle(() => {
                    const links = Array.from(document.querySelectorAll('span, div, a'));
                    return links.find(el => el.textContent?.includes('Manage') || el.textContent?.includes('Yönet'));
                });
                
                if (manageLink) {
                    console.log("🔓 [SYSTEM] Adjusting Privacy Settings to PUBLIC...");
                    await (manageLink as any).click();
                    await new Promise(r => setTimeout(r, 3000));
                    
                    // In the sharing dialog, find "Links" -> "Change"
                    const changeBtn = await findButton(page, 'Change');
                    if (changeBtn) await changeBtn.click();
                    await new Promise(r => setTimeout(r, 2000));

                    // Set Published site to Public
                    await page.evaluate(() => {
                        const items = Array.from(document.querySelectorAll('[role="menuitem"], .v399Ue'));
                        const publicItem = items.find(el => el.textContent?.includes('Public') || el.textContent?.includes('Herkese açık'));
                        if (publicItem) (publicItem as any).click();
                    });
                    await new Promise(r => setTimeout(r, 1000));

                    const doneBtn = await findButton(page, 'Done');
                    if (doneBtn) await doneBtn.click();
                    await new Promise(r => setTimeout(r, 2000));
                }
            } catch (e) {
                console.warn("⚠️ [SYSTEM] Could not force public visibility. Proceeding anyway.");
            }
        }

        const finalPublishBtn = await findButton(page, 'Publish');
        if (finalPublishBtn) {
            await finalPublishBtn.click();
            
            // Check for conflict
            await new Promise(r => setTimeout(r, 5000));
            const errorMsg = await page.evaluate(() => {
                const el = document.querySelector('.quantumWizTextinputPaperinputError');
                return el ? el.textContent : null;
            });

            if (errorMsg && errorMsg.includes('already taken')) {
                console.log(`⚠️ [CONFLICT] Slug taken: ${publishSlug}. Retrying with salt...`);
                publishSlug = `${districtSlug}escort-drkcnay${round}-${Math.floor(Math.random()*999)}`;
                slugAttempt++;
                // Close publish dialog to retry
                await page.keyboard.press('Escape');
                await new Promise(r => setTimeout(r, 1000));
            } else {
                published = true;
            }
        } else {
            published = true; // Button not found, might be already published
        }
    }

    const liveUrl = `https://sites.google.com/view/${publishSlug}`;
    updateLinkPool(round, districtSlug, liveUrl);
    
    await TelegramService.sendSiegeReport({
        district: districtName,
        round: round,
        url: liveUrl,
        title: title,
        stats: `🛡️ MESH: ${meshLink.substring(0, 30)}... | 🚀 SALT: ${slugAttempt}`
    });
}

function updateLinkPool(round: number, slug: string, url: string) {
    try {
        const pool = JSON.parse(fs.readFileSync(POOL_PATH, 'utf-8'));
        pool.rounds[round.toString()][slug] = url;
        fs.writeFileSync(POOL_PATH, JSON.stringify(pool, null, 2));
    } catch (e) {}
}

async function findButton(page: any, text: string) {
    const buttons = await page.$$('button');
    for (const btn of buttons) {
        const btnText = await page.evaluate((el: any) => el.textContent, btn);
        if (btnText?.toLowerCase().includes(text.toLowerCase())) return btn;
    }
    return null;
}

function generateTitle(district: string, neighbors: string[], round: number): string {
    const n1 = neighbors[0] || "İstanbul";
    const n2 = neighbors[1] || "Türkiye";
    
    // Ensure "Escort" is appended to neighbors as well
    const n1E = n1.toLowerCase().includes('escort') ? n1 : `${n1} Escort`;
    const n2E = n2.toLowerCase().includes('escort') ? n2 : `${n2} Escort`;
    const dE = district.toLowerCase().includes('escort') ? district : `${district} Escort`;

    if (round === 1) return `${dE} | ${n1E} | ${n2E}`;
    if (round === 2) return `${dE} Üniversiteli | Kaporasız ${dE}`;
    return `Elite ${dE} | VIP ${n1E} | %100 Gerçek`;
}

function generateTagPool(district: string, neighbors: string[]): string {
    const n1 = neighbors[0] || "İstanbul";
    const n2 = neighbors[1] || "Türkiye";
    return `${district} escort, vip ${district} escort, ${district} escort bayan, ${n1} escort, ${n2} escort, kaporasız ${district} escort`;
}

function generateKeywordCloud(districtSlug: string): string {
    const district = istanbulCity.districts.find(d => d.slug === districtSlug);
    if (!district || !district.neighborhoods) return "";
    
    return district.neighborhoods.map(n => {
        return `${district.name} ${n.name} escort, ${n.name} vip partner, ${n.name} elit escort`;
    }).join(", ");
}

runSiege();
