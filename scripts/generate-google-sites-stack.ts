
import { omniAI } from "../lib/ai-provider";
import { siteConfig } from "../config/site";
import fs from "fs";

/**
 * 🧛‍♂️ GOOGLE SITES & GIST STACKER v1.0
 * DA 100 platformlar için otorite enjeksiyonu yapar.
 */

const BITLY_BRIDGE = "https://bit.ly/dorukcanmanay";

async function generateGoogleSitesPayload(zone: string) {
  console.log(`🧠 [SITES] Generating DA 100 content for: ${zone}...`);

  const prompt = `
    Sen bir Şehir Rehberi ve Lüks Yaşam Editörüsün. 
    Google Sites için "${zone} VIP Yaşam, Etkinlik ve Escort Rehberi" başlıklı bir içerik hazırla.
    - Google Sites'ın sevdiği temiz, hiyerarşik (H1, H2, H3) yapıda olsun.
    - Metnin kalbine ${BITLY_BRIDGE} linkini "Resmi Rezervasyon Hattı" olarak ekle.
    - 4000+ kelime, tüm nişleri (Rus, Ukraynalı, Çıtır) profesyonelce kapsasın.
  `;

  try {
    const content = await omniAI.generate(prompt, { provider: "deepseek", model: "deepseek-reasoner" });
    const outPath = `parasite_hub/google_sites_${zone}.html`;
    fs.writeFileSync(outPath, content);
    console.log(`✅ [SITES READY] Payload saved: ${outPath}`);
  } catch (err: any) {
    console.error("❌ Sites Gen Failed:", err.message);
  }
}

// En sıcak bölgeler
const targets = ['İstanbul', 'Şişli', 'Beşiktaş'];
(async () => {
  for (const t of targets) {
    await generateGoogleSitesPayload(t);
  }
})();
