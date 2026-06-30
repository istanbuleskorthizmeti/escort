import fs from 'fs';
import path from 'path';
import { DRKCNAYSpintax } from '../lib/spintax-engine';
import { cities } from '../lib/locations';

/**
 * ⚡ HYDRA STATIC PARASITE GENERATOR [GOD MODE] ⚡
 * GitHub Pages / Vercel / Netlify üzerinde host edilecek DR90+ statik parazit sayfalarını ve site haritalarını üretir.
 */

const OUTPUT_DIR = path.join(process.cwd(), 'parasite_hub', 'istanbul');
const SITEMAP_FILE = path.join(OUTPUT_DIR, 'sitemap.xml');
const INDEX_FILE = path.join(OUTPUT_DIR, 'index.html');

// Kendi GitHub/Vercel URL'in buraya gelecek. (Örn: dorukcanay-istanbul.vercel.app)
// Bu url Google'a ping atılırken kullanılacak sitemap ana base URL'idir.
const DEPLOY_BASE_URL = "https://istanbuleskorthizmeti.github.io/escort"; 
const MAIN_MONEY_SITE = "https://istanbulescort.blog";

function generate() {
  console.log("🚀 [GOD MODE] Statik Parazit Ağı İnşa Ediliyor...");
  
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const districtsDir = path.join(OUTPUT_DIR, 'ilceler');
  if (!fs.existsSync(districtsDir)) fs.mkdirSync(districtsDir, { recursive: true });

  const istanbul = cities['istanbul'];
  let sitemapUrls = [];

  // 1. İLÇE SAYFALARI (39 Adet) ÜRETİMİ
  for (const district of istanbul.districts) {
    const slug = district.slug;
    const name = district.name;
    const engine = new DRKCNAYSpintax(`static-gen-${slug}`);

    // Başlık
    const titleTemplate = "{👑|💎|🔥} [LOC] Escort | VIP Eskort Bayan {Rehberi|İlanları} (Kaporasız)";
    const title = engine.resolve(titleTemplate, { LOC: name });

    // İçerik
    const descTemplate = "[LOC] genelinde {seçkin ve lüks|asillik ve ihtişam dolu} bir {refakatçi deneyimi|VIP partnerlik} sunuyoruz. {Buluşmalarımızda|Görüşmelerimizde} {kesinlikle ön ödeme|hiçbir şekilde kapora} talep edilmeyip, {yüz yüze ve elden ödeme|güvenilir elden ödemeli model} esastır.";
    const description = engine.resolve(descTemplate, { LOC: name });

    const htmlContent = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${DEPLOY_BASE_URL}/ilceler/${slug}.html">
  <style>
    body { font-family: 'Inter', sans-serif; background: #09090b; color: #f4f4f5; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #f43f5e; border-bottom: 2px solid #3f3f46; padding-bottom: 10px; }
    .card { background: #18181b; padding: 20px; border-radius: 12px; border: 1px solid #3f3f46; margin-top: 20px; }
    a { color: #f43f5e; text-decoration: none; font-weight: bold; }
    a:hover { text-decoration: underline; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #f43f5e, #db2777); color: white; padding: 15px 30px; border-radius: 8px; margin-top: 20px; font-size: 18px; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="card">
    <p>${description}</p>
    <p>Resmi ve doğrulanmış profillere ulaşmak için orijinal sitemizi ziyaret edin. (Sıfır Kapora Garantisi)</p>
    
    <center>
      <a href="${MAIN_MONEY_SITE}/istanbul/${slug}" class="cta-btn">🔥 ${name} VIP Katalog İçin Tıkla</a>
    </center>
  </div>
  
  <div class="card" style="margin-top: 30px; font-size: 12px; color: #a1a1aa;">
    <h3>Lokasyon ve Güvenlik Bilgisi</h3>
    <p>Tüm ${name} randevularımızda güvenlik esastır. Bu sayfa ${name} bölgesi için özel olarak optimize edilmiştir. Otel, rezidans ve eve servis imkanları mevcuttur.</p>
  </div>
</body>
</html>
    `.trim();

    fs.writeFileSync(path.join(districtsDir, `${slug}.html`), htmlContent, 'utf8');
    sitemapUrls.push(`${DEPLOY_BASE_URL}/ilceler/${slug}.html`);
    console.log(`✅ Üretildi: ${name} (${slug}.html)`);
  }

  // 2. SITEMAP.XML ÜRETİMİ
  const sitemapContent = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${DEPLOY_BASE_URL}/</loc><priority>1.0</priority></url>
  ${sitemapUrls.map(url => `<url><loc>${url}</loc><priority>0.8</priority></url>`).join('\n  ')}
</urlset>
  `.trim();
  fs.writeFileSync(SITEMAP_FILE, sitemapContent, 'utf8');
  console.log(`✅ SITEMAP Üretildi: ${SITEMAP_FILE}`);

  // 3. ANA SAYFA ÜRETİMİ (Index)
  const indexLinks = istanbul.districts.map(d => `<li><a href="./ilceler/${d.slug}.html">${d.name} Escort</a></li>`).join('');
  const indexContent = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>👑 İstanbul Escort Rehberi | Dorukcanay Elite 2026</title>
  <style>
    body { font-family: 'Inter', sans-serif; background: #09090b; color: #f4f4f5; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #f43f5e; text-align: center; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; list-style: none; padding: 0; }
    .grid li { background: #18181b; padding: 10px; border-radius: 8px; border: 1px solid #3f3f46; text-align: center; }
    a { color: #f4f4f5; text-decoration: none; }
    a:hover { color: #f43f5e; }
  </style>
</head>
<body>
  <h1>İstanbul Elite Vip Escort Ağı</h1>
  <p style="text-align:center;">İstanbul'un tüm semtlerinde doğrulanmış, kaporasız ve güvenilir elit model ilanları.</p>
  <ul class="grid">
    ${indexLinks}
  </ul>
</body>
</html>
  `.trim();
  fs.writeFileSync(INDEX_FILE, indexContent, 'utf8');
  console.log(`✅ INDEX Üretildi: ${INDEX_FILE}`);
  console.log(`🎉 TÜM İŞLEMLER BAŞARILI! Saniyeler içinde 39 ilçe kodlandı.`);
}

generate();
