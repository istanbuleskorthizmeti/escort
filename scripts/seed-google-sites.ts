import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

const googleSitesKeywords = [
  'sefaköy escort', 'sefaköy eskort', 'sefakoy escort', 'sefakoy eskort',
  'bakırköy escort', 'bakırköy eskort', 'bakirkoy escort', 'bakirkoy eskort',
  'çatalca escort', 'çatalca eskort', 'catalca escort', 'catalca eskort',
  'beylikdüzü escort', 'beylikdüzü eskort', 'beylikduzu escort', 'beylikduzu eskort',
  'beşyol escort', 'beşyol eskort', 'besyol escort', 'besyol eskort',
  'istanbul escort', 'istanbul eskort',
  'sancaktepe escort', 'sancaktepe eskort',
  'kartal escort', 'kartal eskort',
  'çekmeköy escort', 'çekmeköy eskort', 'cekmekoy escort', 'cekmekoy eskort',
  'arnavutköy escort', 'arnavutköy eskort', 'arnavutkoy escort', 'arnavutkoy eskort',
  'başakşehir escort', 'başakşehir eskort', 'basaksehir escort', 'basaksehir eskort',
  'esenler escort', 'esenler eskort',
  'adalar escort', 'adalar eskort',
  'silivri escort', 'silivri eskort',
  'beyoğlu escort', 'beyoğlu eskort', 'beyoglu escort', 'beyoglu eskort'
];

// Remove duplicates
const uniqueKeywords = Array.from(new Set(googleSitesKeywords));

async function main() {
  console.log('🤖 [GOOGLE SITES SEEDER] Seeding sites.google.com tracking...');
  console.log('-----------------------------------------------------------');

  try {
    await ssh.connect(config);
    console.log('✅ Connected via SSH.');

    const dbPath = '/var/www/serpbear/data/database.sqlite';

    // 1. Get the current maximum IDs
    const maxDomainIdRes = await ssh.execCommand(`sqlite3 ${dbPath} "SELECT MAX(ID) FROM domain;"`);
    const startDomainId = parseInt(maxDomainIdRes.stdout.trim()) || 100;
    const nextDomainId = startDomainId + 1;

    const maxKeywordIdRes = await ssh.execCommand(`sqlite3 ${dbPath} "SELECT MAX(ID) FROM keyword;"`);
    let nextKeywordId = (parseInt(maxKeywordIdRes.stdout.trim()) || 1000) + 1;

    const nowStr = new Date().toISOString();
    const domainHost = 'sites.google.com';
    const domainSlug = 'sites-google-com';

    console.log(` • Seeding domain sites.google.com (ID: ${nextDomainId}) with ${uniqueKeywords.length * 2} (Desktop + Mobile) keywords...`);

    // 2. Insert sites.google.com domain
    const insertDomainSql = `INSERT INTO domain (ID, domain, slug, keywordCount, lastUpdated, added, tags, notification, notification_interval, notification_emails, search_console, scrape_strategy, scrape_pagination_limit, scrape_smart_full_fallback, subdomain_matching) VALUES (${nextDomainId}, '${domainHost}', '${domainSlug}', ${uniqueKeywords.length * 2}, '${nowStr}', '${nowStr}', '[]', 1, 'daily', '', '', '', 0, 0, '');`;
    const domainRes = await ssh.execCommand(`sqlite3 ${dbPath} "${insertDomainSql}"`);
    if (domainRes.stderr) {
      console.error(`   ❌ Failed to insert domain:`, domainRes.stderr);
    } else {
      console.log(`   ✔ Domain sites.google.com added successfully.`);
    }

    // 3. Insert keywords for both desktop and mobile
    for (const kw of uniqueKeywords) {
      // Desktop
      const insertDesktopSql = `INSERT INTO keyword (ID, keyword, device, country, city, latlong, domain, lastUpdated, added, position, history, volume, url, tags, lastResult, sticky, updating, lastUpdateError, settings) VALUES (${nextKeywordId}, '${kw}', 'desktop', 'TR', '', '', '${domainHost}', '${nowStr}', '${nowStr}', 0, '[]', 0, '[]', '[]', '[]', 1, 0, 0, '{}');`;
      const desktopRes = await ssh.execCommand(`sqlite3 ${dbPath} "${insertDesktopSql}"`);
      if (desktopRes.stderr) {
        console.error(`   ❌ Failed to insert desktop keyword ${kw}:`, desktopRes.stderr);
      }
      nextKeywordId++;

      // Mobile
      const insertMobileSql = `INSERT INTO keyword (ID, keyword, device, country, city, latlong, domain, lastUpdated, added, position, history, volume, url, tags, lastResult, sticky, updating, lastUpdateError, settings) VALUES (${nextKeywordId}, '${kw}', 'mobile', 'TR', '', '', '${domainHost}', '${nowStr}', '${nowStr}', 0, '[]', 0, '[]', '[]', '[]', 1, 0, 0, '{}');`;
      const mobileRes = await ssh.execCommand(`sqlite3 ${dbPath} "${insertMobileSql}"`);
      if (mobileRes.stderr) {
        console.error(`   ❌ Failed to insert mobile keyword ${kw}:`, mobileRes.stderr);
      }
      nextKeywordId++;
    }

    console.log(`✅ Seeding complete. Seeded sites.google.com with ${uniqueKeywords.length * 2} keywords.`);

    // Restart the docker container to load SQLite changes
    console.log(' • Restarting SerpBear container to load changes...');
    await ssh.execCommand('docker restart serpbear-app');
    console.log('   ✔ Container restarted.');

    // 4. Trigger bulk scrape via API POST /api/cron
    console.log(' • Triggering immediate SerpBear ranking update via POST /api/cron...');
    // We can curl directly from the VPS shell!
    const triggerRes = await ssh.execCommand('curl -X POST -H "Authorization: Bearer vuc_serp_apikey_2026" http://127.0.0.1:3000/api/cron');
    console.log('   API Response:', triggerRes.stdout || triggerRes.stderr);
    console.log('   ✔ Cron scrape job triggered successfully.');

  } catch (err: any) {
    console.error('Error during seeding:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
