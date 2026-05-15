
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import os from 'os';

/**
 * 🧛‍♂️ PDF EXPORT MODULE (GOD MODE)
 * Hazırlanan HTML mühimmatını profesyonel PDF olarak masaüstüne kaydeder.
 */

async function savePdfToDesktop() {
  const desktopPath = path.join(os.homedir(), 'Desktop');
  const htmlPath = path.join(process.cwd(), 'parasite_hub', 'ULTIMATE_VIP_GUIDE_2026.html');
  const pdfName = 'ULTIMATE_VIP_GUIDE_2026.pdf';
  const finalPath = path.join(desktopPath, pdfName);

  if (!fs.existsSync(htmlPath)) {
    console.error("❌ Mühimmat bulunamadı! Önce generate-pdf-bomb.ts çalışmalı.");
    return;
  }

  console.log(`📡 [GOD MODE] Converting HTML to PDF...`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  console.log(`📄 Exporting to: ${finalPath}`);
  await page.pdf({
    path: finalPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
  });

  await browser.close();
  console.log(`\n🌟 [MISSION SUCCESS]`);
  console.log(`PDF mühimmatı masaüstüne mühürlendi kardo: ${pdfName}`);
}

savePdfToDesktop().catch(console.error);
