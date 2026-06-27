import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const CLONE_DIR = 'c:\\Users\\onurk\\esc\\temp-clone-tamkumarbaz';
const DOCS_DIR = path.join(CLONE_DIR, 'docs', 'istanbul-escort-bayanlar');

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
  console.log("Checking all pages in temp-clone-tamkumarbaz/docs/istanbul-escort-bayanlar...");
  const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'));
  
  let failedCount = 0;
  const failedPages: string[] = [];
  
  // We can check them in chunks or sequential (let's do chunked sequential to be safe with rate limits)
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const slug = file.replace('.md', '');
    const url = `https://istanbul-escort.readme.io/docs/${slug}`;
    
    // Print progress every 30 files
    if (i % 30 === 0) {
      console.log(`Checking page ${i + 1}/${files.length}...`);
    }

    const ok = await verifyPage(url);
    if (!ok) {
      console.error(`❌ Page failed render check: ${url}`);
      failedCount++;
      failedPages.push(url);
    }
  }

  console.log(`\nScan completed. Total failed pages: ${failedCount}/${files.length}`);
  if (failedPages.length > 0) {
    console.log("Failed page URLs:", failedPages);
  }
}

run().catch(console.error);
