import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  for (const ctx of contexts) {
    const pages = ctx.pages();
    for (const p of pages) {
      const url = p.url();
      if (url === 'https://dash.readme.com/' || url === 'https://dash.readme.com') {
        console.log(`🎯 Found dashboard page: ${url}`);
        
        // Let's get the project list items
        const projects = await p.evaluate(() => {
          const links = Array.from(document.querySelectorAll('a'));
          return links
            .filter(a => a.href.includes('/project/'))
            .map(a => ({
              href: a.href,
              text: a.innerText.trim()
            }));
        });
        
        console.log("All projects in dashboard:", projects);
      }
    }
  }

  await browser.close();
}

run().catch(console.error);
