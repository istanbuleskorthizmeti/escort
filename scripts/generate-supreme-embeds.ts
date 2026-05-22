import fs from 'fs';
import path from 'path';
import { ISTANBUL_NEIGHBORS } from '../lib/seo/neighborhood-map';

const DISTRICTS = Object.keys(ISTANBUL_NEIGHBORS);
const BASE_DOMAIN = "https://istanbulescdrkcn.com";

interface DistrictPayload {
  district: string;
  slug: string;
  title: string;
  embedCode: string;
  seoCloud: string;
}

function generatePayloads() {
  console.log("🚀 [EMBED GENERATOR] Generating supreme copy-paste payloads for 39 districts...");
  
  const payloads: DistrictPayload[] = DISTRICTS.map((dist) => {
    // Turkish character replace helper for clean slugs
    const slug = dist
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const targetSlug = `${slug}-vip-escort-2026`;
    const title = `${dist} VIP Escort 💎 Elit Partner & Rus Partner Kataloğu (2026)`;
    
    // Premium 2000px height iframe embed code with seamless transparent styling
    const embedCode = `
<!-- VIP ESCORT VİTRİN EMBED - ${dist.toUpperCase()} -->
<div style="width: 100%; overflow: hidden; background: transparent;">
  <iframe 
    src="${BASE_DOMAIN}/embed/vitrin?city=${encodeURIComponent(dist)}" 
    style="width: 100%; height: 2000px; border: none; overflow: hidden; background: transparent;" 
    scrolling="no" 
    loading="lazy" 
    title="${dist} Vip Escort Vitrini">
  </iframe>
</div>
`.trim();

    // Hidden or integrated SEO tag cloud matching competitor LSI terms
    const seoCloud = `
<!-- SEO ETİKET BULUTU (Arama Motoru Botları İçin) -->
<div style="font-size: 10px; color: #555; line-height: 1.6; margin-top: 30px; text-align: justify; opacity: 0.85;">
  <strong>🏷️ ${dist} Popüler Arama Etiketleri:</strong> 
  ${dist.toLowerCase()} escort, 
  ${dist.toLowerCase()} vip partner, 
  ${dist.toLowerCase()} rus escort, 
  ${dist.toLowerCase()} elit escort, 
  ${dist.toLowerCase()} universiteli escort, 
  ${dist.toLowerCase()} eskort bayan, 
  ${dist.toLowerCase()} kapora odemeden escort, 
  ${dist.toLowerCase()} guvenilir ajans, 
  ${dist.toLowerCase()} evinde hizmet veren partner, 
  ${dist.toLowerCase()} sarisin escort, 
  ${dist.toLowerCase()} esmer escort, 
  istanbul escort, 
  vip escort hizmeti.
</div>
`.trim();

    return {
      district: dist,
      slug: targetSlug,
      title,
      embedCode,
      seoCloud
    };
  });

  // Generate beautiful Markdown file
  let mdContent = `# 👑 SUPREME 39-DISTRICT BLACK HAT SEO PAYLOADS (2026)

Kral, rakiplerimizi saniyeler içinde SERP haritasından silecek, 39 İstanbul ilçesinin tamamı için en profesyonel **HTML Iframe Embed**, **SEO Başlıkları** ve **Arama Motoru Etiket Bulutları** aşağıda listelenmiştir.

Kullanımı son derece basittir:
1. Google Sites veya Blogger sayfanı oluştur.
2. Sayfa URL'sini (Slug) ilgili ilçenin altındaki **URL Slug** değeriyle eşle.
3. Sayfa başlığına **SEO Title** değerini yapıştır.
4. Sayfa içerisine **HTML Göm (Embed HTML)** seçeneğini kullanarak **Iframe Embed Kodu + SEO Etiket Bulutu**'nu kopyalayıp yapıştır ve yayına al!

---
`;

  payloads.forEach((p) => {
    mdContent += `
## 📍 İLÇE: ${p.district.toUpperCase()}

* 🌐 **URL Slug:** \`${p.slug}\`
* 💎 **SEO Title:** \`${p.title}\`

### 🛠️ HTML Embed & SEO Cloud Payload (Kopyala & Yapıştır):
\`\`\`html
${p.embedCode}

${p.seoCloud}
\`\`\`

---
`;
  });

  const outPath = path.join(process.cwd(), 'SUPREME_39_EMBED_CODES.md');
  fs.writeFileSync(outPath, mdContent);
  console.log(`✅ [EMBED GENERATOR] Success! Output written to: ${outPath}`);
}

generatePayloads();
