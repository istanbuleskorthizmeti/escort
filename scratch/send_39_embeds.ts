
import { ISTANBUL_NEIGHBORS } from '../lib/seo/neighborhood-map';
import { TelegramService } from '../lib/crm/telegram';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const GAS_GATEWAY_URL = "https://script.google.com/macros/s/AKfycbydyYobsAT4p-Tbi8n72TydN8YajdUEfGwB3GhwhoYodeHSthZ8jPxkvYK7GHn-q7GZ/exec";

async function sendDistricts() {
    const districts = Object.keys(ISTANBUL_NEIGHBORS);
    console.log(`🚀 Sending ${districts.length} districts to Telegram...`);

    for (const slug of districts) {
        const neighbors = ISTANBUL_NEIGHBORS[slug];
        const districtName = slug.charAt(0).toUpperCase() + slug.slice(1);
        const tagPool = neighbors.map(n => `${districtName} escort, ${n} escort, vip ${districtName} escort`).join(', ');

        const embedCode = `
<div style="width:100%; height:2000px; overflow:hidden; border:2px solid #e11d48; border-radius:15px; box-shadow: 0 10px 30px rgba(225, 29, 72, 0.3);">
    <iframe src="${GAS_GATEWAY_URL}" width="100%" height="2000px" frameborder="0"></iframe>
</div>
<div style="margin-top:20px; padding:20px; background:linear-gradient(135deg, #111 0%, #222 100%); border-radius:10px; font-family:sans-serif; color:#fff;">
    <h2 style="color:#e11d48; margin-top:0;">💎 ${districtName} VIP Deneyimi</h2>
    <p style="color:#ccc; line-height:1.6; font-size:14px;">${tagPool}</p>
</div>`.trim();

        const message = `📍 <b>BÖLGE: ${districtName.toUpperCase()}</b>\n\n<code>${embedCode}</code>`;
        
        try {
            await TelegramService.sendMessage(message);
            console.log(`✅ Sent: ${districtName}`);
            // Sleep to avoid rate limiting
            await new Promise(r => setTimeout(r, 800));
        } catch (e) {
            console.error(`❌ Failed: ${districtName}`, e);
        }
    }
    console.log("🏁 Done!");
}

sendDistricts();
