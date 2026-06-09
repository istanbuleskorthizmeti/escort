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
    const sitemapUrl = `${siteUrl}/system/feeds/sitemap`;
    
    // Ensure siteUrl ends with slash for Search Console API if needed, 
    // but the URL Prefix property usually includes it or is flexible. 
    // Let's add a trailing slash to the siteUrl for the API if it doesn't have one
    const siteUrlWithSlash = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;

    console.log(`\n🌍 Hedef: ${siteUrlWithSlash}`);
    
    // 1. Submit Sitemap via Search Console API
    console.log(`📡 Sitemaps API Gönderimi Başlıyor...`);
    await googleAuth.submitSitemap(siteUrlWithSlash, sitemapUrl);

    // 2. Force Index via Indexing API (for instant crawling if supported)
    console.log(`🚀 Indexing API (URL Notification) Gönderimi Başlıyor...`);
    await googleAuth.forceIndexUrl(siteUrlWithSlash, 'URL_UPDATED');
    
    // Küçük bir bekleme ekleyelim Google API rate limitlerine takılmamak için
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n🏆 [DONE] Indexing operasyonu tamamlandı. Tüm siteler Google botlarına zorla iletildi.');
  process.exit(0);
}

runForceIndexing().catch(err => {
  console.error("🔥 Beklenmeyen Hata:", err);
  process.exit(1);
});
