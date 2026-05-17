
import { ISTANBUL_NEIGHBORS } from '../lib/seo/neighborhood-map';
import { TelegramService } from '../lib/crm/telegram';
import * as dotenv from 'dotenv';

dotenv.config();

const GAS_GATEWAY_URL = "https://script.google.com/macros/s/AKfycbydyYobsAT4p-Tbi8n72TydN8YajdUEfGwB3GhwhoYodeHSthZ8jPxkvYK7GHn-q7GZ/exec";

async function sendFullReports() {
    const districts = Object.keys(ISTANBUL_NEIGHBORS);
    console.log(`🏴‍☠️ [GOD MODE] 39-District Full Reporting Engine Started...`);

    for (const slug of districts) {
        const neighbors = ISTANBUL_NEIGHBORS[slug] || ["İstanbul", "Türkiye"];
        const districtName = slug.charAt(0).toUpperCase() + slug.slice(1);
        
        const siteName = `${districtName} Escort VIP`;
        const title = `${districtName} Escort | ${neighbors[0]} Escort | ${neighbors[1]} Escort`;
        const publishSlug = `${slug}escort-drkcnay1`;
        const url = `https://sites.google.com/view/${publishSlug}`;
        
        const tags = [
            `${districtName} escort`, 
            `vip ${districtName} escort`, 
            `${districtName} escort bayan`,
            `${neighbors[0]} escort`, 
            `${neighbors[1]} escort`, 
            `kaporasız ${districtName} escort`
        ].join(', ');

        const embedCode = `
<div style="width:100%; height:2000px; overflow:hidden; border:2px solid #e11d48; border-radius:15px; box-shadow: 0 10px 30px rgba(225, 29, 72, 0.3);">
    <iframe src="${GAS_GATEWAY_URL}" width="100%" height="2000px" frameborder="0"></iframe>
</div>
<div style="margin-top:20px; padding:20px; background:linear-gradient(135deg, #111 0%, #222 100%); border-radius:10px; font-family:sans-serif; color:#fff;">
    <h2 style="color:#e11d48; margin-top:0;">💎 ${districtName} VIP Deneyimi</h2>
    <p style="color:#ccc; line-height:1.6; font-size:14px;">${tags}</p>
</div>`.trim();

        const message = `
🏆 <b>HYDRA VICTORY REPORT: ${districtName.toUpperCase()}</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🏠 <b>SİTE ADI:</b> <code>${siteName}</code>
✍️ <b>BAŞLIK:</b> <code>${title}</code>
🔗 <b>URL:</b> ${url}
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
📝 <b>EMBED KODU:</b>
<code>${embedCode}</code>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🏷️ <b>ETİKET HAVUZU:</b>
<code>${tags}</code>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🧛‍♂️ <i>#HydraNetwork #GodMode #SectorSecured</i>`.trim();

        try {
            await TelegramService.sendMessage(message);
            console.log(`✅ [REPORT SENT] ${districtName}`);
            // 2 second delay to ensure reliability
            await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
            console.error(`❌ [REPORT FAILED] ${districtName}`, e);
        }
    }
    console.log("🏁 [ALL SECTORS SECURED] Done!");
}

sendFullReports();
