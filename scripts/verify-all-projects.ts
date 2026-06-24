import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

async function getGAId(page: any, subdomain: string) {
  const integrationsUrl = `https://${subdomain}.readme.io/docs/getting-started#/settings/integrations`;
  console.log(`🔍 Navigating to integrations for ${subdomain}...`);
  await page.goto(integrationsUrl, { waitUntil: 'load', timeout: 45000 }).catch(async () => {
    const fallbackUrl = `https://${subdomain}.readme.io/docs/istanbul-besiktas-escort#/settings/integrations`;
    await page.goto(fallbackUrl, { waitUntil: 'load', timeout: 45000 });
  });
  await page.waitForTimeout(6000);

  const val = await page.evaluate(() => {
    const gaInput = document.querySelector('input[name="integrations.google.analytics"]') as HTMLInputElement;
    if (gaInput) return gaInput.value;
    const idGa = document.getElementById('google_analytics') as HTMLInputElement;
    if (idGa) return idGa.value;
    return null;
  });

  return val;
}

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  
  if (contexts.length === 0) {
    console.error("❌ No contexts found!");
    return;
  }

  const context = contexts[0];
  const page = await context.newPage();

  try {
    // 1. Verify istanbul-escort
    const ga1 = await getGAId(page, 'istanbul-escort');
    console.log(`📊 [istanbul-escort] Google Analytics ID: ${ga1}`);

    // 2. Verify istanbul-eskort-hizmeti
    const ga2 = await getGAId(page, 'istanbul-eskort-hizmeti');
    console.log(`📊 [istanbul-eskort-hizmeti] Google Analytics ID: ${ga2}`);

    console.log("\n🚀 Verification Summary:");
    console.log(`- istanbul-escort target: G-TJ3T8823ZP | Current: ${ga1}`);
    console.log(`- istanbul-eskort-hizmeti target: G-05M3C339NN | Current: ${ga2}`);

  } catch (err: any) {
    console.error("❌ Error during verification:", err.message);
  } finally {
    await page.close();
  }
}

run().catch(console.error);
