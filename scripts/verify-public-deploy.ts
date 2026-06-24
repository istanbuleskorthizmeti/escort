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
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  try {
    const targetUrl = "https://istanbul-eskort-hizmeti.readme.io/docs/istanbul-escort";
    console.log(`Navigating to public documentation page: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(6000);

    const pageInfo = await page.evaluate(() => {
      const gscMeta = document.querySelector('meta[name="google-site-verification"]');
      const bodyText = document.body.innerText;
      const htmlContent = document.documentElement.outerHTML;
      const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src || s.textContent?.substring(0, 100));

      return {
        url: window.location.href,
        title: document.title,
        gscMetaContent: gscMeta ? gscMeta.getAttribute('content') : null,
        bodyContainsTitle: bodyText.includes("DorukcanAY VIP Hizmeti") || bodyText.includes("Premium Model Vitrini"),
        hasReactError: bodyText.includes("Minified React error") || htmlContent.includes("Minified React error"),
        scriptsCount: scripts.length
      };
    });

    console.log("Verification results:", pageInfo);
    await page.screenshot({ path: path.join(process.cwd(), 'readme-public-verify.png') });
    console.log("Screenshot saved: readme-public-verify.png");

  } catch (err: any) {
    console.error("Error during verification:", err.message);
  } finally {
    try {
      await page.close();
    } catch (e) {}
  }
}

run().catch(console.error);
