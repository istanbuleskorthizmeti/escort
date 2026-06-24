import { googleAuth } from '../lib/google-auth';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const SOURCE_DIR = 'C:\\Users\\onurk\\Desktop\\readme-docs-dorukcanay';
const readmeSubdomain = process.env.README_SUBDOMAIN || "istanbul-eskort-hizmeti";
const readmeBaseUrl = `https://${readmeSubdomain}.readme.io`;

async function run() {
  console.log('🚀 Loading all generated ReadMe documentation pages...');

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source directory ${SOURCE_DIR} not found. Please run the generation script first.`);
    process.exit(1);
  }

  const files = fs.readdirSync(SOURCE_DIR);
  const urls: string[] = [];

  // Add main landing page first
  urls.push(`${readmeBaseUrl}/docs/getting-started`);

  for (const file of files) {
    if (file.endsWith('.md')) {
      const slug = file.replace('.md', '');
      urls.push(`${readmeBaseUrl}/docs/${slug}`);
    }
  }

  // Remove duplicates just in case
  const uniqueUrls = Array.from(new Set(urls));
  console.log(`📋 Total unique URLs loaded for force-indexing: ${uniqueUrls.length}`);

  console.log(`🔑 Service Account count available: ${googleAuth.getServiceAccountCount()}`);

  console.log('⚡ Starting Bulk Google Indexing API Submissions...');
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < uniqueUrls.length; i++) {
    const url = uniqueUrls[i];
    console.log(`\n[${i + 1}/${uniqueUrls.length}] ⏳ Submitting: ${url}`);
    
    try {
      const result = await googleAuth.forceIndexUrl(url, 'URL_UPDATED');
      if (result) {
        console.log(`✅ Indexed: ${url}`);
        successCount++;
      } else {
        console.warn(`⚠️ Skipped/Failed: ${url}`);
        failCount++;
      }
    } catch (err: any) {
      console.error(`❌ Failed to submit ${url}:`, err.message);
      failCount++;
    }

    // Add a tiny delay to prevent rate limits
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  console.log(`\n🏆 [DONE] Google Indexing API Bulk Process Completed!`);
  console.log(`📈 Success: ${successCount} | Failed: ${failCount}`);
}

run().catch(console.error);
