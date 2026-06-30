import axios from "axios";

const indexNowKey = process.env.INDEX_NOW_KEY || "8771e07e4e31024024720e4a348e10f0";

const urlsToPing = [
  "https://istanbulescort.blog/sitemap.xml",
  "https://dorukcanay.digital/sitemap.xml",
  "https://istanbulescort.blog/rss.xml",
  "https://dorukcanay.digital/rss.xml",
  "https://istanbul-eskort-hizmeti.readme.io/sitemap.xml",
  "https://istanbulescort.blog/amp",
  "https://dorukcanay.digital/amp",
  "https://istanbulescort.blog/feed.xml"
];

import fs from 'fs';
import path from 'path';

try {
    const filePath = path.join(process.cwd(), 'data', 'live_google_sites.json');
    if (fs.existsSync(filePath)) {
        const sites = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        sites.forEach((site: string) => urlsToPing.push(site));
    }
} catch (e) {
    console.error("Failed to read google sites", e);
}

async function pingAll() {
  console.log(`🚀 [ULTRA-PING] Pinging ${urlsToPing.length} resources...`);
  for (const url of urlsToPing) {
    try {
      await axios.get(`https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`, { timeout: 10000 });
      console.log(`✅ [Google] Pinned: ${url}`);
    } catch (e: any) {
      console.log(`⚠️ [Google] Ping failed for ${url}: ${e.message}`);
    }
    try {
      await axios.get(`https://www.bing.com/indexnow?url=${encodeURIComponent(url)}&key=${indexNowKey}`, { timeout: 10000 });
      console.log(`✅ [Bing] Pinned: ${url}`);
    } catch (e: any) {
      console.log(`⚠️ [Bing] Ping failed for ${url}: ${e.message}`);
    }
  }
  console.log("🎉 All pinging complete.");
}

pingAll();
