
import { TelegramService } from "../lib/crm/telegram";
import { googleIndexing } from "../lib/google-indexing";
import { omniAI } from "../lib/ai-provider";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { telegraphService } from "../lib/seo/telegraph";
import { GistAdapter } from "../lib/parasite/gist";
import { AUTHORITY_HUBS, getRandomAuthorityHub } from "../config/authority-hubs";
import { prisma } from "../lib/prisma";
import { bloggerService } from "../lib/seo/blogger";
import { BLOGGER_TARGET_IDS } from "../config/blogger-ids";
import { shortenUrl } from "../lib/seo/bitly";
import { getOrGenerateShortLink } from "../lib/seo/bitly-automation";

import { ISTANBUL_NEIGHBORS } from "../lib/seo/neighborhood-map";

dotenv.config();

const TARGET_ZONES = Object.keys(ISTANBUL_NEIGHBORS);
const MONEY_SITE = "https://istanbulescort.blog";

async function generateTelegraphContent(zone: string) {
    const prompt = `
        Sen bir Karatay SEO Uzmanısın. 
        "${zone} Escort | ${zone} VIP Partner | ${zone} Rus & Üniversiteli Escort" başlıklı, 
        doğrudan hedefe yönelik, bol anahtar kelimeli ve SEO uyumlu (h1, h2, p, a etiketleri dahil) bir makale yaz. 
        Metnin içinde ${MONEY_SITE} adresine "Resmi Escort Kataloğu" olarak link ver.
        ${zone} Escort, Rus Escort, Üniversiteli Escort, VIP Escort ve Kaporasız Escort nişlerini en az 3'er kez geçir.
        Okuyucuyu doğrudan randevu için kataloğa yönlendir.
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
            // Dynamic anchor from the more advanced service
            const anchors = [
                `${zone} VIP Katalog`,
                `${zone} Elit Profiller`,
                `${zone} Resmi Web Sitesi`,
                `${zone} Güncel Escort Rehberi`,
                `Resmi Katalog: ${zone}`
            ];
            const anchorText = anchors[Math.floor(Math.random() * anchors.length)];

            // 🎯 LINK ROTATION: Pick a target URL (50% Money Site, 50% Authority Hub)
            const useHub = Math.random() > 0.5;
            const hub = AUTHORITY_HUBS.find(h => h.name.toLowerCase().includes(zone.toLowerCase())) || getRandomAuthorityHub();
            
            // Clean/Direct URL selection: Ensure no cache domain/path is used
            const targetUrl = useHub ? hub.url : "https://vipescorthizmeti.com";
            const targetName = useHub ? hub.name : "Vip Escort Hizmeti";

            console.log(`🔗 [LINK-WAR] Target URL: ${targetUrl} (${targetName})`);

            // Use the direct link to maximize SEO flow to the actual target domain
            const finalLink = targetUrl;
            console.log(`🛡️ [DIRECT LINK] Using direct canonical URL: ${finalLink}`);

            // 2. BLOGGER (SMART POSTING)
            const blogTitle = `💎 ${zone} Escort | VIP Partner | Rus & Üniversiteli (2026)`;
            const blogContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #e11d48;">${zone} Escort ve VIP Partner Rehberi</h2>
                    <p>${zone} bölgesindeki en seçkin ve profesyonel escort hizmetleri için hazırladığımız güncel katalog yayında.</p>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; border-left: 5px solid #e11d48; margin: 20px 0;">
                        <strong>💎 ÖNERİLEN KAYNAK:</strong> 
                        <a href="${finalLink}" style="color: #e11d48; font-weight: bold; text-decoration: none;">
                            ${anchorText}
                        </a>
                    </div>

                    <p>Gerçek profiller, kaporasız randevu ve %100 gizlilik prensibiyle çalışan ${zone} VIP partnerleri hakkında detaylı bilgi için resmi kataloğumuzu ziyaret edebilirsiniz.</p>
                    
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <div style="color: #666; font-style: italic;">
                        ${telegraphContent.length > 1500 ? telegraphContent.substring(0, 1500) + '...' : telegraphContent}
                    </div>

                    <div style="margin-top: 20px; text-align: center;">
                        <a href="${finalLink}" style="display: inline-block; background: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            🌐 ${zone} VIP KATALOĞU GÖRÜNTÜLE
                        </a>
                    </div>

                    <div style="margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 10px; color: #999; font-size: 11px;">
                        #${zone.toLowerCase()}escort #${zone.toLowerCase()}vip #kaporasizescort #universiteliescort #rusvip #elitrehber
                    </div>
                </div>
            `;
            
            // 🎯 BLOGGER ROTATION: Pick a random ID from the pool
            const blogId = BLOGGER_TARGET_IDS[Math.floor(Math.random() * BLOGGER_TARGET_IDS.length)];
            
            let bloggerUrl = null;
            try {
                const res = await bloggerService.createPost(blogId, {
                    title: blogTitle,
                    content: blogContent,
                    labels: [zone, 'escort', 'vip', 'istanbul'],
                    city: zone,
                    canonicalUrl: targetUrl
                });
                bloggerUrl = res.url;
            } catch (err: any) {
                console.warn(`⚠️ [BLOGGER] Failed for ${blogId}, trying another...`);
            }

            // 3. TELEGRAPH INFILTRATION
            const telegraphUrl = await telegraphService.createPost({
                title: blogTitle,
                author_name: 'DRKCNAY ELITE',
                content: telegraphContent
            });

            const githubMD = `
# 🔞 ${zone} Escort | ${zone} VIP Partner & Escort Kataloğu (2026)

${zone} bölgesinde güvenilir, gizlilik odaklı ve profesyonel **escort** partner arayışındaysanız doğru yerdesiniz. Hydra Elite Network, ${zone} escort nişlerinde en iyi, kaporasız ve gerçek profilleri bir araya getiren prestijli bir protokoldür.

## 🔗 RESMİ REZERVASYON VE ACCESS PORTAL
> [!IMPORTANT]
> Gerçek fotoğraflı, doğrulanmış VIP escort kataloğunu ve özel partner listesini görüntülemek için lütfen resmi web sitemizi ziyaret edin:
> ### 🌐 👉 [${anchorText}](${finalLink}) 👈

## 📍 HİZMET NİŞLERİ VE SOSYAL SEÇENEKLER
- **🔞 ${zone} Rus Escort:** Kültürel zarafet ve yüksek enerjili partner deneyimi.
- **🎓 ${zone} Üniversiteli Escort:** Genç, dinamik ve samimi arkadaşlık arkadaşları.
- **👑 VIP Partner & Escort Hizmeti:** Tamamen gizli, lüks akşam yemekleri ve sosyal etkinlik refakatçisi.
- **💖 Olgun & Sarışın / Esmer Partnerler:** Fantezi ve sohbet odaklı deneyimli escort profilleri.

---

### 🛡️ Neden ${zone} Escort?
- **Kaporasız Hizmet:** Kapıda ödeme güvencesiyle sahte profillere karşı %100 koruma.
- **Gerçek ve Canlı Görseller:** Tamamı ajansımız tarafından onaylanmış aktif escort kadrosu.
- **Özel Gizlilik:** İkinci şahıslarla asla paylaşılmayan kişisel veriler ve gizli randevu sistemi.

---

#### 🏷️ SOSYAL ETİKETLER & FOOTER SEO CLOUD (AGRESİF)
\`\`\`text
${zone.toLowerCase()}-escort, ${zone.toLowerCase()}-vip-escort, ${zone.toLowerCase()}-rus-escort, ${zone.toLowerCase()}-universiteli-escort, ${zone.toLowerCase()}-bayan-escort, ${zone.toLowerCase()}-kaporasiz-escort, istanbul-escort, vip-escort, rus-escort, elit-partner, kaporasiz-escort, escort-bayan, model-escort, escort-rehberi, ${zone.toLowerCase()}-escort-bayan, ${zone.toLowerCase()}-vip-katalog
\`\`\`

---
*Maintained by Hydra Network Authority & DRKCNAY Elite. All Rights Reserved.*
            `.trim();

            // 4. GIST INFILTRATION
            const gistUrl = await GistAdapter.createGist(`${zone.toLowerCase()}-vip-katalog.md`, githubMD);

            // 5. PERSIST PAYLOADS & REPORT (Telegraph + GitHub + Gist + Blogger)
            const outDir = path.join(process.cwd(), 'parasite_hub', zone);
            if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
            
            // Save Telegraph HTML
            fs.writeFileSync(path.join(outDir, 'telegraph_final.html'), telegraphContent);

            // Save to DB (Optional - Don't crash if DB is down)
            try {
                await prisma.pageContent.upsert({
                    where: { slug_siteId: { slug: zone, siteId: 'clvv123' } },
                    update: {
                        bloggerPostUrl: bloggerUrl || undefined,
                        isBloggerPosted: !!bloggerUrl,
                        telegraphPostUrl: telegraphUrl || undefined,
                        isTelegraphPosted: !!telegraphUrl,
                        gistPostUrl: gistUrl || undefined,
                        isGistPosted: !!gistUrl,
                        updatedAt: new Date()
                    },
                    create: {
                        slug: zone,
                        siteId: 'clvv123',
                        title: blogTitle,
                        bloggerPostUrl: bloggerUrl || undefined,
                        isBloggerPosted: !!bloggerUrl,
                        telegraphPostUrl: telegraphUrl || undefined,
                        isTelegraphPosted: !!telegraphUrl,
                        gistPostUrl: gistUrl || undefined,
                        isGistPosted: !!gistUrl
                    }
                });
            } catch (dbErr) {
                console.warn(`⚠️ [DB-ERROR] Could not save ${zone} to database, but continuing with report...`);
            }

            // Generate & Save GitHub README Payload
            fs.writeFileSync(path.join(outDir, 'README_FINAL.md'), githubMD);

            if (bloggerUrl) {
                await googleIndexing.broadcast(bloggerUrl);
                await TelegramService.sendMessage(`🅱️ <b>BLOGGER SIZINTISI</b>\n📍 Bölge: <code>${zone}</code>\n🔗 <a href="${bloggerUrl}">Görüntüle</a>\n🎯 Hedef: <a href="${targetUrl}">${targetName}</a>`);
            }

            if (telegraphUrl) {
                await TelegramService.sendMessage(`📪 <b>TELEGRAPH SIZINTISI</b>\n📍 Bölge: <code>${zone}</code>\n🔗 <a href="${telegraphUrl}">Görüntüle</a>\n🎯 Hedef: <a href="${targetUrl}">${targetName}</a>`);
            }

            if (gistUrl) {
                await TelegramService.sendMessage(`📄 <b>GIST SIZINTISI</b>\n📍 Bölge: <code>${zone}</code>\n🔗 <a href="${gistUrl}">Görüntüle</a>\n🎯 Hedef: <a href="${targetUrl}">${targetName}</a>`);
            }

            console.log(`✅ [SUCCESS] ${zone} conquered with real links.`);

        } catch (err: any) {
            console.error(`❌ [WAR-ERROR] ${zone}:`, err.message);
        }
    }

    await TelegramService.sendMessage(`🏆 <b>HYDRA: SMART WAR TAMAMLANDI</b>\n${"▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬"}\n🧛‍♂️ <i>Kral, Blogger'ı yormadan, akıllı linklerle tüm bölgeleri mühürledik.</i>`);
}

executeTotalWar();
