import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';

// Add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

/**
 * ☠️ DRKCNAY HEADLESS AUTOMATION ENGINE
 * Core Puppeteer wrapper designed to bypass Captchas, Cloudflare, and browser fingerprinting.
 */
export class PuppeteerCore {
  /**
   * Generates a random, modern User-Agent
   */
  private static getRandomUserAgent(): string {
    const versions = ['120.0.0.0', '121.0.0.0', '122.0.0.0', '123.0.0.0'];
    const v = versions[Math.floor(Math.random() * versions.length)];
    return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v} Safari/537.36`;
  }

  /**
   * Launches a stealth browser instance.
   * Runs in headless mode but mimics a real Chrome browser.
   */
  public static async launchBrowser(): Promise<Browser> {
    const proxyUrl = process.env.PREMIUM_PROXY_URL || 'http://7N8UnQi8X:wPWnHP6YB@154.209.141.248:62912';
    const args = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      `--user-agent="${this.getRandomUserAgent()}"`
    ];

    if (proxyUrl) {
      try {
        const parsed = new URL(proxyUrl);
        args.push(`--proxy-server=${parsed.hostname}:${parsed.port}`);
        console.log(`🛡️ [PUPPETEER] Proxy Enabled: ${parsed.hostname}:${parsed.port}`);
      } catch (e) {
        console.warn("⚠️ [PUPPETEER] Invalid PREMIUM_PROXY_URL format. Proceeding without proxy.");
      }
    }

    return await puppeteer.launch({
      headless: true, // "new" is also an option if supported by the puppeteer version
      args: args
    });
  }

  /**
   * Configures a page with extreme stealth (bypassing Cloudflare Turnstile / Captchas)
   */
  public static async applyExtremeStealth(page: Page) {
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
    });

    // Mask Webdriver completely
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
      // Mock WebGL vendor to hide headless identity
      const getParameter = (WebGLRenderingContext.prototype as any).getParameter;
      (WebGLRenderingContext.prototype as any).getParameter = function(parameter: number) {
        if (parameter === 37445) return 'Intel Inc.';
        if (parameter === 37446) return 'Intel Iris OpenGL Engine';
        return getParameter.apply(this, [parameter]);
      };
    });

    // Authenticate Proxy if present
    const proxyUrl = process.env.PREMIUM_PROXY_URL || 'http://7N8UnQi8X:wPWnHP6YB@154.209.141.248:62912';
    if (proxyUrl) {
       try {
          const parsed = new URL(proxyUrl);
          if (parsed.username && parsed.password) {
             await page.authenticate({
                username: decodeURIComponent(parsed.username),
                password: decodeURIComponent(parsed.password)
             });
             console.log("🛡️ [PUPPETEER] Proxy Authentication Applied.");
          }
       } catch (e) {}
    }
  }

  /**
   * Helper to execute common typing patterns that look human.
   */
  public static async humanType(page: Page, selector: string, text: string) {
    await page.waitForSelector(selector);
    await page.type(selector, text, { delay: Math.floor(Math.random() * 50) + 30 }); // Random delay between 30-80ms
  }

  /**
   * Simulates human-like scrolling to bypass behavior analysis.
   */
  public static async humanScroll(page: Page) {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }
}
