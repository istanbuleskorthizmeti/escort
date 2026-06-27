import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function run() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  const targetUrl = "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa/";
  const usersUrl = `https://search.google.com/search-console/users?resource_id=${encodeURIComponent(targetUrl)}`;

  try {
    console.log(`Navigating to: ${usersUrl}`);
    await page.goto(usersUrl, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(3000);

    const sa = 'e-imza-336@lyrical-edition-500119-s3.iam.gserviceaccount.com';
    
    // 1. Check if user is in table
    const row = page.locator('tr').filter({ hasText: sa }).first();
    const rowCount = await row.count();

    if (rowCount > 0) {
      const rowText = await row.innerText();
      console.log(`Current row content: ${rowText.replace(/\n/g, ' ')}`);

      if (rowText.includes('Tam')) {
        console.log(`User ${sa} has 'Tam' permission. Removing them first...`);
        const threeDots = row.locator('div[role="button"]').first();
        await threeDots.click();
        await page.waitForTimeout(1000);

        // Click "Erişimi kaldır"
        const removeOption = page.locator('span[role="menuitem"][aria-label="Erişimi kaldır"]').filter({ visible: true }).first();
        await removeOption.click();
        await page.waitForTimeout(1500);

        // Confirm in alertdialog (using data-id="EBS5u")
        console.log("Confirming removal in alertdialog...");
        const confirmBtn = page.locator('div[role="alertdialog"] div[data-id="EBS5u"]').filter({ visible: true }).first();
        await confirmBtn.click();
        
        console.log("Waiting for removal to propagate...");
        await page.waitForTimeout(4000);
      }
    }

    // 2. Add user back as "Sahibi" (Owner)
    console.log(`Adding ${sa} back as 'Sahibi'...`);
    const addButton = page.locator('div[role="button"]').filter({ hasText: /Kullanıcı ekle/i }).filter({ visible: true }).first();
    
    // Click and retry if dialog doesn't appear
    let dialogOpened = false;
    for (let i = 0; i < 6; i++) {
      await addButton.click({ force: true }).catch(() => {});
      await page.waitForTimeout(1500);
      const isVisible = await page.locator('div[role="dialog"]').first().isVisible();
      if (isVisible) {
        dialogOpened = true;
        break;
      }
      console.log(`Dialog not open yet, retrying click... (${i+1}/6)`);
    }

    if (!dialogOpened) {
      throw new Error("Failed to open Add User dialog after multiple clicks.");
    }

    console.log("Dialog opened successfully. Filling email...");
    const emailInput = page.locator('div[role="dialog"] input[aria-label="Geçerli bir Google hesabı e-postası girin"]').filter({ visible: true }).first();
    await emailInput.fill(sa);
    await page.waitForTimeout(500);

    const dropdown = page.locator('div[role="dialog"] div[jsname="BA389"]').filter({ visible: true }).first();
    await dropdown.click();
    await page.waitForTimeout(1000);

    const ownerOption = page.locator('div[role="option"]').filter({ hasText: 'Sahibi' }).filter({ visible: true }).first();
    await ownerOption.click();
    await page.waitForTimeout(1000);

    const saveButton = page.locator('div[role="dialog"] div[data-id="EBS5u"]').filter({ visible: true }).first();
    await saveButton.click();
    
    console.log("Saving...");
    await page.waitForTimeout(5000);

  } finally {
    // Take screenshot of list
    const screenshotPath = path.join(process.cwd(), 'scratch', 'gsc_users_list_remove_add_test.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to: ${screenshotPath}`);

    // Dump the table innerText
    const tableText = await page.evaluate(() => {
      const table = document.querySelector('table');
      return table ? table.innerText : 'No table found';
    });
    console.log("Table content after test:\n", tableText);

    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
