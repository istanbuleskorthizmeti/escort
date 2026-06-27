import { chromium } from 'playwright';

async function run() {
  const propertyId = "https://istanbul-eskort-hizmeti.readme.io/";
  const usersUrl = `https://search.google.com/search-console/users?resource_id=${encodeURIComponent(propertyId)}`;

  console.log("🔗 Connecting to Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  
  if (!context) {
    console.error("❌ No active browser context found!");
    process.exit(1);
  }

  const page = await context.newPage();
  
  try {
    console.log(`🔗 Navigating to Users Settings page: ${usersUrl}`);
    await page.goto(usersUrl, { waitUntil: 'load', timeout: 45000 });
    
    console.log("⌛ Waiting for page to load...");
    await page.waitForTimeout(6000);

    const userEmails = await page.evaluate(() => {
      // Find all cells/divs containing emails
      const elements = Array.from(document.querySelectorAll('td, div, span'));
      const emails = elements
        .map(el => el.textContent?.trim() || '')
        .filter(text => text.includes('@') && text.includes('.'));
      
      // Return unique emails
      return Array.from(new Set(emails));
    });

    console.log("\n--- REGISTERED USERS IN GSC ---");
    if (userEmails.length === 0) {
      console.log("No emails found on the page.");
    } else {
      userEmails.forEach((email, idx) => {
        console.log(`[${idx + 1}] ${email}`);
      });
    }

  } catch (err: any) {
    console.error("❌ Error occurred:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
