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
  const targetPage = pages.find(p => p.url().includes('istanbul-eskort-hizmeti.readme.io/docs/getting-started'));
  
  if (!targetPage) {
    console.error("❌ Target page not found!");
    await browser.close();
    return;
  }

  const info = await targetPage.evaluate(() => {
    // Get text under "GitHub Connection" section
    const container = document.body;
    const text = container.innerText;
    
    // Find text between "GitHub Connection" and "Jump to Content"
    const startIdx = text.indexOf("GitHub Connection");
    const endIdx = text.indexOf("Setup complete!");
    
    return {
      githubSectionText: startIdx !== -1 && endIdx !== -1 ? text.substring(startIdx, endIdx) : text.substring(0, 1500)
    };
  });

  console.log("GitHub section text:", info.githubSectionText);
  await browser.close();
}

run().catch(console.error);
