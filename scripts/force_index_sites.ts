import { googleAuth } from '../lib/google-auth';

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

async function runForceIndexing() {
  console.log('🚀 [GOD MODE] Başlatılıyor: Google API Force Indexing (Sitemaps & Indexing API)');
  console.log('--------------------------------------------------');

  for (const siteUrl of googleSites) {
    // 1. Get base property URL (e.g., https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/)
    const cleanUrl = siteUrl.replace('/ana-sayfa', '');
    const basePropertyUrl = cleanUrl.endsWith('/') ? cleanUrl : `${cleanUrl}/`;
    
    // 2. Exact page URL for indexing notification
    const exactPageUrl = siteUrl;
    
    // 3. Sitemap URL format for Google Sites
    const sitemapUrl = `${basePropertyUrl}system/feeds/sitemap`;

    console.log(`\n🌍 Target Property: ${basePropertyUrl}`);
    console.log(`   Page URL: ${exactPageUrl}`);
    console.log(`   Sitemap URL: ${sitemapUrl}`);
    
    // 1. Skip Sitemap submission (New Google Sites return 404 for /system/feeds/sitemap)
    console.log(`   📡 Skipping sitemap submission (Not supported on modern Google Sites)`);

    // 2. Force Index via Indexing API
    console.log(`   🚀 Indexing API (URL Notification) Gönderimi Başlıyor...`);
    await googleAuth.forceIndexUrl(exactPageUrl, 'URL_UPDATED');
    
    // Antispam delay
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n🏆 [DONE] Indexing operasyonu tamamlandı. Tüm siteler Google botlarına zorla iletildi.');
  process.exit(0);
}

runForceIndexing().catch(err => {
  console.error("🔥 Beklenmeyen Hata:", err);
  process.exit(1);
});
