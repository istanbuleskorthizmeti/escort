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
  console.log('🚀 [GSC PERMISSIONS] Starting Playwright Search Console permission delegator...');
  
  const sitesPath = path.join(process.cwd(), 'data', 'live_google_sites.json');
  if (!fs.existsSync(sitesPath)) {
    console.error('❌ live_google_sites.json not found!');
    return;
  }
  
  const sites: string[] = JSON.parse(fs.readFileSync(sitesPath, 'utf8'));
  console.log(`📋 Loaded ${sites.length} sites for GSC user delegation.`);

  if (!fs.existsSync(USER_DATA_DIR)) {
    fs.mkdirSync(USER_DATA_DIR, { recursive: true });
  }

  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  if (contexts.length === 0) {
    console.error("❌ No contexts found!");
    return;
  }

  const context = contexts[0];
  
  try {
    // 1. Initial GSC validation / login check
    const initialPage = await context.newPage();
    console.log('🌐 Opening Search Console homepage...');
    await initialPage.goto('https://search.google.com/search-console/about', { waitUntil: 'load', timeout: 60000 });
    
    // Click "Start now" to navigate to main dashboard
    const startNowSelector = 'a[href*="welcome"]';
    if (await initialPage.locator(startNowSelector).isVisible()) {
      await initialPage.click(startNowSelector);
      await initialPage.waitForTimeout(5000);
    }

    if (initialPage.url().includes('signin') || initialPage.url().includes('accounts.google.com')) {
      console.log('⚠️ [ACTION REQUIRED] Please log into your Google Account in the browser window now.');
      console.log('⏳ Waiting for authentication...');
      await initialPage.waitForFunction(() => !window.location.href.includes('signin') && !window.location.href.includes('accounts.google.com'), { timeout: 0 });
      console.log('✅ Logged in successfully.');
    }
    await initialPage.close();

    for (const siteUrl of sites) {
      let page;
      try {
        page = await context.newPage();
        // Forward browser console logs to terminal
        page.on('console', msg => console.log('   🖥️ [BROWSER CONSOLE]', msg.text()));

        // Format URL for GSC prefix. E.g. https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/
        const siteUrlWithSlash = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
        
        console.log(`\n🌍 Delegating permissions for: ${siteUrlWithSlash}`);
        
        const gscUsersUrl = `https://search.google.com/search-console/users?resource_id=${encodeURIComponent(siteUrlWithSlash)}`;
        await page.goto(gscUsersUrl, { waitUntil: 'load', timeout: 30000 });
        await page.waitForTimeout(5000);

        // Check if we are forbidden / unverified
        const forbiddenText = await page.evaluate(() => {
          const text = document.body.textContent || '';
          return text.includes('does not have sufficient permission') || 
                 text.includes('bu mülke erişiminiz yok') || 
                 text.includes('erişiminiz yok');
        });
        if (forbiddenText) {
          console.log(`   ⚠️ Property not verified yet. Attempting auto-verification...`);
          
          // Click "SAHİPLİĞİNİZİ DOĞRULAYIN" or "VERIFY OWNERSHIP" using Playwright's native click engine
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
            // Fallback to page.evaluate click
            await page.evaluate(() => {
              const allElements = Array.from(document.querySelectorAll('*'));
              const candidates = allElements.filter(el => {
                const text = el.textContent?.trim() || '';
                const isClickableTag = ['BUTTON', 'DIV', 'SPAN', 'A'].includes(el.tagName);
                const isClickableRole = el.getAttribute('role') === 'button';
                const hasKeyword = /sahipli|doğrula|verify/i.test(text);
                return (isClickableTag || isClickableRole) && hasKeyword && text.length < 100;
              });
              candidates.sort((a, b) => {
                const aIsBtn = a.tagName === 'BUTTON' || a.getAttribute('role') === 'button';
                const bIsBtn = b.tagName === 'BUTTON' || b.getAttribute('role') === 'button';
                if (aIsBtn && !bIsBtn) return -1;
                if (!aIsBtn && bIsBtn) return 1;
                return (a.textContent?.trim().length || 0) - (b.textContent?.trim().length || 0);
              });
              if (candidates.length > 0) {
                (candidates[0] as HTMLElement).click();
                return true;
              }
              return false;
            });
          }

          console.log(`   ⏳ Verification button clicked, waiting for auto-verification to complete...`);
          
          // Capture a diagnostic screenshot in the middle of waiting (after 5 seconds)
          await page.waitForTimeout(5000);
          const safeName = siteUrlWithSlash.replace(/[^a-zA-Z0-9]/g, '-');
          await page.screenshot({ path: path.join(process.cwd(), `verification-mid-${safeName}.png`) });
          console.log(`   📸 Captured mid-verification screenshot: verification-mid-${safeName}.png`);
          
          await page.waitForTimeout(10000); // Complete the rest of the 15-second wait

          // Click "Go to property" or "Done" natively
          let dismissed = false;
          try {
            const doneBtn = page.locator('button, div[role="button"], span, div').filter({ hasText: /mülke git|go to property|tamam|done|ok/i }).last();
            if (await doneBtn.isVisible()) {
              await doneBtn.click({ timeout: 5000 });
              console.log(`   ✔ Clicked Done/Go to Property button natively!`);
              dismissed = true;
            }
          } catch (err: any) {
            console.log(`   ⚠️ Native dismiss click failed: ${err.message}. Trying fallback...`);
          }

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

          // Return to the users management page
          await page.goto(gscUsersUrl, { waitUntil: 'load', timeout: 30000 });
          await page.waitForTimeout(5000);

          const stillForbidden = await page.evaluate(() => {
            const text = document.body.textContent || '';
            return text.includes('does not have sufficient permission') || 
                   text.includes('bu mülke erişiminiz yok') || 
                   text.includes('erişiminiz yok');
          });
          if (stillForbidden) {
            await page.screenshot({ path: path.join(process.cwd(), `verification-fail-${safeName}.png`) });
            console.log(`   ❌ Auto-verification failed for ${siteUrlWithSlash}. Debug screenshot saved.`);
            continue;
          }
          console.log(`   ✅ Auto-verification successful!`);
        }

        // --- SUBMIT SITEMAP VIA GSC UI ---
        try {
          console.log(`   📡 Navigating to Sitemaps page...`);
          const gscSitemapsUrl = `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(siteUrlWithSlash)}`;
          await page.goto(gscSitemapsUrl, { waitUntil: 'load', timeout: 30000 });
          await page.waitForTimeout(4000);

          // Find the sitemap text input field using evaluate
          const inputFound = await page.evaluate(() => {
            const inputs = Array.from(document.querySelectorAll('input'));
            const target = inputs.find(i => {
              const isReadOnly = i.readOnly || i.disabled;
              const ariaLabel = i.getAttribute('aria-label') || '';
              const placeholder = i.getAttribute('placeholder') || '';
              const name = i.getAttribute('name') || '';
              
              // Exclude inspect bar and comboboxes
              const isInspect = ariaLabel.includes('adresindeki') || ariaLabel.includes('inceleyin') || ariaLabel.includes('Inspect') || ariaLabel.includes('Arama');
              const isCombobox = i.getAttribute('role') === 'combobox';
              
              return !isReadOnly && !isInspect && !isCombobox && (name.includes('sitemap') || placeholder.includes('sitemap') || ariaLabel.includes('sitemap') || i.type === 'text');
            });
            
            if (target) {
              target.value = 'system/feeds/sitemap';
              target.dispatchEvent(new Event('input', { bubbles: true }));
              target.dispatchEvent(new Event('change', { bubbles: true }));
              return true;
            }
            return false;
          });

          if (inputFound) {
            await page.waitForTimeout(1500);

            // Click Submit button (Gönder / Submit)
            await page.evaluate(() => {
              const btns = Array.from(document.querySelectorAll('button, div[role="button"]'));
              const match = btns.find(b => ['submit', 'gönder'].some(t => b.textContent?.toLowerCase().trim() === t));
              if (match) (match as HTMLElement).click();
            });

            console.log(`   ✔ Sitemap submitted via GSC UI!`);
            await page.waitForTimeout(5000);

            // Click dismiss modal "Got it / Anlaşıldı" if it appears
            await page.evaluate(() => {
              const btns = Array.from(document.querySelectorAll('button, div[role="button"]'));
              const match = btns.find(b => ['got it', 'anlaşıldı', 'dismiss', 'kapat', 'ok', 'tamam'].some(t => b.textContent?.toLowerCase().includes(t)));
              if (match) (match as HTMLElement).click();
            });
            await page.waitForTimeout(2000);
          } else {
            console.log(`   ⚠️ Sitemap input field not found on page.`);
            await page.screenshot({ path: path.join(process.cwd(), 'sitemap-error.png') });
            console.log(`   📸 Saved debug screenshot to sitemap-error.png`);
          }
        } catch (sitemapErr: any) {
          console.log(`   ⚠️ Sitemap submission warning: ${sitemapErr.message}`);
        }

        // Navigate back to GSC users page to complete permission delegation
        await page.goto(gscUsersUrl, { waitUntil: 'load', timeout: 30000 });
        await page.waitForTimeout(4000);

        for (const email of SERVICE_ACCOUNTS) {
          console.log(`   👥 Adding user: ${email}`);

          // Click "Add User" button. It usually contains text "Add user" or "Kullanıcı ekle"
          const addUserBtn = page.locator('div[role="button"]:has-text("Add user"), div[role="button"]:has-text("Kullanıcı ekle"), button:has-text("Add user")');
          
          if (!(await addUserBtn.isVisible())) {
            // Alternative check by checking buttons
            await page.evaluate(() => {
              const btns = Array.from(document.querySelectorAll('div[role="button"], button'));
              const match = btns.find(b => ['add user', 'kullanıcı ekle'].some(t => b.textContent?.toLowerCase().includes(t)));
              if (match) (match as HTMLElement).click();
            });
          } else {
            await addUserBtn.click();
          }

          await page.waitForTimeout(3000);

          // Fill in email field
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

          // Click Add/Ekle button
          await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('div[role="button"], button'));
            const addBtn = btns.find(b => b.textContent?.trim().toLowerCase() === 'add' || b.textContent?.trim().toLowerCase() === 'ekle');
            if (addBtn) (addBtn as HTMLElement).click();
          });

          console.log(`   ✔ Sent add request for ${email}`);
          await page.waitForTimeout(4000);
        }
      } catch (err: any) {
        console.error(`   ❌ Failed delegation for ${siteUrl}:`, err.message);
      } finally {
        if (page) {
          try {
            await page.close();
          } catch {}
        }
      }
    }

    console.log('\n🏆 [SUCCESS] Completed GSC permission delegation for all Google Sites.');

  } catch (error: any) {
    console.error('❌ GSC permissions automation failed:', error.message);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  run();
}
