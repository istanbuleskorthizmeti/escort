import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  if (contexts.length === 0) {
    console.error("❌ No contexts found!");
    return;
  }

  const context = contexts[0];
  const pages = context.pages();
  
  let targetPage = pages.find(p => p.url().includes('istanbul-eskort-hizmeti.readme.io'));
  if (!targetPage) {
    console.log("Creating new tab...");
    targetPage = await context.newPage();
  }

  try {
    const generalSettingsUrl = "https://istanbul-eskort-hizmeti.readme.io/docs/getting-started#/settings/general";
    console.log(`Navigating to general settings: ${generalSettingsUrl}`);
    await targetPage.goto(generalSettingsUrl, { waitUntil: 'load', timeout: 30000 });
    await targetPage.waitForTimeout(6000);

    const info = await targetPage.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        text: document.body.innerText.substring(0, 1500)
      };
    });

    console.log("General Settings Page info:", info);

    // Let's look for a button containing "Launch" or similar to make the site public
    const launchResult = await targetPage.evaluate(() => {
      // Find all buttons
      const buttons = Array.from(document.querySelectorAll('button, div[role="button"], a'));
      const launchBtn = buttons.find(b => 
        b.textContent?.toLowerCase().includes('launch') || 
        b.textContent?.toLowerCase().includes('yayınla')
      );
      if (launchBtn) {
        (launchBtn as HTMLElement).click();
        return "Clicked Launch button!";
      }
      return "Launch button not found.";
    });

    console.log("Launch action:", launchResult);
    await targetPage.waitForTimeout(5000);

    await targetPage.screenshot({ path: path.join(process.cwd(), 'readme-general-saved.png') });
    console.log("Screenshot saved: readme-general-saved.png");

  } catch (err: any) {
    console.error("Error launching docs:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
