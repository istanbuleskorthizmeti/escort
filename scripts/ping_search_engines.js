const https = require('https');
const http = require('http');

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

// Search engines that support simple GET pings
const searchEngines = [
  { name: 'Bing', url: 'https://www.bing.com/ping?sitemap=' },
  { name: 'Yandex', url: 'https://webmaster.yandex.com/ping?sitemap=' },
  { name: 'Seznam', url: 'https://search.seznam.cz/sitemap-ping?sitemap=' }
];

async function pingUrl(engine, sitemapUrl) {
  const pingEndpoint = `${engine.url}${encodeURIComponent(sitemapUrl)}`;
  return new Promise((resolve) => {
    const req = https.get(pingEndpoint, (res) => {
      // Discard data
      res.on('data', () => {});
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve({ success: true, status: res.statusCode });
        } else {
          resolve({ success: false, status: res.statusCode });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });

    req.end();
  });
}

const moneySiteSitemaps = [
  "https://dorukcanay.digital/sitemap.xml",
  "https://dorukcanay.digital/sitemap-index.xml",
  "https://dorukcanay.digital/sitemap-districts.xml",
  "https://dorukcanay.digital/sitemap-categories.xml",
  "https://dorukcanay.digital/sitemap-vip.xml",
  "https://dorukcanay.digital/feed.xml",
  "https://istanbulescort.blog/sitemap.xml",
  "https://istanbulescort.blog/sitemap-index.xml",
  "https://istanbulescort.blog/sitemap-districts.xml",
  "https://istanbulescort.blog/sitemap-categories.xml",
  "https://istanbulescort.blog/sitemap-vip.xml",
  "https://istanbulescort.blog/feed.xml",
  "https://istanbul-eskort-hizmeti.readme.io/sitemap.xml"
];

// Add Dynamic Subdomains
const districts = [
  'besiktas', 'sisli', 'beylikduzu', 'kadikoy', 'bakirkoy', 
  'atasehir', 'esenyurt', 'fatih', 'bagcilar', 'bahcelievler'
];

districts.forEach(d => {
  moneySiteSitemaps.push(`https://${d}.dorukcanay.digital/sitemap.xml`);
  moneySiteSitemaps.push(`https://${d}.istanbulescort.blog/sitemap.xml`);
});

async function runPing() {
  console.log('🚀 [GOD MODE] Başlatılıyor: Küresel Arama Motoru Ping Operasyonu (Hydra)');
  console.log('--------------------------------------------------');

  console.log('\n==========================================');
  console.log('💎 Money Sites Sitemaps Ping...');
  console.log('==========================================');
  for (const sitemapUrl of moneySiteSitemaps) {
    console.log(`\n🌍 Hedef: ${sitemapUrl}`);
    for (const engine of searchEngines) {
      process.stdout.write(`   ⚡ Pinging ${engine.name}... `);
      const result = await pingUrl(engine, sitemapUrl);
      if (result.success) {
        console.log(`✅ Başarılı (${result.status})`);
      } else {
        console.log(`❌ Hata (${result.status || result.error})`);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n==========================================');
  console.log('🛰️ Google Sites Sitemaps Ping...');
  console.log('==========================================');
  for (const siteUrl of googleSites) {
    // Google Sites default sitemap URL
    const sitemapUrl = `${siteUrl}/system/feeds/sitemap`;
    console.log(`\n🌍 Hedef: ${siteUrl}`);
    console.log(`📄 Sitemap: ${sitemapUrl}`);

    for (const engine of searchEngines) {
      process.stdout.write(`   ⚡ Pinging ${engine.name}... `);
      const result = await pingUrl(engine, sitemapUrl);
      if (result.success) {
        console.log(`✅ Başarılı (${result.status})`);
      } else {
        console.log(`❌ Hata (${result.status || result.error})`);
      }
    }
    
    // Küçük bir bekleme ekleyelim ki ban yemeyelim
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n🏆 [DONE] Ping operasyonu tamamlandı. Tüm sitemapler sıraya alındı.');
}

runPing();
