import { PuppeteerCore } from '../puppeteer-core';
import { TargetSelector } from '../target-selector';

/**
 * ☠️ MEDIUM SPAM ENGINE (Puppeteer)
 * Automates Medium.com to publish high-authority (DR 95) articles.
 */
export class MediumEngine {
  // In production, load this from DB/Env
  private static sessionCookie = process.env.MEDIUM_SESSION_COOKIE || '';

  /**
   * Publishes a story to Medium using a headless browser.
   * @param title Title of the story
   * @param htmlContent Content of the story (can include <img> tags)
   */
  public static async publishStory(title: string, htmlContent: string): Promise<string | null> {
    if (!this.sessionCookie || this.sessionCookie.length < 10) {
      console.error("[MEDIUM] No valid session cookie found.");
      return null;
    }

    const browser = await PuppeteerCore.launchBrowser();
    try {
      const page = await browser.newPage();
      
      // Inject session cookie
      await page.setCookie({
        name: 'uid',
        value: this.sessionCookie,
        domain: '.medium.com',
        path: '/',
        httpOnly: true,
        secure: true
      });

      console.log("[MEDIUM] Navigating to new story page...");
      await page.goto('https://medium.com/new-story', { waitUntil: 'networkidle2' });

      // Wait for the title editor
      await page.waitForSelector('h3.graf--title');
      
      // Type Title
      await PuppeteerCore.humanType(page, 'h3.graf--title', title);
      
      // Press Enter to move to body
      await page.keyboard.press('Enter');

      console.log("[MEDIUM] Injecting content...");
      
      // Medium uses a complex contenteditable div structure.
      // Instead of typing raw HTML (which Medium will escape), we will execute a script
      // to paste the HTML directly into the document or use standard typing for text and links.
      
      // For a robust implementation, we inject the raw text and then use document.execCommand
      // to insert HTML (images/links) where the cursor is.
      await page.evaluate((html) => {
        // This is a common trick for rich text editors
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text/html', html);
        dataTransfer.setData('text/plain', html.replace(/<[^>]+>/g, ''));
        const event = new ClipboardEvent('paste', {
          clipboardData: dataTransfer,
          bubbles: true,
          cancelable: true
        });
        document.activeElement?.dispatchEvent(event);
      }, htmlContent);

      await new Promise(r => setTimeout(r, 2000));

      // Click Publish Dropdown
      console.log("[MEDIUM] Publishing...");
      const publishButtons = await page.$$('button');
      for (const btn of publishButtons) {
         const text = await page.evaluate(el => el.textContent, btn);
         if (text?.includes('Publish')) {
            await btn.click();
            break;
         }
      }

      await new Promise(r => setTimeout(r, 1000));
      
      // Click Final Publish Now button
      const publishNowButtons = await page.$$('button');
      for (const btn of publishNowButtons) {
         const text = await page.evaluate(el => el.textContent, btn);
         if (text?.includes('Publish now')) {
            await btn.click();
            break;
         }
      }

      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      const currentUrl = page.url();
      
      await browser.close();
      return currentUrl;

    } catch (e: any) {
      console.error("[MEDIUM] Headless automation failed:", e.message);
      await browser.close();
      return null;
    }
  }
}
