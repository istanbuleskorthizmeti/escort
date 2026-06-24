import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import path from 'path';

chromium.use(stealth());

async function configureProject(browser: any, subdomain: string) {
  console.log(`🔧 Configuring integrations for project: ${subdomain}...`);
  const contexts = browser.contexts();
  if (contexts.length === 0) return;
  const context = contexts[0];
  const page = await context.newPage();

  try {
    const integrationsUrl = `https://${subdomain}.readme.io/docs/getting-started#/settings/integrations`;
    console.log(`Navigating to: ${integrationsUrl}`);
    await page.goto(integrationsUrl, { waitUntil: 'load', timeout: 30000 }).catch(async () => {
      // Fallback url
      const fallbackUrl = `https://${subdomain}.readme.io/docs/istanbul-besiktas-escort#/settings/integrations`;
      console.log(`Retrying with fallback url: ${fallbackUrl}`);
      await page.goto(fallbackUrl, { waitUntil: 'load', timeout: 30000 });
    });
    
    await page.waitForTimeout(6000);

    const fillSuccess = await page.evaluate(() => {
      const gaInput = document.querySelector('input[name="integrations.google.analytics"]') as HTMLInputElement;
      const gscInput = document.querySelector('input[name="integrations.google.site_verification"]') as HTMLInputElement;

      if (gaInput) {
        gaInput.value = 'G-05M3C339NN';
        gaInput.dispatchEvent(new Event('input', { bubbles: true }));
        gaInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (gscInput) {
        gscInput.value = 'blR9C6PaZE-_yAVhnbK7o9PD1IWmlxQUzVnGMf3fHrI';
        gscInput.dispatchEvent(new Event('input', { bubbles: true }));
        gscInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      return {
        gaFound: !!gaInput,
        gscFound: !!gscInput,
        gaVal: gaInput ? gaInput.value : '',
        gscVal: gscInput ? gscInput.value : ''
      };
    });

    console.log(`[${subdomain}] Fill action result:`, fillSuccess);

    // Save the form
    await page.evaluate(() => {
      const saveBtn = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent?.toLowerCase().includes('save') || 
        btn.textContent?.toLowerCase().includes('update')
      );
      if (saveBtn) {
        saveBtn.click();
      }
    });

    await page.waitForTimeout(4000);
    console.log(`[${subdomain}] Integrations setup completed!`);
    await page.screenshot({ path: path.join(process.cwd(), `readme-${subdomain}-integrations-saved.png`) });

  } catch (err: any) {
    console.error(`[${subdomain}] Error:`, err.message);
  } finally {
    await page.close();
  }
}

async function run() {
  console.log("🔌 Connecting to running Chrome on port 9222...");
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  
  // Configure both projects!
  await configureProject(browser, 'istanbul-escort');
  await configureProject(browser, 'istanbul-eskort-hizmeti');

  await browser.close();
}

run().catch(console.error);
