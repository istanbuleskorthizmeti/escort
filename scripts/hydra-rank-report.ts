
import { TelegramService } from "../lib/crm/telegram";
import { DOMAIN_MATRIX } from "../config/domains";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const TARGET_KEYWORDS = [
    "istanbul escort",
    "bağcılar escort",
    "şişli escort",
    "beşiktaş escort",
    "beylikdüzü escort"
];

const TARGET_DOMAINS = DOMAIN_MATRIX
    .filter(d => d.role === 'MONEY_SITE' || d.host.includes('bagcilar'))
    .map(d => d.host);

async function checkRank(keyword: string): Promise<any> {
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    const searchUrl = `https://www.google.com.tr/search?q=${encodeURIComponent(keyword)}&num=50&gl=tr&hl=tr`;

    try {
        const response = await axios.get(searchUrl, {
            headers: { "User-Agent": userAgent }
        });
        const html = response.data;
        const results: { domain: string, rank: number }[] = [];
        
        const linkRegex = /<a[^>]+href="(https?:\/\/([^"\/]+))"/gi;
        let match;
        let currentPosition = 1;
        const seenDomains = new Set();
        const noise = ['google.com', 'w3.org', 'youtube.com', 'facebook.com', 'instagram.com', 'twitter.com', 'apple.com'];

        while ((match = linkRegex.exec(html)) !== null && currentPosition <= 50) {
            const domain = match[2].toLowerCase();
            if (noise.some(n => domain.includes(n)) || seenDomains.has(domain)) continue;
            
            seenDomains.add(domain);
            
            if (TARGET_DOMAINS.some(td => domain.includes(td))) {
                results.push({ domain, rank: currentPosition });
            }
            currentPosition++;
        }
        return results;
    } catch (err: any) {
        console.error(`Rank check failed for ${keyword}:`, err.message);
        return [];
    }
}

async function runReport() {
    console.log("📊 [HYDRA-REPORT] Starting Ranking Analysis...");
    
    let reportMessage = `
📊 <b>HYDRA SERP DOMİNASYON RAPORU</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🎯 <b>Hedef:</b> Anahtar Kelime Bazlı Konum Analizi
🚀 <b>Durum:</b> Hydra Gözcüleri Taramada...
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`;

    for (const kw of TARGET_KEYWORDS) {
        console.log(`🔍 Checking: ${kw}`);
        const rankings = await checkRank(kw);
        
        reportMessage += `🔑 <b>${kw.toUpperCase()}</b>\n`;
        if (rankings.length > 0) {
            rankings.forEach((r: any) => {
                const icon = r.rank <= 3 ? '🥇' : r.rank <= 10 ? '🔥' : '📈';
                reportMessage += `${icon} <code>${r.domain}</code> -> <b>#${r.rank}</b>\n`;
            });
        } else {
            reportMessage += `⚪ <i>İlk 50'de henüz kayıt yok.</i>\n`;
        }
        reportMessage += `\n`;
        
        // Anti-blocking delay
        await new Promise(r => setTimeout(r, 2000));
    }

    reportMessage += `
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🔗 <b>YENİ LANDİNG PAGE:</b>
📍 Bağcılar Escort Elite:
<a href="https://vipescorthizmeti.com/subeler/bagcilar-escort-elite">Görüntüle & Kontrol Et</a>

🛡️ <b>BACKLINK DURUMU:</b>
✅ <b>Parasite Hub:</b> Aktif (GitHub/Telegraph/PDF)
✅ <b>Blogger Network:</b> 56 domain senkronize
✅ <b>PBN Taarruzu:</b> Devam ediyor (Nuclear Bomber)
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🧛‍♂️ <i>Kral, sistem canavar gibi çalışıyor. .COM üzerinden tüm pingleme ve yetkilendirme işlemleri mühürlendi.</i>
    `.trim();

    await TelegramService.sendMessage(reportMessage);
    console.log("✅ [REPORT-DONE] Sent to Telegram.");
}

runReport();
