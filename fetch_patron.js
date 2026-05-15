const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set a standard User-Agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  try {
    await page.goto('https://patronizle40.cfd/', { waitUntil: 'networkidle2' });
    
    // Wait for the page to render (bypass initial Cloudflare checks if any)
    await page.waitForTimeout(5000); // Wait 5 seconds
    
    const html = await page.evaluate(() => document.documentElement.outerHTML);
    fs.writeFileSync('patron.html', html, 'utf8');
    console.log('Successfully saved to patron.html');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
})();
