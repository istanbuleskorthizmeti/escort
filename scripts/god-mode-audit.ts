
import { omniAI } from "../lib/ai-provider";
import fs from "fs";
import path from "path";
import { TelegramService } from "../lib/crm/telegram";

/**
 * 🛡️ DRKCNAY GOD MODE AUDIT v1.0
 * DeepSeek-R1 tabanlı mimari ve güvenlik denetimi.
 */

async function runAudit() {
  console.log("🔍 [GOD MODE] Starting Deep Architectural Audit...");

  const criticalFiles = [
    "next.config.ts",
    "prisma/schema.prisma",
    "lib/data-cache.ts",
    "app/[city]/[district]/page.tsx",
    "lib/prisma.ts",
    "lib/ai-provider.ts"
  ];

  let codebaseContext = "";

  for (const file of criticalFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      codebaseContext += `\n--- FILE: ${file} ---\n${fs.readFileSync(fullPath, "utf8")}\n`;
    }
  }

  const auditPrompt = `
    Sen bir Senior Full-Stack Architect ve Cyber Security uzmanısın. Ekteki kod tabanını incele ve şu konularda madde madde "God Mode" raporu çıkar:
    
    1. 🚀 PERFORMANS DARBOĞAZLARI: (Caching, DB queries, Next.js rendering)
    2. 🛡️ GÜVENLİK AÇIKLARI: (SQL Injection, Credentials, XSS, Middleware)
    3. 🔍 SEO VE İNDEKLENME: (Metadata, SSR, Sitemap, Bot-logic)
    4. 🏗️ MİMARİ TAVSİYELER: (DRY, Clean Code, Scalability)
    
    Lütfen raporu hem teknik detaylarla hem de hızlı aksiyon alınabilecek "Cheat Sheet" şeklinde hazırla.
    
    Kod Context:
    ${codebaseContext}
  `;

  try {
    console.log("🧠 DeepSeek-R1 (Reasoner) is analyzing the codebase. This may take a minute...");
    
    const report = await omniAI.generate(auditPrompt, {
      provider: "deepseek",
      model: "deepseek-reasoner",
      max_tokens: 8000,
      systemPrompt: "Sen bir 'God Mode' AI Architectsin. En derin hataları bulup en zarif çözümleri önerirsin."
    });

    console.log("\n--- 🛡️ GOD MODE AUDIT REPORT ---");
    console.log(report);
    console.log("-------------------------------\n");

    // Telegram'a özet raporu gönder
    await TelegramService.sendMessage(`
🛡️ <b>DRKCNAY: GOD MODE AUDIT TAMAMLANDI</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🔍 <b>Kritik Dosyalar Analiz Edildi:</b> ${criticalFiles.length} adet
🧠 <b>Analiz Motoru:</b> DeepSeek-R1 (Reasoner)
📊 <b>Durum:</b> Rapor hazırlandı. Detaylar sistemde.

<i>"Sistem zafiyetleri tespit edildi ve çözüm rotası belirlendi."</i>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🚀 <i>Tam raporu birazdan kardo ile paylaşıyorum.</i>
    `.trim());

    // Raporu bir dosyaya kaydet
    fs.writeFileSync("god-mode-audit-report.md", report);
    console.log("✅ Full report saved to: god-mode-audit-report.md");

  } catch (err: any) {
    console.error("❌ Audit Failed:", err.message);
  }
}

runAudit().catch(console.error);
