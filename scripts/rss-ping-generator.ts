import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { istanbulCity } from '../lib/locations-registry/istanbul';

const HOST = 'istanbul-eskort-hizmeti.readme.io';
const BING_INDEX_NOW = 'https://www.bing.com/indexnow';
const INDEX_NOW_KEY = '8f7c9e0a2b4d6f8a0c2e4f6a8b0d2e4f';

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

// XML-RPC Ping Endpoints
const pingServices = [
  { name: 'Pingomatic', url: 'http://rpc.pingomatic.com/' },
  { name: 'Twingly', url: 'http://rpc.twingly.com/' },
  { name: 'Feedburner', url: 'http://ping.feedburner.com' },
  { name: 'Blo.gs', url: 'http://ping.blo.gs/' }
];

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

async function sendRpcPing(serviceUrl: string, serviceName: string, feedUrl: string) {
  const xmlPayload = `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.ping</methodName>
  <params>
    <param>
      <value>İstanbul VIP Escort Randevu Rehberi</value>
    </param>
    <param>
      <value>${feedUrl}</value>
    </param>
  </params>
</methodCall>`.trim();

  try {
    const response = await axios.post(serviceUrl, xmlPayload, {
      headers: { 'Content-Type': 'text/xml' },
      timeout: 5000
    });
    console.log(`   ✅ ${serviceName} RPC Ping tetiklendi. Response status: ${response.status}`);
    return true;
  } catch (err: any) {
    console.log(`   ❌ ${serviceName} RPC Ping başarısız: ${err.message}`);
    return false;
  }
}

async function runRssSystem() {
  console.log('🧛‍♂️ [RSS HYDRA SYSTEM] RSS Feed oluşturma ve RPC pingleme başlatılıyor...');
  console.log('----------------------------------------------------------------------');

  const items: string[] = [];
  const now = new Date().toUTCString();

  // Add Google Sites links
  googleSites.forEach(url => {
    const name = url.replace('https://sites.google.com/dorukcanay.digital/', '').replace(/-/g, ' ').toUpperCase();
    items.push(`    <item>
      <title>${name} - VIP Escort Paravan Geçidi</title>
      <link>${url}</link>
      <description>İstanbul kaporasız ve VIP eskort randevuları için güncel doğrulanmış giriş kapısı.</description>
      <pubDate>${now}</pubDate>
      <guid>${url}</guid>
    </item>`);
  });

  // Add Stoplight links
  for (const district of istanbulCity.districts) {
    const cleanDistrictName = district.name.replace(/\s+escort/gi, '').trim();
    const districtSlug = slugify(cleanDistrictName);
    const distUrl = `https://${HOST}/docs/istanbul-${districtSlug}-escort`;

    items.push(`    <item>
      <title>İstanbul ${cleanDistrictName} Escort Bayan İlanları</title>
      <link>${distUrl}</link>
      <description>İstanbul genelinde en elit, kaporasız VIP model profilleri ve randevu telefonları.</description>
      <pubDate>${now}</pubDate>
      <guid>${distUrl}</guid>
    </item>`);

    for (const neighborhood of district.neighborhoods) {
      const neighborhoodSlug = slugify(neighborhood.name);
      const neighUrl = `https://${HOST}/docs/istanbul-${districtSlug}-${neighborhoodSlug}-escort`;

      items.push(`    <item>
      <title>${cleanDistrictName} ${neighborhood.name} Escort Hizmeti</title>
      <link>${neighUrl}</link>
      <description>${neighborhood.name} mahallesi içi özel, doğrulanmış VIP eskort iş ortaklığı rehberi.</description>
      <pubDate>${now}</pubDate>
      <guid>${neighUrl}</guid>
    </item>`);
    }
  }

  // Build full RSS XML
  const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>İstanbul VIP Escort &amp; Randevu Rehberi</title>
  <link>https://${HOST}</link>
  <description>Doğrulanmış ve kaporasız İstanbul elit eskort bayan ilanları, paravan geçitleri ve GBP harita sinyalleri.</description>
  <language>tr</language>
  <lastBuildDate>${now}</lastBuildDate>
  <atom:link href="https://raw.githubusercontent.com/guondyshop-del/istanbulescort/main/rss.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
</channel>
</rss>`.trim();

  // Save RSS file locally
  const rssPath = path.join(process.cwd(), 'rss.xml');
  fs.writeFileSync(rssPath, rssContent);
  console.log(`✅ RSS Feed dosyası başarıyla üretildi: ${rssPath}`);

  // Deploy RSS feed to public repository (making it raw accessible to bots)
  console.log('🚀 RSS dosyasını kamuflaj deposuna pushluyoruz...');
  const execSync = require('child_process').execSync;
  try {
    const tempDir = path.join(process.cwd(), 'rss-temp');
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    fs.mkdirSync(tempDir);

    // Copy sitemap README and add rss.xml
    fs.copyFileSync(path.join(process.cwd(), 'crawler-trap.md'), path.join(tempDir, 'README.md'));
    fs.copyFileSync(rssPath, path.join(tempDir, 'rss.xml'));

    // Push using temporary git
    execSync('git init', { cwd: tempDir });
    execSync('git checkout -b main', { cwd: tempDir });
    execSync('git add .', { cwd: tempDir });
    execSync('git commit -m "feat: updates RSS feed index"', { cwd: tempDir });
    execSync('git push https://github.com/guondyshop-del/istanbulescort.git main --force', { cwd: tempDir });
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('✅ RSS Feed dosyası başarıyla GitHub üzerinden yayına alındı!');
  } catch (err) {
    console.error('❌ GitHub push hatası:', err);
  }

  // 3. RPC Ping
  console.log('\n📡 XML-RPC Ping dizinleri tetikleniyor...');
  const rawRssUrl = 'https://raw.githubusercontent.com/guondyshop-del/istanbulescort/main/rss.xml';
  for (const service of pingServices) {
    await sendRpcPing(service.url, service.name, rawRssUrl);
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  console.log('\n🏆 [DONE] RSS pingleme operasyonu başarıyla tamamlandı.');
}

runRssSystem().catch(console.error);
