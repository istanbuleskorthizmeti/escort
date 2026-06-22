import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const googleSites = [
  "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/ana-sayfa",
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

const INDEX_NOW_KEY = process.env.INDEX_NOW_KEY || '8f7c9e0a2b4d6f8a0c2e4f6a8b0d2e4f';

async function runAggressivePings() {
  console.log('🧛‍♂️ [HYDRA PING ENGINE v3.0 - ATTACK MODE]');
  console.log('--------------------------------------------------');

  for (const siteUrl of googleSites) {
    const cleanUrl = siteUrl.replace('/ana-sayfa', '');
    const basePropertyUrl = cleanUrl.endsWith('/') ? cleanUrl : `${cleanUrl}/`;
    const sitemapUrl = `${basePropertyUrl}system/feeds/sitemap`;
    
    console.log(`\n🌍 Target: ${basePropertyUrl}`);

    // 1. Google Sitemap Raw Ping
    try {
      const gPingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const res = await axios.get(gPingUrl, { timeout: 8000 });
      console.log(`   ✅ Google Sitemap Ping Sent (Status: ${res.status})`);
    } catch (err: any) {
      console.log(`   ❌ Google Sitemap Ping Failed: ${err.message}`);
    }

    // 2. Google URL Raw Ping (Force crawl request)
    try {
      const gUrlPing = `https://www.google.com/ping?sitemap=${encodeURIComponent(siteUrl)}`;
      const res = await axios.get(gUrlPing, { timeout: 8000 });
      console.log(`   ✅ Google Page URL Ping Sent (Status: ${res.status})`);
    } catch (err: any) {
      console.log(`   ❌ Google Page URL Ping Failed: ${err.message}`);
    }

    // 3. Bing IndexNow Ping
    try {
      const bingUrl = `https://www.bing.com/indexnow?url=${encodeURIComponent(siteUrl)}&key=${INDEX_NOW_KEY}`;
      const res = await axios.get(bingUrl, { timeout: 8000 });
      console.log(`   ✅ Bing IndexNow Ping Sent (Status: ${res.status})`);
    } catch (err: any) {
      console.log(`   ❌ Bing IndexNow Ping Failed: ${err.message}`);
    }

    // 4. Yandex IndexNow Ping
    try {
      const yandexUrl = `https://yandex.com/indexnow?url=${encodeURIComponent(siteUrl)}&key=${INDEX_NOW_KEY}`;
      const res = await axios.get(yandexUrl, { timeout: 8000 });
      console.log(`   ✅ Yandex IndexNow Ping Sent (Status: ${res.status})`);
    } catch (err: any) {
      console.log(`   ❌ Yandex IndexNow Ping Failed: ${err.message}`);
    }

    // Anti-spam delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n🏆 [DONE] Hybrid Aggressive Ping campaign completed successfully.');
}

runAggressivePings().catch(err => {
  console.error('🔥 Error running aggressive pings:', err);
});
