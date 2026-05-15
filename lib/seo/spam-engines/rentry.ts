import { PuppeteerCore } from '../puppeteer-core';

/**
 * ☠️ RENTRY SPAM ENGINE (Puppeteer)
 * Creates Markdown-based pastes using Headless Automation.
 * Bypasses CSRF tokens and Cloudflare.
 * Domain Rating: 70+
 */
export class RentryEngine {
  /**
   * Generates an anonymous markdown paste on Rentry.
   * @param markdownContent Markdown formatted text
   * @param urlSlug Optional custom slug (e.g., 'vip-escort-istanbul')
   * @returns The URL of the created Rentry page
   */
  public static async createPaste(markdownContent: string, urlSlug?: string): Promise<string | null> {
    const browser = await PuppeteerCore.launchBrowser();
    try {
      return await Promise.race([
        (async () => {
          const page = await browser.newPage();
          await PuppeteerCore.applyExtremeStealth(page); // 🛡️ CLOUDFLARE BYPASS
          
          console.log("[RENTRY] Navigating to rentry.org...");
          await page.goto('https://rentry.org', { waitUntil: 'domcontentloaded', timeout: 20000 });

          // Rentry uses a simple textarea for content and an optional input for custom url
          await page.waitForSelector('textarea[name="text"]', { timeout: 10000 });
          
          // We evaluate instead of type because typing large markdown is slow and can trigger anti-spam
          await page.evaluate((content) => {
            const textarea = document.querySelector('textarea[name="text"]') as HTMLTextAreaElement;
            if (textarea) textarea.value = content;
          }, markdownContent);

          if (urlSlug) {
            await page.evaluate((slug) => {
               const input = document.querySelector('input[name="url"]') as HTMLInputElement;
               if (input) input.value = slug;
            }, urlSlug);
          }

          // Click the Submit "Go" button
          console.log("[RENTRY] Submitting form...");
          await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => null)
          ]);

          const currentUrl = page.url();
          if (currentUrl.includes(urlSlug || '') || currentUrl.includes('rentry.org/')) {
             return currentUrl;
          }
          return null;
        })(),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error("Rentry Timeout")), 30000))
      ]);
      
    } catch (e: any) {
       console.error("[RENTRY] Puppeteer creation failed:", e.message);
       return null;
    } finally {
       await browser.close();
    }
  }
}

