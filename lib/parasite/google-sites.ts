
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { TelegramService } from '../crm/telegram';
import { ProxyHandler } from '../seo/proxy-handler';

puppeteer.use(StealthPlugin());

/**
 * 🧛‍♂️ HYDRA GOOGLE SITES ADAPTER (GOD MODE)
 * Continuous 2000px iframe deployment with specialized SEO payloads.
 */

export class GoogleSitesAdapter {
  static async createSite(district: string, niche: string, slug: string, attempt = 1): Promise<string | null> {
    const title = `${district} ${niche}`;
    console.log(`🚀 [SITES] Opening Battlefront: ${title} (Attempt ${attempt})...`);

    const proxyUrl = ProxyHandler.getProxyUrl(true);
    const launchArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--window-size=1920,1080'
    ];

    if (proxyUrl && proxyUrl.trim() !== "") {
        console.log("📡 [SITES] Using residential proxy for stealth...");
        const urlObj = new URL(proxyUrl);
        launchArgs.push(`--proxy-server=${urlObj.hostname}:${urlObj.port}`);
    } else {
        console.log("⚠️ [SITES] No proxy found or URL is empty. Proceeding with Direct Server IP...");
    }

    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data'),
        executablePath: 'C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
        pipe: true,
        dumpio: true,
        args: launchArgs
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });

        if (proxyUrl) {
            const urlObj = new URL(proxyUrl);
            await page.authenticate({ username: urlObj.username, password: urlObj.password });
        }
        
        // More lenient wait + Manual buffer
        console.log("🛰️ [SITES] Navigating to Google Sites dashboard...");
        try {
            await page.goto('https://sites.google.com/new', { waitUntil: 'domcontentloaded', timeout: 90000 });
        } catch (gotoErr: any) {
            console.error(`❌ [SITES] Navigation failed: ${gotoErr.message}`);
            throw gotoErr;
        }
        
        console.log("💤 [SITES] Waiting 10s for UI to stabilize...");
        await new Promise(r => setTimeout(r, 10000));

        // 1. Create Blank Site
        await page.click('.docs-homescreen-templates-templateview:first-child');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        // 2. Set Document and Site Name
        // (DOM Selectors for New Sites)
        await page.type('.docs-title-input', title);
        await page.type('.app-title-editor', title);

        // 3. Embed 2000px Iframe
        await page.click('[aria-label="Embed"]'); 
        await page.waitForSelector('input[aria-label="Embed code"]');
        await page.click('input[aria-label="Embed code"]');
        
        const embedCode = `<iframe src="https://vipescorthizmeti.com/" width="100%" height="2000px" frameborder="0"></iframe>`;
        await page.type('textarea', embedCode);
        await page.click('button:contains("Next")');
        await page.waitForTimeout(2000);
        await page.click('button:contains("Insert")');

        // 4. Manually Expand (Drag handle simulation)
        // This part is tricky headless, so we use JS to set height directly on the container
        await page.evaluate(() => {
          const container = document.querySelector('.site-embed-container');
          if (container) (container as HTMLElement).style.height = '2000px';
        });

        // 5. Publish
        await page.click('[aria-label="Publish"]');
        await page.waitForSelector('input[name="site-url"]');
        await page.type('input[name="site-url"]', slug);
        await page.click('button:contains("Publish")');

        const liveUrl = `https://sites.google.com/dorukcanay.digital/${slug}`;
        
        await TelegramService.sendMessage(`
✨ <b>GOOGLE SITES: MÜHÜRLENDİ (2000px)</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🎯 <b>İlçe/Niş:</b> ${title}
🔗 <b>Link:</b> ${liveUrl}
🚀 <b>Durum:</b> Vitrin Tam Boy Yayında.
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🧛‍♂️ <i>İlçe kuşatması otonom olarak devam ediyor.</i>
        `.trim());

        return liveUrl;
    } catch (err: any) {
        console.error(`❌ [SITES] Error (Attempt ${attempt}):`, err.message);
        
        // Visual Debug: Capture screenshot and URL on error
        const screenshotPath = `/opt/hydra/error_attempt_${attempt}.png`;
        try {
            const pages = await browser.pages();
            if (pages.length > 0) {
                const currentUrl = pages[0].url();
                console.log(`🔗 [SITES] Failure URL: ${currentUrl}`);
                await pages[0].screenshot({ path: screenshotPath });
                console.log(`📸 [SITES] Debug screenshot saved: ${screenshotPath}`);
            }
        } catch (sErr) {
            console.warn("⚠️ [SITES] Could not capture debug screenshot.");
        }

        if (attempt < 3) {
            console.log(`🔄 [SITES] Retrying with fresh proxy in 10s...`);
            await new Promise(r => setTimeout(r, 10000));
            return this.createSite(district, niche, slug, attempt + 1);
        }
        return null;
    } finally {
        await browser.close();
    }
  }
}
