import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

puppeteer.use(StealthPlugin());

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const url = 'https://www.google.com.tr/search?q=bat%C4%B1%C5%9Fehir+eskort&num=50&hl=tr&gl=tr';
    console.log('Navigating to:', url);
    await page.goto(url, { waitUntil: 'networkidle2' });

    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(a => ({
        text: (a.textContent || '').trim().replace(/\s+/g, ' '),
        href: a.href
      })).filter(l => l.href);
    });

    const output = links.map(l => `TEXT: ${l.text}\nHREF: ${l.href}\n---`).join('\n');
    fs.mkdirSync(path.join(process.cwd(), 'scratch'), { recursive: true });
    fs.writeFileSync(path.join(process.cwd(), 'scratch/serp-links.txt'), output);
    console.log('Successfully wrote serp-links.txt. Count:', links.length);
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

run();
