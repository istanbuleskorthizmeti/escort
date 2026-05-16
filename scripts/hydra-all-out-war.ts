
import { BloggerAdapter } from "../lib/parasite/blogger";
import { TelegramService } from "../lib/crm/telegram";
import { googleIndexing } from "../lib/google-indexing";
import { omniAI } from "../lib/ai-provider";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const TARGET_ZONES = ["Beşyol", "Bağcılar", "Beşiktaş", "Şişli", "Beylikdüzü"];
const MONEY_SITE = "https://vipescorthizmeti.com";

async function generateTelegraphContent(zone: string) {
    const prompt = `
        Sen bir Elit Yaşam Yazarıısın. 
        "${zone} VIP Partnerlik ve Sosyal Rehberlik 2026 Edisyonu" başlıklı, 
        lüks, akıcı ve SEO uyumlu (h1, h2, p, a etiketleri dahil) bir makale yaz. 
        Metnin içinde ${MONEY_SITE} adresine "Resmi Katalog" olarak link ver.
        Beşyol Üniversiteli, Rus ve VIP nişlerini öv.
    `;
    return await omniAI.generate(prompt, { provider: "deepseek", model: "deepseek-reasoner", max_tokens: 4000 });
}

async function executeTotalWar() {
    console.log("⚔️ [TOTAL-WAR] Smart Infiltration Started...");
    await TelegramService.sendMessage(`🛡️ <b>HYDRA: SMART WAR BAŞLADI</b>\n${"▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬"}\n🚀 <b>Strateji:</b> Anti-Spam (Smart Delay + Anchor Rotation)\n🎯 <b>Hedef:</b> Blogger, Telegraph, GitHub\n🛰️ <b>Motor:</b> DeepSeek Reasoner`);

    // Shuffle zones to avoid linear patterns
    const zones = [...TARGET_ZONES].sort(() => Math.random() - 0.5);

    for (const zone of zones) {
        try {
            console.log(`🎯 [INFILTRATION] Processing: ${zone}...`);

            // 1. GENERATE HIGH-QUALITY CONTENT
            const telegraphContent = await generateTelegraphContent(zone);
            const anchorText = BloggerAdapter.getRandomAnchor(zone);

            // 2. BLOGGER (SMART POSTING)
            const blogTitle = `${zone} Bölgesinde Elit Yaşam ve VIP Rehberlik (2026)`;
            const blogContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #e11d48;">${zone} Lüks Hizmet Standartları</h2>
                    <p>${zone} bölgesindeki en seçkin ve profesyonel hizmetler için hazırladığımız güncel rehber yayında.</p>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; border-left: 5px solid #e11d48; margin: 20px 0;">
                        <strong>💎 ÖNERİLEN:</strong> 
                        <a href="${MONEY_SITE}" style="color: #e11d48; font-weight: bold; text-decoration: none;">
                            ${anchorText}
                        </a>
                    </div>

                    <p>Gerçek profiller, kaporasız randevu ve %100 gizlilik prensibiyle çalışan ${zone} VIP partnerleri hakkında detaylı bilgi için resmi kataloğumuzu ziyaret edebilirsiniz.</p>
                    
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <div style="color: #666; font-style: italic;">
                        ${telegraphContent.length > 1500 ? telegraphContent.substring(0, 1500) + '...' : telegraphContent}
                    </div>

                    <div style="margin-top: 20px; text-align: center;">
                        <a href="${MONEY_SITE}" style="display: inline-block; background: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            🌐 ${zone} VIP KATALOĞU GÖRÜNTÜLE
                        </a>
                    </div>

                    <div style="margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 10px; color: #999; font-size: 11px;">
                        #${zone.toLowerCase()}escort #${zone.toLowerCase()}vip #kaporasizescort #universiteliescort #rusvip #elitrehber
                    </div>
                </div>
            `;
            
            const bloggerUrl = await BloggerAdapter.createPost(process.env.BLOG_ID || '', blogTitle, blogContent);

            // 3. PERSIST PAYLOADS (Telegraph + GitHub)
            const outDir = path.join(process.cwd(), 'parasite_hub', zone);
            if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
            
            // Save Telegraph HTML
            fs.writeFileSync(path.join(outDir, 'telegraph_final.html'), telegraphContent);

            // Generate & Save GitHub README Payload
            const githubMD = `
# 🛡️ ${zone} VIP PARTNERSHIP PROTOCOL (2026)

Official documentation and high-authority access for elit services in the **${zone}** region.

## 🔗 ACCESS PORTAL
> [!IMPORTANT]
> To view the verified catalog and real profiles, use the official link below:
> ### 🌐 [${anchorText}](${MONEY_SITE})

## 📍 REGIONAL COVERAGE
- **Beşyol Üniversiteli**
- **Rus & VIP Elite**
- **Kaporasız Randevu Sistemi**

---
*Maintained by Hydra Network Authority.*
            `.trim();
            fs.writeFileSync(path.join(outDir, 'README_FINAL.md'), githubMD);

            if (bloggerUrl) {
                await googleIndexing.broadcast(bloggerUrl);
            }

            console.log(`✅ [SUCCESS] ${zone} conquered with smart logic.`);

        } catch (err: any) {
            console.error(`❌ [WAR-ERROR] ${zone}:`, err.message);
        }
    }

    await TelegramService.sendMessage(`🏆 <b>HYDRA: SMART WAR TAMAMLANDI</b>\n${"▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬"}\n🧛‍♂️ <i>Kral, Blogger'ı yormadan, akıllı linklerle tüm bölgeleri mühürledik.</i>`);
}

executeTotalWar();
