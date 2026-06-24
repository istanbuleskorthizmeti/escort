import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

chromium.use(stealth());

async function run() {
  console.log("🔗 Connecting to existing Chrome instance on port 9222...");
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    
    let targetPage: any = null;
    
    for (const context of contexts) {
      const pages = context.pages();
      for (const page of pages) {
        const url = page.url();
        if (url.includes('search.google.com/search-console')) {
          targetPage = page;
          break;
        }
      }
      if (targetPage) break;
    }
    
    if (!targetPage) {
      console.error("❌ Google Search Console page not found in active browser tabs!");
      await browser.close();
      return;
    }
    
    console.log(`🎯 Found GSC page. Navigating directly to sitemaps page...`);
    const sitemapsUrl = 'https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fistanbul-eskort-hizmeti.readme.io%2F';
    await targetPage.goto(sitemapsUrl, { waitUntil: 'networkidle', timeout: 45000 });
    console.log("Navigation complete. Waiting 5 seconds for data to load...");
    await targetPage.waitForTimeout(5000);
    
    await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemaps-loaded.png') });
    console.log("📸 Saved gsc-sitemaps-loaded.png");

    // Look for sitemap rows
    console.log("Looking for sitemap rows...");
    const sitemapRow = targetPage.locator('text=/sitemap.xml');
    if (await sitemapRow.count() > 0) {
      console.log("Found '/sitemap.xml' row. Clicking it...");
      await sitemapRow.first().click();
      console.log("Clicked row. Waiting 5 seconds for details view to load...");
      await targetPage.waitForTimeout(5000);
      
      await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemap-details-view.png') });
      console.log("📸 Saved gsc-sitemap-details-view.png");
      
      // Let's click the error expander if present
      const errorRow = targetPage.locator('text=Genel HTTP hatası');
      if (await errorRow.count() > 0) {
        console.log("Found 'Genel HTTP hatası' error row. Clicking it to reveal details...");
        // Click exactly on the text "Genel HTTP hatası"
        await errorRow.first().click();
        await targetPage.waitForTimeout(3000);
        
        await targetPage.screenshot({ path: path.join(process.cwd(), 'gsc-sitemap-error-expanded.png') });
        console.log("📸 Saved gsc-sitemap-error-expanded.png");
        
        // Save the outer HTML of the sitemap details container to file
        const html = await targetPage.evaluate(() => document.body.innerHTML);
        fs.writeFileSync('gsc-page.html', html);
        console.log("Saved full page HTML to gsc-page.html");
        
        const text = await targetPage.evaluate(() => document.body.innerText);
        fs.writeFileSync('gsc-page-text.txt', text);
        console.log("Saved full page text to gsc-page-text.txt");
        
        console.log("=== EXECUTING DOM ANALYSIS FOR ERROR DETAILS ===");
        const details = await targetPage.evaluate(() => {
          // Look for any table rows or elements inside the expanded error section
          const elements = Array.from(document.querySelectorAll('*'));
          // Find the index of "Genel HTTP hatası" and grab text after it
          const bodyText = document.body.innerText;
          const idx = bodyText.indexOf("Genel HTTP hatası");
          if (idx !== -1) {
            return bodyText.substring(idx, idx + 1000);
          }
          return "No details found in body text.";
        });
        console.log(details);
      } else {
        console.log("❌ 'Genel HTTP hatası' row was not found on sitemap details page.");
      }
    } else {
      console.log("❌ '/sitemap.xml' sitemap row was not found in the table.");
    }
    
  } catch (err: any) {
    console.error("❌ Error in script execution:", err.message);
  }
}

run();
