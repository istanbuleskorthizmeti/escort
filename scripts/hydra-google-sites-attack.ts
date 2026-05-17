import { TelegramService } from "../lib/crm/telegram";
import { omniAI } from "../lib/ai-provider";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { telegraphService } from "../lib/seo/telegraph";
import { GistAdapter } from "../lib/parasite/gist";
import { bloggerService } from "../lib/seo/blogger";
import { BLOGGER_TARGET_IDS } from "../config/blogger-ids";

dotenv.config();

const googleSites = [
  "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort",
  "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort",
  "https://sites.google.com/dorukcanay.digital/beyoglu-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/istanbul-escort",
  "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026",
  "https://sites.google.com/dorukcanay.digital/silivriescort-drkcnay2026"
];

function extractZoneFromUrl(url: string) {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1] || parts[parts.length - 2];
    const clean = lastPart.replace('-escort', '').replace('-drkcnay1-v', '').replace('-drkcnay2026', '').replace(/-/g, ' ');
    // Capitalize each word
    return clean.replace(/\b\w/g, c => c.toUpperCase());
}

async function generateTelegraphContent(zone: string, targetSite: string) {
    const prompt = `
        Sen bir Karatay SEO Uzmanısın. 
        "${zone} Escort | ${zone} VIP Partner | ${zone} Rus & Üniversiteli Escort" başlıklı, 
        doğrudan hedefe yönelik, bol anahtar kelimeli ve SEO uyumlu (h1, h2, p, a etiketleri dahil) bir makale yaz. 
        Metnin içinde ${targetSite} adresine "${zone} Escort Profil Kataloğu" olarak DOFOLLOW link ver.
        ${zone} Escort, Rus Escort, Üniversiteli Escort, VIP Escort ve Kaporasız Escort nişlerini en az 3'er kez geçir.
        Okuyucuyu doğrudan randevu için kataloğa yönlendir.
    `;
    return await omniAI.generate(prompt, { provider: "deepseek", model: "deepseek-reasoner", max_tokens: 3000 });
}

async function executeSitesAttack() {
    console.log("⚔️ [GOOGLE-SITES-ATTACK] Mass Infiltration Started...");
    await TelegramService.sendMessage(`🛡️ <b>HYDRA SITES: AGRESSIVE WAR BAŞLADI</b>\n${"▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬"}\n🚀 <b>Strateji:</b> Google Sites Linklerini Indexleme & Güçlendirme\n🎯 <b>Hedef:</b> Blogger, Telegraph, GitHub Gist\n🛰️ <b>Motor:</b> DeepSeek SEO`);

    for (const site of googleSites) {
        const zone = extractZoneFromUrl(site);
        console.log(`🎯 [INFILTRATION] Targeting Zone: ${zone} for site: ${site}`);

        try {
            // 1. GENERATE HIGH-QUALITY CONTENT
            const telegraphContent = await generateTelegraphContent(zone, site);
            const anchorText = `${zone} VIP Escort Kataloğu`;

            // 2. BLOGGER (SMART POSTING)
            const blogTitle = `💎 ${zone} Escort | VIP Partner | Rus & Üniversiteli (2026)`;
            const blogContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #e11d48;">${zone} Escort ve VIP Partner Rehberi</h2>
                    <p>${zone} bölgesindeki en seçkin ve profesyonel escort hizmetleri için hazırladığımız güncel Google Sites kataloğu yayında.</p>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; border-left: 5px solid #e11d48; margin: 20px 0;">
                        <strong>💎 ÖNERİLEN KAYNAK:</strong> 
                        <a href="${site}" style="color: #e11d48; font-weight: bold; text-decoration: none;">
                            ${anchorText}
                        </a>
                    </div>

                    <p>Gerçek profiller, kaporasız randevu ve %100 gizlilik prensibiyle çalışan ${zone} VIP partnerleri hakkında detaylı bilgi için resmi kataloğumuzu ziyaret edebilirsiniz.</p>
                    
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <div style="color: #666; font-style: italic;">
                        ${telegraphContent.length > 1000 ? telegraphContent.substring(0, 1000) + '...' : telegraphContent}
                    </div>

                    <div style="margin-top: 20px; text-align: center;">
                        <a href="${site}" style="display: inline-block; background: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            🌐 ${zone} SİTESİNE GİT
                        </a>
                    </div>
                </div>
            `;
            
            const blogId = BLOGGER_TARGET_IDS[Math.floor(Math.random() * BLOGGER_TARGET_IDS.length)];
            let bloggerUrl = null;
            try {
                const res = await bloggerService.createPost(blogId, {
                    title: blogTitle,
                    content: blogContent,
                    labels: [zone.replace(/ /g, ''), 'escort', 'vip', 'istanbul'],
                    city: zone,
                    canonicalUrl: site
                });
                bloggerUrl = res.url;
            } catch (err: any) {
                console.warn(`⚠️ [BLOGGER] Failed for ${blogId}, trying another...`);
            }

            // 3. TELEGRAPH INFILTRATION
            const telegraphUrl = await telegraphService.createPost({
                title: blogTitle,
                author_name: 'HYDRA ELITE',
                content: telegraphContent
            });

            // 4. GIST INFILTRATION
            const githubMD = `
# 🛡️ ${zone} VIP PARTNERSHIP PROTOCOL (2026)

Official Google Sites authority access for elit services in the **${zone}** region.

## 🔗 ACCESS PORTAL
> [!IMPORTANT]
> To view the verified catalog and real profiles, use the official link below:
> ### 🌐 [${anchorText}](${site})

## 📍 REGIONAL COVERAGE
- **Üniversiteli & Rus Partnerler**
- **VIP Elite Sınıfı**
- **Kaporasız Randevu Sistemi**

---
*Maintained by Hydra Network Authority.*
            `.trim();

            const gistUrl = await GistAdapter.createGist(`${zone.replace(/ /g, '-').toLowerCase()}-escort-katalog.md`, githubMD);

            // 5. REPORT
            let msg = `🔥 <b>SITES BACKLINK ATAĞI: ${zone}</b>\n\n`;
            if (bloggerUrl) msg += `🅱️ <b>Blogger:</b> <a href="${bloggerUrl}">Yayında</a>\n`;
            if (telegraphUrl) msg += `📪 <b>Telegraph:</b> <a href="${telegraphUrl}">Yayında</a>\n`;
            if (gistUrl) msg += `📄 <b>Gist:</b> <a href="${gistUrl}">Yayında</a>\n`;
            msg += `🎯 <b>Hedef Site:</b> ${site}`;

            await TelegramService.sendMessage(msg);
            console.log(`✅ [SUCCESS] ${zone} attacked!`);
            
            // Wait to prevent rate limits
            await new Promise(resolve => setTimeout(resolve, 8000));

        } catch (err: any) {
            console.error(`❌ [WAR-ERROR] ${zone}:`, err.message);
        }
    }

    await TelegramService.sendMessage(`🏆 <b>HYDRA SITES: AGRESSIVE WAR TAMAMLANDI</b>\n${"▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬"}\n🧛‍♂️ <i>Tüm Google Sites linklerine agresif şekilde SEO backlinkler (Blogger, Telegraph, Gist) basıldı!</i>`);
    process.exit(0);
}

executeSitesAttack().catch(console.error);
