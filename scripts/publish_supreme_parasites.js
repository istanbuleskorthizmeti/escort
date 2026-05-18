require('dotenv').config();

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

// Hatena WSSE Header Jeneratörü
function generateWsseHeader(username, apiKey) {
  const nonce = crypto.randomBytes(16).toString('hex');
  const created = new Date().toISOString();
  
  const sha1 = crypto.createHash('sha1');
  sha1.update(Buffer.concat([
    Buffer.from(nonce, 'utf-8'),
    Buffer.from(created, 'utf-8'),
    Buffer.from(apiKey, 'utf-8')
  ]));
  const digest = sha1.digest('base64');
  const base64Nonce = Buffer.from(nonce, 'utf-8').toString('base64');

  return `UsernameToken Username="${username}", PasswordDigest="${digest}", Nonce="${base64Nonce}", Created="${created}"`;
}

// Hatena Blog AtomPub Yayıncısı
async function publishToHatena(title, content, slug) {
  const username = process.env.HATENA_USERNAME || "dorukcanay";
  const apiKey = process.env.HATENA_API_KEY;
  const blogId = process.env.HATENA_BLOG_ID || "dorukcanay.hatenablog.com";

  if (!apiKey) {
    console.log('⚠️ [HATENA] HATENA_API_KEY bulunamadığı için atlanıyor.');
    return { success: false, reason: 'Credentials missing' };
  }

  const endpoint = `https://blog.hatena.ne.jp/${username}/${blogId}/atom/entry`;
  const xmlPayload = `<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom"
       xmlns:app="http://www.w3.org/2007/app">
  <title>${title}</title>
  <author><name>${username}</name></author>
  <content type="text/x-markdown">${content}</content>
  <updated>${new Date().toISOString()}</updated>
  <category term="Vip Escort" />
  <category term="Elit Partner" />
  <app:control>
    <app:draft>no</app:draft>
  </app:control>
</entry>`;

  try {
    const wsse = generateWsseHeader(username, apiKey);
    const response = await axios.post(endpoint, xmlPayload, {
      headers: {
        'X-WSSE': wsse,
        'Content-Type': 'application/xml',
        'User-Agent': 'Mozilla/5.0'
      },
      timeout: 20000
    });

    if (response.status === 201) {
      const match = response.data.match(/<link rel="alternate" type="text\/html" href="([^"]+)"\/>/);
      const liveUrl = match ? match[1] : `https://${blogId}/entry/${slug}`;
      console.log(`✅ [HATENA SUCCESS] ${title} yayında: ${liveUrl}`);
      return { success: true, url: liveUrl };
    }
  } catch (err) {
    const detail = err.response ? JSON.stringify(err.response.data) : err.message;
    console.error(`❌ [HATENA ERROR] Yayınlama başarısız:`, detail);
    return { success: false, reason: err.message };
  }
  return { success: false, reason: 'Unknown error' };
}

// Medium REST API Yayıncısı
async function publishToMedium(title, content) {
  const token = process.env.MEDIUM_ACCESS_TOKEN;
  if (!token) {
    console.log('⚠️ [MEDIUM] MEDIUM_ACCESS_TOKEN bulunamadığı için atlanıyor.');
    return { success: false, reason: 'Credentials missing' };
  }

  try {
    // 1. Profil ID'sini çek
    const profileRes = await axios.get('https://api.medium.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    if (!profileRes.data || !profileRes.data.data || !profileRes.data.data.id) {
      return { success: false, reason: 'Failed to fetch author ID' };
    }

    const authorId = profileRes.data.data.id;

    // 2. Makaleyi yayına al
    const publishEndpoint = `https://api.medium.com/v1/users/${authorId}/posts`;
    const response = await axios.post(publishEndpoint, {
      title: title,
      contentFormat: 'markdown',
      content: content,
      tags: ["vip escort", "escort", "elit partner", "istanbul"],
      publishStatus: 'public'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 25000
    });

    if (response.status === 201 && response.data && response.data.data) {
      const liveUrl = response.data.data.url;
      console.log(`✅ [MEDIUM SUCCESS] ${title} yayında: ${liveUrl}`);
      return { success: true, url: liveUrl };
    }
  } catch (err) {
    const detail = err.response ? JSON.stringify(err.response.data) : err.message;
    console.error(`❌ [MEDIUM ERROR] Yayınlama başarısız:`, detail);
    return { success: false, reason: err.message };
  }
  return { success: false, reason: 'Unknown error' };
}

async function run() {
  console.log('🔥 [HYDRA PUBLISH] Otonom Parazit Yayıncı Motoru Başlatıldı...');
  
  const articlesDir = path.join(process.cwd(), 'supreme_parasite_articles');
  if (!fs.existsSync(articlesDir)) {
    console.error('❌ [HATA] supreme_parasite_articles klasörü bulunamadı!');
    process.exit(1);
  }

  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  if (files.length === 0) {
    console.log('⚠️ [UYARI] Yayınlanacak Markdown makalesi bulunamadı.');
    process.exit(0);
  }

  console.log(`📚 Toplam ${files.length} adet makale kuyruğa alındı.`);
  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  
  let reportMessage = `🔥 <b>🏆 HYDRA PARASITE SIEGE YAYIN RAPORU (v1.0) 🏆</b> 🔥\n`;
  reportMessage += `🕒 <b>Tarih:</b> <code>${timestamp}</code>\n\n`;

  const results = [];

  for (const file of files) {
    const filePath = path.join(articlesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const slug = file.replace('.md', '');
    
    // Markdown içeriğinden başlığı ayıkla (Örn: # 👑 Sefaköy VIP Escort ...)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : `${slug.toUpperCase()} VIP Escort`;

    console.log(`\n──────────────────────────────────────────`);
    console.log(`📖 [DOSYA OKUNDU] Başlık: ${title}`);
    
    const districtName = slug.split('-')[0].toUpperCase();
    reportMessage += `⭐️ <b>[${districtName} KUŞATMASI]</b>\n`;

    // 1. Hatena Blog'da yayınla
    const hatenaRes = await publishToHatena(title, content, slug);
    if (hatenaRes.success) {
      reportMessage += `🇯🇵 <b>Hatena:</b> <a href="${hatenaRes.url}">YAYINDA</a>\n`;
    } else {
      reportMessage += `🇯🇵 <b>Hatena:</b> <code>PAS GÇİLDİ / BAŞARISIZ</code> (API Key eksik olabilir)\n`;
    }

    // 2. Medium'da yayınla
    const mediumRes = await publishToMedium(title, content);
    if (mediumRes.success) {
      reportMessage += `✍️ <b>Medium:</b> <a href="${mediumRes.url}">YAYINDA</a>\n`;
    } else {
      reportMessage += `✍️ <b>Medium:</b> <code>PAS GEÇİLDİ / BAŞARISIZ</code> (Access Token eksik olabilir)\n`;
    }

    reportMessage += `\n`;
    results.push({
      file,
      title,
      hatena: hatenaRes.success ? hatenaRes.url : 'PASSED/FAILED',
      medium: mediumRes.success ? mediumRes.url : 'PASSED/FAILED'
    });

    // Her makale arasında platform koruması için 3 saniye bekle
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  reportMessage += `⚡ <i>Hydra Sovereign Siege Network - Parasite Publisher Engine</i>`;

  console.log('\n📲 Telegram Kuşatma Raporu Gönderiliyor...');
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: reportMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      });
      console.log('🏆 Telegram bildirimi başarıyla gönderildi!');
    }
  } catch (tgErr) {
    console.error('⚠️ Telegram bildirimi başarısız:', tgErr.message);
  }

  console.log('\n🏁 Tüm parazit kuşatması tamamlandı! Raporlama Tablosu:');
  console.table(results);
}

run().catch(console.error);
