
import { omniAI } from "../lib/ai-provider";
import { siteConfig } from "../config/site";
import fs from "fs";
import path from "path";

/**
 * 🧛‍♂️ CLOUD STACKER v1.0
 * Vercel ve Netlify için profesyonel Parasite SEO projeleri üretir.
 */

const BITLY_BRIDGE = "https://bit.ly/dorukcanmanay";

async function generateStaticProject(platform: 'vercel' | 'netlify', zone: string) {
  console.log(`🧠 [${platform.toUpperCase()}] Generating project for: ${zone}...`);

  const prompt = `
    Sen bir Lüks Yaşam ve Modern Şehir Rehberi Yazarıısın. 
    ${platform.toUpperCase()} üzerinde yayınlanacak, "${zone} VIP Yaşam ve Sosyal Etkinlik Portalı" için profesyonel bir HTML sayfası yaz.
    
    İçerik Gereksinimleri:
    - Çok temiz, modern ve premium bir HTML/CSS yapısı kullan (Inline CSS olsun).
    - 5000+ kelimelik, ansiklopedik derinlikte bölge rehberi.
    - Metnin içinde ${BITLY_BRIDGE} linkini "Official VIP Concierge Access" olarak büyük bir buton ve link olarak ekle.
    - Tüm Black Hat nişlerini (Rus, Ukraynalı, Üniversiteli, Çıtır, Olgun) "Kültürel ve Sosyal Çeşitlilik" başlığı altında elit bir dille işle.
    - SEO meta etiketlerini (Title, Description, Keywords) en agresif şekilde ekle.
  `;

  try {
    const htmlContent = await omniAI.generate(prompt, { provider: "deepseek", model: "deepseek-reasoner", max_tokens: 8000 });
    
    const projectDir = path.join(process.cwd(), 'parasite_hub', `${platform}-${zone.toLowerCase()}`);
    if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir, { recursive: true });

    // index.html
    fs.writeFileSync(path.join(projectDir, 'index.html'), htmlContent);
    
    // Config files
    if (platform === 'vercel') {
      fs.writeFileSync(path.join(projectDir, 'vercel.json'), JSON.stringify({ version: 2, cleanUrls: true }));
    } else {
      fs.writeFileSync(path.join(projectDir, '_redirects'), `/* /index.html 200`);
    }

    console.log(`✅ [${platform.toUpperCase()}] Project Ready: /parasite_hub/${platform}-${zone.toLowerCase()}`);
  } catch (err: any) {
    console.error(`❌ ${platform} Gen Failed:`, err.message);
  }
}

(async () => {
  const zones = ['istanbul', 'sisli', 'besiktas'];
  for (const z of zones) {
    await generateStaticProject('vercel', z);
    await generateStaticProject('netlify', z);
  }
})();
