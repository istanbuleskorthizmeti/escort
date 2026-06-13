import 'dotenv/config';
import { vitrinImages } from '../../lib/vitrin-images';
import { siteConfig } from '../../config/site';
import { slugify } from '../../lib/utils';
import { bot } from '../../lib/crm/bot-instance';
import { generateGoldenAlt } from '../../lib/seo/traffic-monster';

/**
 * 🚀 HYDRA BLAST: TELEGRAM VISUAL SEO DOMINATION
 * Vitrin görsellerini yeni SEO linkleri ve etiketlerle kanala basar.
 */

async function executeBlast() {
  const chatID = process.env.TELEGRAM_CHAT_ID;
  if (!chatID) {
    console.error('❌ TELEGRAM_CHAT_ID missing!');
    return;
  }

  console.log('🛰️ [HYDRA-BLAST] Starting visual SEO distribution...');

  // Rastgele 5 görsel seç
  const selected = [...vitrinImages].sort(() => Math.random() - 0.5).slice(0, 5);
  const city = 'İstanbul';

  for (const item of selected) {
    const firstName = (item.title || 'VIP').split(' ')[0];
    const profileSlug = slugify(firstName);
    
    // SEO URL & Tags
    const imageName = item.src.split('/').pop() || '';
    const imageId = imageName.replace(/[^0-9]/g, '').slice(0, 5);
    const seoUrl = `https://${siteConfig.domain}/${slugify(city)}-kaporasiz-escort-bayan-${imageId}.webp`;
    const altTag = generateGoldenAlt(city);

    const niches = ['#Rus', '#Üniversiteli', '#Sarışın', '#Olgun', '#VIP', '#Kaporasız', '#Manken'];
    const randomNiche = niches[Math.floor(Math.random() * niches.length)];
    const hashtags = `#${slugify(city)} #escort #vipescort ${randomNiche} #gerçekgörsel #kaporasız`;

    const caption = `
💎 <b>${altTag.toUpperCase()}</b>
━━━━━━━━━━━━━━━━━━
👑 <b>Model:</b> ${firstName}
📍 <b>Bölge:</b> ${city} / VIP Hizmet
✨ <b>Durum:</b> %100 Gerçek & Onaylı

🔗 <a href="${seoUrl}">DETAYLI PROFİL VE RESİMLER</a>
━━━━━━━━━━━━━━━━━━
${hashtags}
🚀 <i>DRKCNAY ELITE NETWORK</i>
    `.trim();

    try {
      if (!bot) {
        console.error('❌ Bot instance is not initialized!');
        return;
      }
      const fs = require('fs');
      const path = require('path');
      const localPath = path.join(process.cwd(), 'public', 'vitrin', imageName);
      
      if (fs.existsSync(localPath)) {
        await bot.telegram.sendPhoto(chatID, { source: fs.createReadStream(localPath) }, {
          caption,
          parse_mode: 'HTML'
        });
        console.log(`✅ [BLAST] Posted via stream: ${firstName}`);
      } else {
        // Fallback to URL if file is not locally stored
        const photoUrl = `https://istanbulescort.blog/_media/vitrin/${imageName}`;
        await bot.telegram.sendPhoto(chatID, photoUrl, {
          caption,
          parse_mode: 'HTML'
        });
        console.log(`✅ [BLAST] Posted via URL fallback: ${firstName}`);
      }
      // Botun banlanmaması için bekleme
      await new Promise(r => setTimeout(r, 3000));
    } catch (e: any) {
      console.error(`❌ [BLAST ERROR] ${firstName}:`, e.message);
    }
  }

  console.log('🏁 [HYDRA-BLAST] Batch complete.');
}

if (require.main === module) {
  executeBlast().then(() => process.exit(0));
}

export { executeBlast };
