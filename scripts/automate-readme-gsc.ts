import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');
const SERVICE_ACCOUNTS = [
  'sovereign-spyy@karacocuk.iam.gserviceaccount.com',
  'hydra-ai-admin@vast-falcon-495301-g5.iam.gserviceaccount.com',
  'e-imza-336@lyrical-edition-500119-s3.iam.gserviceaccount.com',
  'eimza-362@model-osprey-500119-v9.iam.gserviceaccount.com',
  'eimza-390@starry-hearth-500119-u2.iam.gserviceaccount.com'
];

async function run() {
  console.log('🚀 [README GSC] Starting Playwright Search Console permission delegator for ReadMe...');
  
  const siteUrl = "https://istanbul-eskort-hizmeti.readme.io/";

  if (!fs.existsSync(USER_DATA_DIR)) {
    fs.mkdirSync(USER_DATA_DIR, { recursive: true });
  }

  console.log("🔌 Launching local Chromium with persistent context...");
  const browser = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    viewport: { width: 1280, height: 720 },
    args: ['--disable-blink-features=AutomationControlled']
  });

  const context = browser;
  
  try {
    let page = await context.newPage();
    const siteUrlWithSlash = siteUrl;
    
    console.log(`\n🌍 Delegating permissions for: ${siteUrlWithSlash}`);
    
    const gscUsersUrl = `https://search.google.com/search-console/users?resource_id=${encodeURIComponent(siteUrlWithSlash)}`;
    await page.goto(gscUsersUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(5000);

    const forbiddenText = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return text.includes('does not have sufficient permission') || 
             text.includes('bu mülke erişiminiz yok') || 
             text.includes('erişiminiz yok');
    });

    if (forbiddenText) {
      console.log(`   ⚠️ Property not verified yet. Attempting auto-verification...`);
      let clicked = false;
      try {
        const verifyBtn = page.locator('button, div[role="button"], span, div').filter({ hasText: /Sahipliğinizi doğrulayın|Verify ownership|SAHİPLİĞİNİZİ/ }).last();
        if (await verifyBtn.isVisible()) {
          await verifyBtn.click({ timeout: 5000 });
          console.log(`   ✔ Clicked verification button natively!`);
          clicked = true;
        }
      } catch (err: any) {
        console.log(`   ⚠️ Native click failed: ${err.message}. Trying fallback...`);
      }

      if (!clicked) {
        await page.evaluate(() => {
          const allElements = Array.from(document.querySelectorAll('*'));
          const candidates = allElements.filter(el => {
            const text = el.textContent?.trim() || '';
            const isClickableTag = ['BUTTON', 'DIV', 'SPAN', 'A'].includes(el.tagName);
            const isClickableRole = el.getAttribute('role') === 'button';
            const hasKeyword = /sahipli|doğrula|verify/i.test(text);
            return (isClickableTag || isClickableRole) && hasKeyword && text.length < 100;
          });
          if (candidates.length > 0) {
            (candidates[0] as HTMLElement).click();
            return true;
          }
          return false;
        });
      }

      await page.waitForTimeout(10000);

      let dismissed = false;
      try {
        const doneBtn = page.locator('button, div[role="button"], span, div').filter({ hasText: /mülke git|go to property|tamam|done|ok/i }).last();
        if (await doneBtn.isVisible()) {
          await doneBtn.click({ timeout: 5000 });
          console.log(`   ✔ Clicked Done/Go to Property button natively!`);
          dismissed = true;
        }
      } catch (err: any) {}

      if (!dismissed) {
        await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('button, div[role="button"], span, div'));
          const match = elements.find(el => {
            const text = el.textContent || '';
            return /mlke git|go to property|tamam|done|ok/i.test(text) && text.length < 30;
          });
          if (match) (match as HTMLElement).click();
        });
      }

      await page.waitForTimeout(4000);
      await page.goto(gscUsersUrl, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(5000);
    }

    for (const email of SERVICE_ACCOUNTS) {
      console.log(`   👥 Adding user: ${email}`);
      const addUserBtn = page.locator('div[role="button"]:has-text("Add user"), div[role="button"]:has-text("Kullanıcı ekle"), button:has-text("Add user")');
      
      if (!(await addUserBtn.isVisible())) {
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('div[role="button"], button'));
          const match = btns.find(b => ['add user', 'kullanıcı ekle'].some(t => b.textContent?.toLowerCase().includes(t)));
          if (match) (match as HTMLElement).click();
        });
      } else {
        await addUserBtn.click();
      }

      await page.waitForTimeout(3000);

      const emailInput = page.locator('input[type="email"], input[aria-label="Email address"], input[aria-label="E-posta adresi"]');
      if (await emailInput.isVisible()) {
        await emailInput.fill(email);
      } else {
        await page.evaluate((e) => {
          const inputs = Array.from(document.querySelectorAll('input'));
          const match = inputs.find(i => ['email', 'e-posta'].some(t => i.placeholder?.toLowerCase().includes(t) || i.getAttribute('aria-label')?.toLowerCase().includes(t)));
          if (match) {
            match.value = e;
            match.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }, email);
      }

      await page.waitForTimeout(2000);

      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('div[role="button"], button'));
        const addBtn = btns.find(b => b.textContent?.trim().toLowerCase() === 'add' || b.textContent?.trim().toLowerCase() === 'ekle');
        if (addBtn) (addBtn as HTMLElement).click();
      });

      console.log(`   ✔ Sent add request for ${email}`);
      await page.waitForTimeout(4000);
    }
    
    console.log('\n🏆 [SUCCESS] Completed GSC permission delegation for ReadMe Site.');
  } catch (error: any) {
    console.error('❌ GSC permissions automation failed:', error.message);
  } finally {
    await browser.close();
  }
}

run();
