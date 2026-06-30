import fs from 'fs';
import path from 'path';
import { ISTANBUL_NEIGHBORS } from '../lib/seo/neighborhood-map';

const OUTPUT_DIR = path.join(process.cwd(), 'seo-texts');

interface SiteConfig {
  slug: string;
  district: string;
}

const DISTRICT_LIST: SiteConfig[] = [
  { slug: "sefakoyistanbul-drkcnay2026", district: "sefakoy" },
  { slug: "bakrkyescort-drkcnayv1", district: "bakirkoy" },
  { slug: "catalca-escort-drkcnay1-v", district: "catalca" },
  { slug: "beylikduzu-vip-escort", district: "beylikduzu" },
  { slug: "besyol-universiteli-escort", district: "besyol" },
  { slug: "besyol-escort-drkcnay1-v", district: "besyol" },
  { slug: "istanbul-escort", district: "istanbul" },
  { slug: "sancaktepe-escort-drkcnay1-v", district: "sancaktepe" },
  { slug: "kartal-escort-drkcnay1-v", district: "kartal" },
  { slug: "cekmekoy-escort-drkcnay1-v", district: "cekmekoy" },
  { slug: "arnavutkoy-escort-drkcnay1-v", district: "arnavutkoy" },
  { slug: "basaksehir-escort-drkcnay1-v", district: "basaksehir" },
  { slug: "esenler-escort-drkcnay1-v", district: "esenler" },
  { slug: "adalar-escort-drkcnay1-v", district: "adalar" },
  { slug: "silivriescort-drkcnay2026", district: "silivri" },
  { slug: "beyoglu-escort-drkcnay1-v", district: "beyoglu" }
];

function getDistrictProperName(district: string): string {
  const mapping: Record<string, string> = {
    sefakoy: "Sefaköy",
    bakirkoy: "Bakırköy",
    catalca: "Çatalca",
    beylikduzu: "Beylikdüzü",
    besyol: "Beşyol",
    istanbul: "İstanbul",
    sancaktepe: "Sancaktepe",
    kartal: "Kartal",
    cekmekoy: "Çekmeköy",
    arnavutkoy: "Arnavutköy",
    basaksehir: "Başakşehir",
    esenler: "Esenler",
    adalar: "Adalar",
    silivri: "Silivri",
    beyoglu: "Beyoğlu"
  };
  return mapping[district.toLowerCase()] || district;
}

function getDistrictLowercaseTurkish(district: string): string {
  const mapping: Record<string, string> = {
    sefakoy: "sefaköy",
    bakirkoy: "bakırköy",
    catalca: "çatalca",
    beylikduzu: "beylikdüzü",
    besyol: "beşyol",
    istanbul: "istanbul",
    sancaktepe: "sancaktepe",
    kartal: "kartal",
    cekmekoy: "çekmeköy",
    arnavutkoy: "arnavutköy",
    basaksehir: "başakşehir",
    esenler: "esenler",
    adalar: "adalar",
    silivri: "silivri",
    beyoglu: "beyoğlu"
  };
  return mapping[district.toLowerCase()] || district.toLowerCase();
}

function generatePlainText(district: string, neighbors: string[]): string {
  const currentYear = new Date().getFullYear();
  const cleanNeighbors = neighbors.slice(0, 5).join(', ');
  
  const capDistrict = getDistrictProperName(district);
  const lowercaseDistrict = getDistrictLowercaseTurkish(district);

  const targetUrl = district.toLowerCase() === 'istanbul' 
    ? "https://dorukcanay.digital/istanbul"
    : `https://dorukcanay.digital/istanbul/${district.toLowerCase()}`;

  return `👑 ${capDistrict} VIP Ateşli Eskort Kraliçe Randevu ${currentYear} 👑

❤️🔥 [${capDistrict} genelinde](https://dorukcanay.digital/istanbul) gizli, lüks ve tamamen buluşma anında elden ödemeli çalışan en seçkin [escort](https://dorukcanay.digital) bayan partnerlerle muhteşem ve unutulmaz bir deneyime davetlisiniz. Tamamı %100 gerçek görsellerden oluşan elit refakatçi kraliçe ve sultan alternatiflerimiz, ateşli fantezileriyle sizleri büyülemek için hazır bekliyor! 💎

✨ Güvenilir, Gizli ve VIP Görüşme Deneyimi ✨

Bölgemizde hizmet veren partnerler hiçbir şekilde ön ödeme veya kapora talep etmez. Tamamen güven esasına dayalı olarak, adreste elden ödeme kolaylığı sunulmaktadır. Bu sayede dolandırıcılık risklerinden uzak, son derece güvenli ve gizli bir randevu süreci geçirebilirsiniz. 🌹

🔥 Muhteşem Hizmet ve Fantezi Detayları 🔥

- 💎 %100 Gerçek Görsel Garantisi: Görsellerin tamamı güncel ve teyitlidir.
- 💋 Geniş Hizmet Ağı: Rezidans, otel veya kendi kişisel adreslerinizde lüks görüşme imkanı.
- 👑 Yakın Hizmet Bölgeleri (Mahalle Grubu): ${capDistrict} ve çevresindeki ${cleanNeighbors} bölgelerinde aktif hizmet verilmektedir.

😈 İletişim ve Detaylı Bilgi 😈



🎯 Anahtar Kelimeler:
👑 [${lowercaseDistrict} escort bayan](${targetUrl})
🔥 [${lowercaseDistrict} eskort kraliçe randevu](${targetUrl})
💎 [${lowercaseDistrict} vip ateşli eskort](${targetUrl})
💋 [kaporasız ${lowercaseDistrict} escort](${targetUrl})
✨ [${lowercaseDistrict} rus escort](${targetUrl})
😈 [${lowercaseDistrict} muhteşem escort](${targetUrl})`;
}

function generateHtmlText(district: string, neighbors: string[]): string {
  const currentYear = new Date().getFullYear();
  const cleanNeighbors = neighbors.slice(0, 5).join(', ');
  
  const capDistrict = getDistrictProperName(district);
  const lowercaseDistrict = getDistrictLowercaseTurkish(district);

  const targetUrl = district.toLowerCase() === 'istanbul' 
    ? "https://dorukcanay.digital/istanbul"
    : `https://dorukcanay.digital/istanbul/${district.toLowerCase()}`;

  return `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 15px; border: 1px solid #eee; border-radius: 12px; background: #fff;">


  <h2 style="color: #2c3e50; border-bottom: 2px solid #ff8600; padding-bottom: 5px;">👑 ${capDistrict} VIP Ateşli Eskort Kraliçe Randevu ${currentYear} 👑</h2>
  
  <p>
    ❤️🔥 <a href="https://dorukcanay.digital/istanbul" style="color: #ff8600; font-weight: bold; text-decoration: underline;">${capDistrict} genelinde</a> 
    gizli, lüks ve tamamen buluşma anında elden ödemeli çalışan en seçkin 
    <a href="https://dorukcanay.digital" style="color: #ff8600; font-weight: bold; text-decoration: underline;">escort</a> 
    bayan partnerlerle muhteşem ve unutulmaz bir deneyime davetlisiniz. Tamamı %100 gerçek görsellerden oluşan elit refakatçi kraliçe ve sultan alternatiflerimiz, ateşli fantezileriyle sizleri büyülemek için hazır bekliyor! 💎
  </p>

  <h3 style="color: #2c3e50; margin-top: 15px;">✨ Güvenilir, Gizli ve VIP Görüşme Deneyimi ✨</h3>
  <p>
    Bölgemizde hizmet veren partnerler hiçbir şekilde ön ödeme veya kapora talep etmez. Tamamen güven esasına dayalı olarak, adreste elden ödeme kolaylığı sunulmaktadır. Bu sayede dolandırıcılık risklerinden uzak, son derece güvenli ve gizli bir randevu süreci geçirebilirsiniz. 🌹
  </p>

  <h3 style="color: #2c3e50; margin-top: 15px;">🔥 Muhteşem Hizmet ve Fantezi Detayları 🔥</h3>
  <ul>
    <li><strong>💎 %100 Gerçek Görsel Garantisi:</strong> Görsellerin tamamı güncel ve teyitlidir.</li>
    <li><strong>💋 Geniş Hizmet Ağı:</strong> Rezidans, otel veya kendi kişisel adreslerinizde lüks görüşme imkanı.</li>
    <li><strong>👑 Yakın Hizmet Bölgeleri (Mahalle Grubu):</strong> ${capDistrict} ve çevresindeki ${cleanNeighbors} bölgelerinde aktif hizmet verilmektedir.</li>
  </ul>

  <h3 style="color: #2c3e50; margin-top: 15px;">😈 İletişim ve Detaylı Bilgi 😈</h3>
  <p>

  </p>

  <h3 style="color: #2c3e50; margin-top: 15px;">🎯 Anahtar Kelimeler:</h3>
  <p style="font-size: 0.9em; color: #555;">
    👑 <a href="${targetUrl}" style="color: #2980b9; text-decoration: underline;">${lowercaseDistrict} escort bayan</a>, 
    🔥 <a href="${targetUrl}" style="color: #2980b9; text-decoration: underline;">${lowercaseDistrict} eskort kraliçe randevu</a>, 
    💎 <a href="${targetUrl}" style="color: #2980b9; text-decoration: underline;">${lowercaseDistrict} vip ateşli eskort</a>, 
    💋 <a href="${targetUrl}" style="color: #2980b9; text-decoration: underline;">kaporasız ${lowercaseDistrict} escort</a>, 
    ✨ <a href="${targetUrl}" style="color: #2980b9; text-decoration: underline;">${lowercaseDistrict} rus escort</a>, 
    😈 <a href="${targetUrl}" style="color: #2980b9; text-decoration: underline;">${lowercaseDistrict} muhteşem escort</a>.
  </p>
</div>`;
}

function runGenerator() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const item of DISTRICT_LIST) {
    const neighbors = ISTANBUL_NEIGHBORS[item.district.toLowerCase()] || [];
    const htmlText = generateHtmlText(item.district, neighbors);
    const plainText = generatePlainText(item.district, neighbors);
    
    const mdPath = path.join(OUTPUT_DIR, `${item.slug}.txt`);
    const htmlPath = path.join(OUTPUT_DIR, `${item.slug}.html`);
    
    fs.writeFileSync(mdPath, plainText, 'utf8');
    fs.writeFileSync(htmlPath, htmlText, 'utf8');

    console.log(`Generated Text content in: ${mdPath}`);
    console.log(`Generated HTML content in: ${htmlPath}`);
  }
  
  console.log(`\n🎉 Generated all 16 SEO texts (HTML and Plain Text) inside: ${OUTPUT_DIR}`);
}

runGenerator();
