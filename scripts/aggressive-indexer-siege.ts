import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { googleAuth } from '../lib/google-auth';
import { istanbulCity } from '../lib/locations-registry/istanbul';

// Target Assets Configuration
const googleSites = [
  "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort",
  "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort",
  "https://sites.google.com/dorukcanay.digital/beyoglu-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/istanbul-escort",
  "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026",
  "https://sites.google.com/dorukcanay.digital/silivriescort-drkcnay2026",
  "https://sites.google.com/dorukcanay.digital/grandveracasino-grandverabahis/grandvera/"
];

const githubPages = [
  "https://github.com/guondyshop-del/istanbulescort",
  "https://github.com/guondyshop-del/istanbulescort/blob/main/README.md"
];

const BING_INDEX_NOW = 'https://www.bing.com/indexnow';
const INDEX_NOW_KEY = '8f7c9e0a2b4d6f8a0c2e4f6a8b0d2e4f';

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function runIndexNow(url: string) {
  try {
    const requestUrl = `${BING_INDEX_NOW}?url=${encodeURIComponent(url)}&key=${INDEX_NOW_KEY}`;
    await axios.get(requestUrl, { timeout: 3500 });
    return true;
  } catch (err: any) {
    return false;
  }
}

async function runGooglePing(sitemapUrl: string) {
  try {
    const pingEndpoint = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const res = await axios.get(pingEndpoint, { timeout: 3500 });
    return res.status === 200;
  } catch {
    return false;
  }
}

async function startAggressiveSiege() {
  console.log('🔥 [HYDRA AGGRESSIVE SIEGE] Aggressive SEO indexer initialization...');
  console.log('------------------------------------------------------------------');

  // Collect all Stoplight target URLs
  const stoplightUrls: string[] = [
    'https://escort-randevu.stoplight.io/',
    'https://escort-randevu.stoplight.io/docs/README',
    'https://escort-randevu.stoplight.io/docs/istanbul-escort-kaporas-z-sar-n-eskort-eda/9aceuyz2hhdpq-istanbul-escort-and-istanbul-escort-bayan-ilanlari-elit-ve-vip-randevu-rehberi'
  ];

  for (const district of istanbulCity.districts) {
    const cleanDistrictName = district.name.replace(/\s+escort/gi, '').trim();
    const districtSlug = slugify(cleanDistrictName);
    stoplightUrls.push(`https://escort-randevu.stoplight.io/docs/istanbul-${districtSlug}-escort`);

    for (const neighborhood of district.neighborhoods) {
      const neighborhoodSlug = slugify(neighborhood.name);
      stoplightUrls.push(`https://escort-randevu.stoplight.io/docs/istanbul-${districtSlug}-${neighborhoodSlug}-escort`);
    }
  }

  // Aggregate all URLs to ping
  const allUrls = [
    ...googleSites,
    ...githubPages,
    ...stoplightUrls
  ];

  console.log(`📡 Collected target list. Total URLs: ${allUrls.length}`);

  // 1. Trigger IndexNow for Bing/Yandex on all targets
  console.log('\n🚀 Stage 1: Broadcasting IndexNow API calls...');
  let indexNowSuccess = 0;
  for (let i = 0; i < allUrls.length; i++) {
    const success = await runIndexNow(allUrls[i]);
    if (success) indexNowSuccess++;
    // Small delay to prevent rate limit blocks
    if (i % 20 === 0 && i > 0) {
      process.stdout.write(`... ${i}/${allUrls.length} sent\n`);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }
  console.log(`✅ Stage 1 complete. IndexNow broadcast success: ${indexNowSuccess}/${allUrls.length}`);

  // 2. Trigger Google Ping for sitemap endpoints
  console.log('\n🚀 Stage 2: Direct Google HTTP sitemap pinging...');
  const sitemaps = [
    'https://escort-randevu.stoplight.io/sitemap.xml',
    ...googleSites.map(site => `${site}/system/feeds/sitemap`),
    'https://raw.githubusercontent.com/guondyshop-del/istanbulescort/main/README.md'
  ];

  let googlePingSuccess = 0;
  for (const sitemap of sitemaps) {
    const success = await runGooglePing(sitemap);
    if (success) {
      googlePingSuccess++;
      console.log(`   ✅ Google Ping success: ${sitemap}`);
    } else {
      console.log(`   ❌ Google Ping failed: ${sitemap}`);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  console.log(`✅ Stage 2 complete. Google sitemap pings success: ${googlePingSuccess}/${sitemaps.length}`);

  // 3. API Submissions (Google Search Console Credentials)
  console.log('\n🚀 Stage 3: Google Search Console API injection...');
  let apiSuccess = 0;
  for (const siteUrl of googleSites) {
    try {
      const siteUrlWithSlash = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
      const sitemapUrl = `${siteUrl}/system/feeds/sitemap`;

      console.log(`   🔗 Injecting API actions for ${siteUrlWithSlash}...`);
      await googleAuth.submitSitemap(siteUrlWithSlash, sitemapUrl);
      await googleAuth.forceIndexUrl(siteUrlWithSlash, 'URL_UPDATED');
      apiSuccess++;
    } catch (err: any) {
      console.log(`   ❌ API submission failed for ${siteUrl}: ${err.message}`);
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  console.log(`✅ Stage 3 complete. Google API injections success: ${apiSuccess}/${googleSites.length}`);

  console.log('\n🏆 [ALL SECTIONS COMPLETE] Aggressive Indexing pulse successfully deployed.');
}

startAggressiveSiege().catch(console.error);
