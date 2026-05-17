
import { ISTANBUL_NEIGHBORS } from '../lib/seo/neighborhood-map';
import { TelegramService } from '../lib/crm/telegram';
import * as dotenv from 'dotenv';

dotenv.config();

const GAS_GATEWAY_URL = "https://script.google.com/macros/s/AKfycbydyYobsAT4p-Tbi8n72TydN8YajdUEfGwB3GhwhoYodeHSthZ8jPxkvYK7GHn-q7GZ/exec";

const VARIANTS = {
    keywords: ["Escort", "Elite Partner", "VIP Eskort", "Bayan", "Üniversiteli", "Lüks Görüşme", "Partner"],
    siteNames: ["VIP", "Lüks", "Elite", "Exclusive", "Premium", "Platinum"],
    descriptions: [
        "En elit ve gerçek profillerle unutulmaz bir deneyim.",
        "Gizlilik ve kalite odaklı profesyonel partner hizmeti.",
        "Şehrin en seçkin bayanları ile güvenilir buluşma.",
        "Kaporasız ve %100 gerçek görsellerle VIP hizmet.",
        "Sıfır risk ve maksimum memnuniyet garantili partnerler."
    ]
};

function getRandom(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function sendUniqueReports() {
    const districts = Object.keys(ISTANBUL_NEIGHBORS);
    console.log(`🏴‍☠️ [GOD MODE] 39-District UNIQUE Reporting Engine Started...`);

    for (const slug of districts) {
        const neighbors = ISTANBUL_NEIGHBORS[slug] || ["İstanbul", "Türkiye"];
        const districtName = slug.charAt(0).toUpperCase() + slug.slice(1);
        
        // ÖZGÜNLEŞTİRME LOGIC
        const kw1 = getRandom(VARIANTS.keywords);
        const kw2 = getRandom(VARIANTS.keywords);
        const sn = getRandom(VARIANTS.siteNames);
        const desc = getRandom(VARIANTS.descriptions);

        const siteName = `${districtName} ${kw1} ${sn}`;
        const title = `${districtName} ${kw1} | ${neighbors[0]} ${kw2} | ${neighbors[1]} Partner`;
        const publishSlug = `${slug}-${kw1.toLowerCase().replace(' ', '-')}-drkcnay1`;
        const url = `https://sites.google.com/view/${publishSlug}`;
        
        const tags = [
            `${districtName} escort`, 
            `${neighbors[0]} ${kw1.toLowerCase()}`, 
            `${neighbors[1]} partner`,
            `vip ${districtName}`, 
            `kaporasız ${districtName} escort`
        ].join(', ');

        const embedCode = `
<div style="width:100%; height:2000px; overflow:hidden; border:2px solid #e11d48; border-radius:15px; box-shadow: 0 10px 30px rgba(225, 29, 72, 0.3);">
    <iframe src="https://vipescorthizmeti.com/" width="100%" height="2000px" frameborder="0"></iframe>
</div>
<div style="margin-top:20px; padding:20px; background:linear-gradient(135deg, #111 0%, #222 100%); border-radius:10px; font-family:sans-serif; color:#fff;">
    <h2 style="color:#e11d48; margin-top:0;">💎 ${districtName} ${sn} Deneyimi</h2>
    <p style="color:#ccc; line-height:1.6; font-size:14px;">${desc}</p>
    <p style="color:#444; font-size:10px; margin-top:10px;">${tags}</p>
</div>`.trim();

        const message = `
🏆 <b>HYDRA UNIQUE REPORT: ${districtName.toUpperCase()}</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🏠 <b>SİTE ADI:</b> <code>${siteName}</code>
✍️ <b>BAŞLIK:</b> <code>${title}</code>
🔗 <b>URL:</b> ${url}
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
📝 <b>EMBED KODU (ÖZGÜN):</b>
<code>${embedCode}</code>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🏷️ <b>ETİKET HAVUZU:</b>
<code>${tags}</code>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🧛‍♂️ <i>#UniqueSiege #HydraV2 #SectorSecured</i>`.trim();

        try {
            await TelegramService.sendMessage(message);
            console.log(`✅ [UNIQUE SENT] ${districtName}`);
            await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
            console.error(`❌ [UNIQUE FAILED] ${districtName}`, e);
        }
    }
    console.log("🏁 [ALL UNIQUE SECTORS SECURED] Done!");
}

sendUniqueReports();
