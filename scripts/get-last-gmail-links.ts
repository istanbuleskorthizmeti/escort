import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

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
  const gmailPage = pages.find(p => p.url().includes('mail.google.com'));

  if (!gmailPage) {
    console.error("❌ Gmail page not found!");
    await browser.close();
    return;
  }

  try {
    console.log("Reading links from the open Gmail thread...");

    const links = await gmailPage.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      return anchors.map((a, index) => ({
        index,
        text: a.textContent?.trim(),
        href: a.href,
        visible: a.offsetWidth > 0 && a.offsetHeight > 0
      })).filter(l => l.href && l.href.includes('readme'));
    });

    console.log("All ReadMe links on current Gmail page:", links);

  } catch (err: any) {
    console.error("Error reading links:", err.message);
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
