import { chromium } from 'playwright';
import * as path from 'path';

const SERVICE_ACCOUNTS = [
  'e-imza-336@lyrical-edition-500119-s3.iam.gserviceaccount.com',
  'eimza-390@starry-hearth-500119-u2.iam.gserviceaccount.com'
];

async function run() {
  const propertyId = "https://istanbul-eskort-hizmeti.readme.io/";
  const usersUrl = `https://search.google.com/search-console/users?resource_id=${encodeURIComponent(propertyId)}`;

  console.log("🔗 Connecting to existing Chrome instance on port 9222...");
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
    
    console.log("⌛ Waiting 8 seconds for page data to render...");
    await page.waitForTimeout(8000);

    for (const email of SERVICE_ACCOUNTS) {
      console.log(`\n👤 Attempting to add: ${email}`);

      // Take a screenshot to inspect initial state
      await page.screenshot({ path: path.join(process.cwd(), 'gsc-add-user-init.png') });

      // Click "Kullanıcı ekle" or "Add user" button
      const openModalSuccess = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
        const addBtn = buttons.find(b => {
          const text = b.textContent || '';
          return /Kullanıcı ekle|Add user/i.test(text.trim());
        });
        if (addBtn) {
          (addBtn as HTMLElement).click();
          return true;
        }
        return false;
      });

      if (!openModalSuccess) {
        console.error("❌ 'Add user' button not found on GSC users page. Saving screenshot...");
        await page.screenshot({ path: path.join(process.cwd(), 'gsc-add-user-error.png') });
        continue;
      }

      console.log("⌛ Waiting for Add User dialog modal...");
      await page.waitForTimeout(2000);

      // Fill in email
      const emailInputSelector = 'input[type="email"], input[role="textbox"]';
      await page.locator(emailInputSelector).first().fill(email);
      await page.waitForTimeout(500);

      // Select Permission level (either Full/Owner)
      console.log("Setting permission to Full/Owner...");
      await page.evaluate(() => {
        // Find permission dropdown
        const dropdowns = Array.from(document.querySelectorAll('div[role="listbox"], [role="combobox"], [aria-haspopup="listbox"]'));
        const permDropdown = dropdowns.find(d => {
          const txt = d.textContent || '';
          return /Salt okunur|Tam|Sahip|Read-only|Full|Owner/i.test(txt);
        });
        if (permDropdown) {
          (permDropdown as HTMLElement).click();
        }
      });
      await page.waitForTimeout(1000);

      // Select "Sahip" (Owner) or "Tam" (Full) from dropdown
      const selectedPerm = await page.evaluate(() => {
        const options = Array.from(document.querySelectorAll('[role="option"], span, div'));
        // Try Owner first, then Full
        const targetOption = options.find(o => {
          const text = o.textContent || '';
          return /Sahip|Owner/i.test(text.trim()) && text.trim().length < 15;
        }) || options.find(o => {
          const text = o.textContent || '';
          return /Tam|Full/i.test(text.trim()) && text.trim().length < 15;
        });

        if (targetOption) {
          (targetOption as HTMLElement).click();
          return targetOption.textContent?.trim();
        }
        return null;
      });
      console.log(`Selected Permission Level: ${selectedPerm}`);
      await page.waitForTimeout(500);

      // Click "Ekle" / "Add" button
      const addSubmitSuccess = await page.evaluate(() => {
        const dialogButtons = Array.from(document.querySelectorAll('div[role="dialog"] button, div[role="dialog"] [role="button"], span'));
        const submitBtn = dialogButtons.find(b => {
          const text = b.textContent || '';
          return /Ekle|Add/i.test(text.trim()) && text.trim().length < 10;
        });
        if (submitBtn) {
          (submitBtn as HTMLElement).click();
          return true;
        }
        return false;
      });

      if (addSubmitSuccess) {
        console.log("⌛ Clicking Add. Waiting 6 seconds for operation to complete...");
        await page.waitForTimeout(6000);
        await page.screenshot({ path: path.join(process.cwd(), `gsc-added-user-${email.split('@')[0]}.png`) });
        console.log(`✅ User ${email} add sequence executed.`);
      } else {
        console.error("❌ 'Add' submit button not found inside dialog.");
      }
    }

  } catch (err: any) {
    console.error("❌ Error occurred during GSC UI automation:", err.message);
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch(console.error);
