
import { omniAI } from "../lib/ai-provider";
import { cities } from "../lib/locations";
import { siteConfig } from "../config/site";
import fs from "fs";
import path from "path";

/**
 * 🧛‍♂️ HYDRA PARASITE HUB v1.0
 * GitHub, Telegraph, PDF ve Pastebin için yüksek otoriteli içerik üretici.
 */

async function generateParasitePayloads(locationName: string) {
  console.log(`🚀 [GOD MODE] Generating Parasite Payloads for: ${locationName}...`);

  const moneySite = siteConfig.satelliteDomain; // vipescorthizmeti.com
  const bitlyBridge = "https://bit.ly/istanbulescort2026";
  const targetUrl = `${moneySite}/${locationName.toLowerCase().replace(/\s/g, '-')}`;

  // 1. GITHUB MARKDOWN (Technical/Documentation Style)
  const githubPrompt = `
    Sen bir Senior Developer ve Teknik Yazarsın. 
    "${locationName} Bölgesi Modern Sosyal Etkinlik ve VIP Partnerlik Protokolleri" başlıklı bir GitHub README.md dosyası yaz.
    İçerik:
    - Akademik ve teknik bir dil kullan.
    - Metnin en başında ve sonunda ${bitlyBridge} adresine "Official Documentation & API Access" olarak büyük puntolarla link ver.
    - Ayrıca metnin içine ${targetUrl} adresine "Primary Data Source" olarak doğal link ver.
    - Rus, Çıtır, VIP nişlerini "Sektörel Segmentasyon" olarak anlat.
    - 3000+ kelime olsun.
  `;

  // 2. TELEGRAPH HTML (Viral Article Style)
  const telegraphPrompt = `
    Sen bir Magazin ve Yaşam Yazarıısın. 
    "${locationName} Gece Hayatının Gizli Rotaları ve Elit Eşlik Hizmetleri" başlıklı bir makale yaz.
    İçerik:
    - Akıcı, merak uyandırıcı ve lüks bir dil.
    - HTML etiketleri (h1, h2, p, a) kullan.
    - Metnin kalbine ${targetUrl} linkini "Hizmet Alınan Tek Adres" olarak göm.
    - Tüm Black Hat nişlerini (Rus, Türbanlı, Olgun) hikayeleştirerek anlat.
  `;

  try {
    const [githubMD, telegraphHTML] = await Promise.all([
      omniAI.generate(githubPrompt, { provider: "deepseek", model: "deepseek-reasoner", max_tokens: 5000 }),
      omniAI.generate(telegraphPrompt, { provider: "deepseek", model: "deepseek-reasoner", max_tokens: 5000 })
    ]);

    const outDir = path.join(process.cwd(), 'parasite_hub', locationName);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(path.join(outDir, 'README.md'), githubMD);
    fs.writeFileSync(path.join(outDir, 'telegraph.html'), telegraphHTML);
    
    console.log(`✅ [SUCCESS] Payloads generated in: /parasite_hub/${locationName}`);
    console.log(`🔗 Target Link: ${targetUrl}`);

  } catch (err: any) {
    console.error(`❌ Failed:`, err.message);
  }
}

// Örnek: En kritik 5 bölge için üretelim
const hotZones = ['İstanbul', 'Şişli', 'Beşiktaş', 'Beylikdüzü', 'Kadıköy'];
(async () => {
  for (const zone of hotZones) {
    await generateParasitePayloads(zone);
    await new Promise(r => setTimeout(r, 5000));
  }
})();
