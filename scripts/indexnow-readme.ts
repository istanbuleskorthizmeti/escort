import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DESKTOP_PATH = 'C:\\Users\\onurk\\Desktop';
const SOURCE_DIR = path.join(DESKTOP_PATH, 'readme-docs-dorukcanay');

const INDEX_NOW_KEY = process.env.INDEX_NOW_KEY || "8771e07e4e31024024720e4a348e10f0";
const readmeSubdomain = process.env.README_SUBDOMAIN || "istanbul-escort";
const readmeBaseUrl = `https://${readmeSubdomain}.readme.io`;

function submitBulkIndexNow(host: string, urls: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const payload = JSON.stringify({
        host: host,
        key: INDEX_NOW_KEY,
        urlList: urls
      });

      const options = {
        hostname: 'api.indexnow.org',
        port: 443,
        path: '/indexnow',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 10000
      };

      const req = https.request(options, (res) => {
        console.log(`📡 IndexNow status: ${res.statusCode} (${res.statusMessage})`);
        resolve(res.statusCode === 200 || res.statusCode === 202);
      });

      req.on('error', (err) => {
        console.error('❌ IndexNow Connection error:', err.message);
        resolve(false);
      });

      req.write(payload);
      req.end();
    } catch (e) {
      resolve(false);
    }
  });
}

async function run() {
  console.log(`🚀 Loading all actual ReadMe.io URLs from generated directory...`);
  
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source folder ${SOURCE_DIR} does not exist. Please generate pages first.`);
    process.exit(1);
  }

  const files = fs.readdirSync(SOURCE_DIR);
  const urls: string[] = [];

  for (const file of files) {
    if (file.endsWith('.md')) {
      const slug = file.replace('.md', '');
      urls.push(`${readmeBaseUrl}/docs/${slug}`);
    }
  }

  console.log(`📋 Total URLs loaded: ${urls.length}`);
  console.log(`📡 Submitting URLs to IndexNow API via POST...`);

  const host = `${readmeSubdomain}.readme.io`;
  const success = await submitBulkIndexNow(host, urls);
  
  if (success) {
    console.log(`🎉 IndexNow Bulk Submission Success!`);
  } else {
    console.error(`❌ IndexNow Bulk Submission Failed.`);
  }
}

run().catch(console.error);
