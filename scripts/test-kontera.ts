import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

puppeteer.use(StealthPlugin());

async function run() {
  console.log('🚀 [STEALTH-AUDIT] Launching headless browser for kontera.xyz...');
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    console.log('📡 Navigating to https://kontera.xyz/ ...');
    await page.goto('https://kontera.xyz/', { waitUntil: 'networkidle2', timeout: 30000 });

    console.log('📸 Capturing screenshot...');
    const artifactsDir = path.join(process.cwd(), 'artifacts');
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }
    const screenshotPath = path.join(artifactsDir, 'kontera.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`✅ Screenshot saved to ${screenshotPath}`);

    // Extract main page info
    const mainPageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || 'none',
        iframeSrc: document.querySelector('iframe')?.getAttribute('src') || 'none',
        html: document.body.innerHTML.substring(0, 1000)
      };
    });

    console.log('\n--- MAIN PAGE INFO ---');
    console.log('Title:', mainPageInfo.title);
    console.log('Canonical Link:', mainPageInfo.canonical);
    console.log('Iframe Source:', mainPageInfo.iframeSrc);

    // Now try to check if the iframe loads and read its content (if same-origin or by accessing the page directly)
    if (mainPageInfo.iframeSrc && mainPageInfo.iframeSrc !== 'none') {
      const targetUrl = mainPageInfo.iframeSrc.startsWith('http') 
        ? mainPageInfo.iframeSrc 
        : `https://kontera.xyz${mainPageInfo.iframeSrc}`;
      
      console.log(`\n📡 Navigating directly to the embedded Vitrin source: ${targetUrl}...`);
      await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      // Take another screenshot of the direct vitrin
      const vitrinScreenshotPath = path.join(artifactsDir, 'kontera_vitrin.png');
      await page.screenshot({ path: vitrinScreenshotPath, fullPage: true });
      console.log(`✅ Vitrin direct screenshot saved to ${vitrinScreenshotPath}`);

      const vitrinInfo = await page.evaluate(() => {
        const title = document.title;
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || 'none';
        const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
          tag: h.tagName,
          text: (h.textContent || '').trim()
        }));
        
        // Extract links and potential profile details
        const profiles = Array.from(document.querySelectorAll('a, .profile-card, [class*="profile"], [class*="card"]')).map(el => {
          return {
            text: (el.textContent || '').trim().replace(/\s+/g, ' '),
            href: (el as any).href || 'none'
          };
        }).filter(p => p.text.length > 5).slice(0, 30);

        return {
          title,
          metaDesc,
          headings,
          profiles,
          textSnippet: document.body.innerText.substring(0, 2000)
        };
      });

      console.log('\n--- EMBEDDED VITRIN INFO ---');
      console.log('Title:', vitrinInfo.title);
      console.log('Description:', vitrinInfo.metaDesc);
      console.log('Headings:', JSON.stringify(vitrinInfo.headings, null, 2));
      console.log('Profiles Found:', vitrinInfo.profiles.length);
      console.log('Profiles Snippet:', JSON.stringify(vitrinInfo.profiles.slice(0, 10), null, 2));
      console.log('\n--- TEXT CONTENT ---');
      console.log(vitrinInfo.textSnippet);
    }
  } catch (err: any) {
    console.error('💥 Error during stealth audit:', err.message);
  } finally {
    await browser.close();
  }
}

run();
