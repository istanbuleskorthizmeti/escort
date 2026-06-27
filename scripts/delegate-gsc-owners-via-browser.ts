import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

chromium.use(stealth());

const SERVICE_ACCOUNTS = [
  'e-imza-336@lyrical-edition-500119-s3.iam.gserviceaccount.com',
  'eimza-362@model-osprey-500119-v9.iam.gserviceaccount.com',
  'eimza-390@starry-hearth-500119-u2.iam.gserviceaccount.com'
];

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = await context.newPage();

  // 1. Initial check & login wait
  console.log("📡 Navigating to Google Search Console to check authentication...");
  await page.goto('https://search.google.com/search-console/welcome', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(3000);

  if (page.url().includes('accounts.google.com') || page.url().includes('signin')) {
    console.log("\n⚠️  [ACTION REQUIRED] ⚠️");
    console.log("Lütfen ekranda açılan Chrome tarayıcısında info@dorukcanay.digital Google hesabınızla giriş yapın.");
    console.log("Giriş yapmanız bekleniyor...\n");

    // Wait until url no longer contains accounts.google.com or signin
    while (page.url().includes('accounts.google.com') || page.url().includes('signin')) {
      await page.waitForTimeout(2000);
    }
    console.log("✅ Giriş algılandı! İşlemlere devam ediliyor...");
    await page.waitForTimeout(3000);
  } else {
    console.log("✅ Zaten giriş yapılmış. Devam ediliyor...");
  }

  // Load sites from live_google_sites.json or use hardcoded ones
  const sitesPath = path.join(process.cwd(), 'data', 'live_google_sites.json');
  let sites: string[] = [];
  if (fs.existsSync(sitesPath)) {
    sites = JSON.parse(fs.readFileSync(sitesPath, 'utf8'));
  } else {
    sites = [
      "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/istanbul-escort/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/sancaktepe-escort-drkcnay1-v/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/cekmekoy-escort-drkcnay1-v/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/arnavutkoy-escort-drkcnay1-v/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/basaksehir-escort-drkcnay1-v/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/adalar-escort-drkcnay1-v/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/silivriescort-drkcnay2026/ana-sayfa",
      "https://sites.google.com/dorukcanay.digital/beyoglu-escort-drkcnay1-v/ana-sayfa"
    ];
  }

  console.log(`Loaded ${sites.length} sites for delegation.`);

  for (const siteUrl of sites) {
    const baseSiteUrl = siteUrl.replace('/ana-sayfa', '').endsWith('/') 
      ? siteUrl.replace('/ana-sayfa', '') 
      : `${siteUrl.replace('/ana-sayfa', '')}/`;
      
    const exactPageUrl = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;

    const targets = [baseSiteUrl, exactPageUrl];

    for (const targetUrl of targets) {
      console.log(`\n⚙️ Processing target: ${targetUrl}`);

      for (const email of SERVICE_ACCOUNTS) {
        const delegateUrl = `https://www.google.com/webmasters/verification/add-owner?hl=en&siteUrl=${encodeURIComponent(targetUrl)}`;
        
        try {
          console.log(`   👉 Navigating to add-owner page for ${email}...`);
          await page.goto(delegateUrl, { waitUntil: 'load', timeout: 30000 });
          await page.waitForTimeout(2000);

          // Check if login was required again
          if (page.url().includes('accounts.google.com') || page.url().includes('signin')) {
            console.log("⚠️ Oturum kapandı veya tekrar giriş gerekiyor. Lütfen giriş yapın...");
            while (page.url().includes('accounts.google.com') || page.url().includes('signin')) {
              await page.waitForTimeout(2000);
            }
            await page.goto(delegateUrl, { waitUntil: 'load', timeout: 30000 });
          }

          // Check if already an owner or if input is available
          const hasInput = await page.locator('input[name="newOwner"]').isVisible();
          if (!hasInput) {
            console.log(`   ℹ️ Already delegated or page not accessible.`);
            continue;
          }

          console.log(`   ✍️ Filling email: ${email}`);
          await page.fill('input[name="newOwner"]', email);
          await page.waitForTimeout(1000);

          console.log(`   button click: Submit / Ekle`);
          await page.click('input[type="submit"]');
          await page.waitForTimeout(3000);

          const pageContent = await page.content();
          if (pageContent.includes('Success') || pageContent.includes('is now an owner') || pageContent.includes('sahip olarak eklendi') || pageContent.includes('Doğrulandı')) {
            console.log(`   ✅ Success: ${email} is now an owner for ${targetUrl}`);
          } else {
            console.log(`   ⚠️ Checked content: Success confirmation not found, but add attempt completed.`);
          }

        } catch (err: any) {
          console.error(`   ❌ Failed delegation for ${email} on ${targetUrl}:`, err.message);
        }
      }
    }
  }

  await page.close();
  await browser.close();
  console.log("\n🏁 [DELEGATION COMPLETE] All Google Sites processed.");
}

run().catch(console.error);
