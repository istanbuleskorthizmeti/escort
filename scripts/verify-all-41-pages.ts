import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const CLONE_DIR = 'c:\\Users\\onurk\\esc\\temp-clone-v1.0';
const DOCS_DIR = path.join(CLONE_DIR, 'docs', 'istanbul-escorts');

async function verifyPage(url: string): Promise<boolean> {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    const html = res.data;
    if (html.includes('Unable to render content') || html.includes('Page content is not renderable')) {
      return false;
    }
    return true;
  } catch (err: any) {
    console.error(`Error fetching ${url}:`, err.message);
    return false;
  }
}

async function run() {
  console.log("Checking all pages in temp-clone-v1.0/docs/istanbul-escorts...");
  const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'));
  
  let failedCount = 0;
  for (const file of files) {
    const slug = file.replace('.md', '');
    const url = `https://istanbul-eskort-hizmeti.readme.io/docs/${slug}`;
    const ok = await verifyPage(url);
    if (!ok) {
      console.error(`❌ Page failed render check: ${url}`);
      failedCount++;
    } else {
      console.log(`✅ Page render OK: ${url}`);
    }
  }

  console.log(`\nScan completed. Total failed pages: ${failedCount}/${files.length}`);
}

run().catch(console.error);
