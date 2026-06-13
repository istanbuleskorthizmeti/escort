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
  // Only public target channels
  const targets = Array.from(new Set([
    '@OnlyfansPremiumvideolar',
    '@turkifsavipescort',
    '@istanbulescorthizmeti',
    '@turkifsaonlyfansdrkcn'
  ].filter(Boolean)));

  if (targets.length === 0) {
    console.error('❌ No telegram targets configured!');
    return;
  }

  const fs = require('fs');
  const path = require('path');

  // Track the last posted channel index for round-robin rotation
  const stateDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(stateDir)) {
    fs.mkdirSync(stateDir, { recursive: true });
  }
  const statePath = path.join(stateDir, 'telegram_blast_state.json');
  let lastIndex = -1;
  if (fs.existsSync(statePath)) {
    try {
      const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
      lastIndex = typeof state.lastIndex === 'number' ? state.lastIndex : -1;
    } catch (e) {
      lastIndex = -1;
    }
  }
  const nextIndex = (lastIndex + 1) % targets.length;
  fs.writeFileSync(statePath, JSON.stringify({ lastIndex: nextIndex }), 'utf8');

  const targetChannel = targets[nextIndex];
  console.log(`🎯 [HYDRA-BLAST] Staggered rotation: targeting ${targetChannel}`);

  // Scan for any video or gif files in local/remote vitrin folders
  const localVitrinDir = path.join(process.cwd(), 'public', 'vitrin');
  const mediaVitrinDir = path.join(process.cwd(), 'public', '_media', 'vitrin');
  let mediaPool = [...vitrinImages];
  
  const scanDir = (dir: string, urlPath: string) => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      const videoGifFiles = files.filter((f: string) => f.endsWith('.mp4') || f.endsWith('.gif'));
      for (const f of videoGifFiles) {
        const isMp4 = f.endsWith('.mp4');
        mediaPool.push({
          title: isMp4 ? 'VİTRİN VİDEO' : 'VİTRİN GIF',
          src: `${urlPath}/${f}`,
          isVideo: isMp4,
          isGif: f.endsWith('.gif')
        });
      }
    }
  };

  scanDir(localVitrinDir, '/_media/vitrin');
  scanDir(mediaVitrinDir, '/_media/vitrin');

  if (mediaPool.length === 0) {
    console.error('❌ Media pool is empty!');
    return;
  }

  // Pick exactly 1 random item from the pool to ensure unique content per run
  const item = mediaPool[Math.floor(Math.random() * mediaPool.length)];
  const city = 'İstanbul';

  const firstName = (item.title || 'VIP').split(' ')[0];
  
  // SEO URL & Tags (Points to homepage as requested)
  const imageName = item.src.split('/').pop() || '';
  const targetUrl = `https://${siteConfig.domain}/`;
  const altTag = generateGoldenAlt(city);

  // Dynamic Anti-Ban Spin Content
  const randomEmojis = ['💎', '👑', '✨', '🔥', '❤️', '💋', '🌟', '🍒'];
  const selectedEmoji = randomEmojis[Math.floor(Math.random() * randomEmojis.length)];
  const randomSuffix = Math.floor(Math.random() * 900) + 100; // Anti-duplicate text suffix
  const niches = ['#Rus', '#Üniversiteli', '#Sarışın', '#Olgun', '#VIP', '#Kaporasız', '#Manken'];
  const randomNiche = niches[Math.floor(Math.random() * niches.length)];
  const hashtags = `#${slugify(city)} #escort #vipescort ${randomNiche} #gerçekgörsel #kaporasız`;

  const caption = `
${selectedEmoji} <b>${altTag.toUpperCase()}</b>
━━━━━━━━━━━━━━━━━━
👑 <b>Model:</b> ${firstName}
📍 <b>Bölge:</b> ${city} / VIP Hizmet
✨ <b>Durum:</b> %100 Gerçek & Onaylı [#${randomSuffix}]

🔗 <a href="${targetUrl}">DETAYLI PROFİL VE RESİMLER</a>
━━━━━━━━━━━━━━━━━━
${hashtags}
🚀 <i>DRKCNAY ELITE NETWORK</i>
  `.trim();

  try {
    if (!bot) {
      console.error('❌ Bot instance is not initialized!');
      return;
    }
    let localPath = path.join(process.cwd(), 'public', 'vitrin', imageName);
    if (!fs.existsSync(localPath)) {
      localPath = path.join(process.cwd(), 'public', '_media', 'vitrin', imageName);
    }
    const isVideoFile = imageName.endsWith('.mp4') || (item as any).isVideo;
    const isGifFile = imageName.endsWith('.gif') || (item as any).isGif;
    
    const hasLocal = fs.existsSync(localPath);
    const sourceData = hasLocal ? { source: fs.createReadStream(localPath) } : `https://istanbulescort.blog/_media/vitrin/${imageName}`;

    if (isVideoFile) {
      await bot.telegram.sendVideo(targetChannel, sourceData, {
        caption,
        parse_mode: 'HTML'
      });
      console.log(`✅ [BLAST] Video posted to ${targetChannel}: ${firstName}`);
    } else if (isGifFile) {
      await bot.telegram.sendAnimation(targetChannel, sourceData, {
        caption,
        parse_mode: 'HTML'
      });
      console.log(`✅ [BLAST] Animation posted to ${targetChannel}: ${firstName}`);
    } else {
      await bot.telegram.sendPhoto(targetChannel, sourceData, {
        caption,
        parse_mode: 'HTML'
      });
      console.log(`✅ [BLAST] Photo posted to ${targetChannel}: ${firstName}`);
    }
  } catch (e: any) {
    console.error(`❌ [BLAST ERROR] ${firstName} on ${targetChannel}:`, e.message);
  }

  console.log('🏁 [HYDRA-BLAST] Staggered single post complete.');
}

if (require.main === module) {
  executeBlast().then(() => process.exit(0));
}

export { executeBlast };
