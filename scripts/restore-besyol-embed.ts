import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

chromium.use(stealth());

const USER_DATA_DIR = path.join(process.cwd(), 'data', 'hydra_god_chrome');
const CHROME_PATH = "C:\\Users\\onurk\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";
const SITE_URL = "https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/ana-sayfa";

const EMBED_HTML = `<div style="width:100%; height:800px; overflow:hidden; margin-top:20px;">
    <iframe src="https://dorukcanay.digital" width="100%" height="800px" frameborder="0"></iframe>
</div>`;

async function restoreEmbed() {
  console.log("🚀 Starting restore embed sequence for besyol...");
  
  const browserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    executablePath: CHROME_PATH,
    viewport: { width: 1366, height: 768 },
    args: [
      '--start-maximized',
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browserContext.newPage();

  try {
    console.log(`Navigating to public URL: ${SITE_URL}`);
    await page.goto(SITE_URL, { waitUntil: 'load', timeout: 120000 });
    await page.waitForTimeout(5000);

    // Edit button click
    console.log("Looking for edit pencil button...");
    const editSelectors = [
      'div[role="button"][aria-label*="edit" i]',
      'div[role="button"][aria-label*="düzenle" i]',
      'a[href*="/edit"]',
      'a[aria-label*="edit" i]'
    ];

    let clicked = false;
    for (const sel of editSelectors) {
      try {
        const locator = page.locator(sel);
        if (await locator.count() > 0) {
          console.log(`Clicking selector: ${sel}`);
          await locator.first().click();
          clicked = true;
          break;
        }
      } catch (e) {}
    }

    if (!clicked) {
      console.log("Fallback click at bottom-right corner...");
      await page.mouse.click(1325, 725);
    }

    await page.waitForTimeout(10000);

    const pages = await browserContext.pages();
    let editorPage = pages.find(p => p.url().includes('sites.google.com') && p.url().includes('/edit'));
    if (!editorPage) {
      console.log("Could not find editor tab by URL, using fallback...");
      editorPage = pages[pages.length - 1];
    }
    
    await editorPage.bringToFront();
    console.log(`Using editor page: ${editorPage.url()}`);

    console.log("⏳ Waiting for Editor interface...");
    await editorPage.waitForFunction(() => {
      const selectors = ['[aria-label="Embed"]', '[aria-label="Yerleştir"]', '[data-tooltip="Yerleştir"]', '[data-tooltip="Embed"]'];
      return selectors.some(sel => document.querySelector(sel) !== null);
    }, { timeout: 60000 });

    // Deselect
    console.log("🧹 Deselecting active elements by clicking top-left area...");
    await editorPage.mouse.click(300, 150);
    await editorPage.keyboard.press('Escape');
    await editorPage.keyboard.press('Escape');
    await editorPage.waitForTimeout(2000);

    console.log("🔗 Opening Embed menu...");
    await editorPage.evaluate(() => {
      const selectors = ['[aria-label="Embed"]', '[aria-label="Yerleştir"]', '[data-tooltip="Yerleştir"]', '[data-tooltip="Embed"]'];
      for (const sel of selectors) {
        const el = document.querySelector(sel) as HTMLElement;
        if (el) { el.click(); return true; }
      }
      return false;
    });

    console.log("⏳ Waiting for Embed tabs...");
    await editorPage.waitForSelector('div[role="tablist"] div:nth-child(2)', { timeout: 15000 });
    // Click "Embed code" tab
    await editorPage.evaluate(() => {
      const tabs = document.querySelectorAll('div[role="tablist"] div');
      if (tabs.length >= 2) {
        (tabs[1] as HTMLElement).click();
      }
    });

    console.log("📝 Pasting embed HTML code...");
    await editorPage.waitForSelector('textarea', { timeout: 15000 });
    await editorPage.fill('textarea', EMBED_HTML);
    await editorPage.waitForTimeout(2000);

    console.log("➡️ Clicking 'Next'...");
    await editorPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const next = btns.find(b => ['next', 'ileri', 'sonraki'].some(t => b.textContent?.toLowerCase().includes(t)));
      if (next) next.click();
    });
    await editorPage.waitForTimeout(4000);

    console.log("📥 Clicking 'Insert'...");
    await editorPage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const insert = btns.find(b => ['insert', 'ekle'].some(t => b.textContent?.toLowerCase().includes(t)));
      if (insert) insert.click();
    });
    await editorPage.waitForTimeout(5000);

    console.log("📡 Publishing restored page...");
    const publishBtn = editorPage.locator('div[role="button"]:has-text("Yayınla"), div[role="button"]:has-text("Publish")');
    if (await publishBtn.count() > 0) {
      await publishBtn.first().click();
      await editorPage.waitForTimeout(6000);

      const confirmed = await editorPage.evaluate(() => {
        const els = Array.from(document.querySelectorAll('button, div[role="button"]'));
        const matches = els.filter(el => {
          const txt = el.textContent?.trim().toLowerCase() || '';
          return txt.includes('yayınla') || txt.includes('publish');
        }) as HTMLElement[];

        if (matches.length > 0) {
          const lastBtn = matches[matches.length - 1];
          lastBtn.click();
          return true;
        }
        return false;
      });

      if (confirmed) {
        await editorPage.waitForTimeout(10000);
        console.log("✅ Restore successful!");
      }
    }

  } catch (error: any) {
    console.error("💥 Error during restore:", error.message);
  } finally {
    await browserContext.close();
    console.log("🛑 Browser closed.");
  }
}

restoreEmbed();
