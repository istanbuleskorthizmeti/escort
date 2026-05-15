import { PuppeteerCore } from '../puppeteer-core';

/**
 * ☠️ SUBSTACK SPAM ENGINE (Puppeteer)
 * Uses predefined authentication cookies and Headless Automation to publish 
 * newsletters containing heavy link clouds. Bypasses strict API checks.
 * Domain Rating: 90+
 */
export class SubstackEngine {
  private static authCookies = [
    process.env.SUBSTACK_COOKIE_1 || '',
    process.env.SUBSTACK_COOKIE_2 || ''
  ];

  /**
   * Publishes a newsletter post to a Substack publication.
   * @param publicationName The subdomain of the substack (e.g., 'istanbuleschizmeti')
   * @param title Title of the post
   * @param htmlContent The content of the post (must be valid HTML)
   * @returns The URL of the published post
   */
  public static async publishPost(publicationName: string, title: string, htmlContent: string): Promise<string | null> {
    const activeCookie = this.authCookies.find(c => c.length > 10);
    
    if (!activeCookie) {
      console.error("[SUBSTACK] No valid authentication cookies found. Skipping Substack injection.");
      return null;
    }

    const browser = await PuppeteerCore.launchBrowser();
    try {
      const page = await browser.newPage();
      
      console.log(`[SUBSTACK] Navigating to ${publicationName}.substack.com...`);
      
      // Inject cookies. The activeCookie is assumed to be the substack.sid cookie value
      await page.setCookie({
        name: 'substack.sid',
        value: activeCookie,
        domain: '.substack.com',
        path: '/',
        httpOnly: true,
        secure: true
      });

      await page.goto(`https://${publicationName}.substack.com/publish/post`, { waitUntil: 'networkidle2' });

      // Wait for editor to load
      await page.waitForSelector('textarea[placeholder="Title"]', { timeout: 15000 });
      
      // Type Title
      await PuppeteerCore.humanType(page, 'textarea[placeholder="Title"]', title);

      console.log("[SUBSTACK] Injecting content...");
      
      // Inject HTML content into the ProseMirror editor
      await page.evaluate((html) => {
        const editor = document.querySelector('.ProseMirror') as HTMLElement;
        if (editor) {
            editor.focus();
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', html);
            dataTransfer.setData('text/plain', html.replace(/<[^>]+>/g, ''));
            const event = new ClipboardEvent('paste', {
              clipboardData: dataTransfer,
              bubbles: true,
              cancelable: true
            });
            editor.dispatchEvent(event);
        }
      }, htmlContent);

      await new Promise(r => setTimeout(r, 2000));

      console.log("[SUBSTACK] Initiating publish sequence...");
      
      // Click Continue/Publish buttons
      const buttons = await page.$$('button');
      for (const btn of buttons) {
         const text = await page.evaluate(el => el.textContent, btn);
         if (text?.toLowerCase().includes('continue')) {
            await btn.click();
            break;
         }
      }

      await new Promise(r => setTimeout(r, 2000));

      // We disable sending email to avoid getting marked as spam by users
      const emailCheckbox = await page.$('input[type="checkbox"][name="send_email"]');
      if (emailCheckbox) {
          const isChecked = await page.evaluate(el => (el as HTMLInputElement).checked, emailCheckbox);
          if (isChecked) {
              await emailCheckbox.click();
          }
      }

      // Click final Send/Publish
      const finalButtons = await page.$$('button');
      for (const btn of finalButtons) {
         const text = await page.evaluate(el => el.textContent, btn);
         if (text?.toLowerCase().includes('publish to web')) {
            await btn.click();
            break;
         }
      }

      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      const currentUrl = page.url();
      
      await browser.close();
      return currentUrl;

    } catch (e: any) {
      console.error("[SUBSTACK] Publishing failed via Puppeteer:", e.message);
      await browser.close();
      return null;
    }
  }
}

