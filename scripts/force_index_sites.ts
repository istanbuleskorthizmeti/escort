import { googleAuth } from '../lib/google-auth';

const googleSites = [
  "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/istanbul-escort/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/sancaktepe-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/cekmekoy-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/arnavutkoy-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/basaksehir-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/adalar-escort-drkcnay1-v/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/silivriescort-drkcnay2026/ana-sayfa/",
  "https://sites.google.com/dorukcanay.digital/beyoglu-escort-drkcnay1-v/ana-sayfa/"
];

async function runForceIndexing() {
  console.log('🚀 [GOD MODE] Başlatılıyor: Google API Force Indexing (Sitemaps & Indexing API)');
  console.log('--------------------------------------------------');

  for (const siteUrl of googleSites) {
    const cleanUrl = siteUrl.replace('/ana-sayfa/', '/');
    const basePropertyUrl = cleanUrl.endsWith('/') ? cleanUrl : `${cleanUrl}/`;
    
    // Ensure trailing slash for page URL so it matches the GSC property path hierarchy
    const exactPageUrl = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;

    console.log(`\n🌍 Target Property: ${basePropertyUrl}`);
    console.log(`   Page URL: ${exactPageUrl}`);
    
    console.log(`   🚀 Indexing API (URL Notification) Gönderimi Başlıyor...`);
    // Will rotate through service accounts. The first one that succeeds wins!
    await googleAuth.forceIndexUrl(exactPageUrl, 'URL_UPDATED');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n🏆 [DONE] Indexing operasyonu tamamlandı. Tüm siteler Google botlarına zorla iletildi.');
  process.exit(0);
}

runForceIndexing().catch(err => {
  console.error("🔥 Beklenmeyen Hata:", err);
  process.exit(1);
});
