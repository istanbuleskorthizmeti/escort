require('dotenv').config();
const axios = require('axios');

const googleSites = [
  { url: "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa", keyword: "sefakoy_vip_escort_2026" },
  { url: "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa", keyword: "bakirkoy_vip_escort_2026" },
  { url: "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa", keyword: "catalca_vip_escort_2026" },
  { url: "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa", keyword: "beylikduzu_vip_escort_2026" },
  { url: "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa?read_current=1", keyword: "besyol_universiteli_escort_2026" },
  { url: "https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/ana-sayfa", keyword: "besyol_vip_escort_2026" },
  { url: "https://sites.google.com/dorukcanay.digital/istanbul-escort/ana-sayfa", keyword: "istanbul_vip_escort_2026" },
  { url: "https://sites.google.com/dorukcanay.digital/sancaktepe-escort-drkcnay1-v/ana-sayfa", keyword: "sancaktepe_vip_escort_2026" },
  { url: "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v/ana-sayfa", keyword: "kartal_vip_escort_2026" },
  { url: "https://sites.google.com/dorukcanay.digital/cekmekoy-escort-drkcnay1-v/ana-sayfa", keyword: "cekmekoy_vip_escort_2026" },
  { url: "https://sites.google.com/dorukcanay.digital/arnavutkoy-escort-drkcnay1-v/ana-sayfa", keyword: "arnavutkoy_vip_escort_2026" },
  { url: "https://sites.google.com/dorukcanay.digital/basaksehir-escort-drkcnay1-v/ana-sayfa", keyword: "basaksehir_vip_escort_2026" },
  { url: "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v/ana-sayfa", keyword: "esenler_vip_escort_2026" },
  { url: "https://sites.google.com/dorukcanay.digital/adalar-escort-drkcnay1-v/ana-sayfa", keyword: "adalar_vip_escort_2026" }
];

/**
 * Intelligent SEO link shortener using pure underscores to bypass is.gd/v.gd strict hyphen rules.
 * Automatically replaces hyphens with underscores to guarantee target keyword bindings.
 */
async function shortenWithSeoFallback(longUrl, baseKeyword) {
  const cleanKeyword = baseKeyword.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/-/g, '_');
  
  // High-intent LSI variations with underscores to cycle through
  const variations = [
    cleanKeyword, // sefakoy_vip_escort_2026
    cleanKeyword.replace('_vip_escort_', '_escort_'), // sefakoy_escort_2026
    cleanKeyword.replace('_vip_', '_elit_'), // sefakoy_elit_escort_2026
    cleanKeyword.replace('_escort_', '_partner_'), // sefakoy_vip_partner_2026
    cleanKeyword.replace('_vip_', '_rus_'), // sefakoy_rus_escort_2026
    `${cleanKeyword}_1`,
    `${cleanKeyword}_vip`
  ];

  for (const slug of variations) {
    // 1. Try is.gd (via HTTP with underscores)
    console.log(`📡 [IS.GD] Trying custom SEO slug: http://is.gd/${slug}`);
    try {
      const res = await axios.get(`http://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}&shorturl=${encodeURIComponent(slug)}`, {
        timeout: 5000
      });
      if (res.status === 200) {
        if (res.data.shorturl) {
          console.log(`🔥 [IS.GD SUCCESS] Registered: ${res.data.shorturl}`);
          return res.data.shorturl;
        } else {
          console.log(`   └─ is.gd response error: ${JSON.stringify(res.data)}`);
        }
      }
    } catch (err) {
      console.log(`   └─ is.gd connection error: ${err.message}`);
    }

    // 2. Try v.gd (via HTTP with underscores)
    console.log(`📡 [V.GD] Trying custom SEO slug: http://v.gd/${slug}`);
    try {
      const res = await axios.get(`http://v.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}&shorturl=${encodeURIComponent(slug)}`, {
        timeout: 5000
      });
      if (res.status === 200) {
        if (res.data.shorturl) {
          console.log(`🔥 [V.GD SUCCESS] Registered: ${res.data.shorturl}`);
          return res.data.shorturl;
        } else {
          console.log(`   └─ v.gd response error: ${JSON.stringify(res.data)}`);
        }
      }
    } catch (err) {
      console.log(`   └─ v.gd connection error: ${err.message}`);
    }
  }

  // Generic fallback if all custom slugs are taken
  try {
    const res = await axios.get(`http://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`, {
      timeout: 5000
    });
    if (res.status === 200) {
      if (res.data.shorturl) {
        console.log(`✅ [IS.GD FALLBACK] Yielded random: ${res.data.shorturl}`);
        return res.data.shorturl;
      } else {
        console.log(`   └─ Generic fallback response error: ${JSON.stringify(res.data)}`);
      }
    }
  } catch (err) {
    console.log(`   └─ Generic HTTP fallback connection error: ${err.message}`);
  }

  return longUrl;
}

async function run() {
  console.log('🚀 [GOD MODE] High-Performance SEO Shortener Starting...');
  const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  
  // Adding premium emojis and icons to Telegram Title for higher CTR and better visual tracking
  let reportMessage = `🔥 <b>🏆 HYDRA SITES SUPREME BACKLINK RAPORU (v12.0) 🏆</b> 🔥\n`;
  reportMessage += `🕒 Tarih: <code>${timestamp}</code>\n\n`;

  const results = [];

  for (const item of googleSites) {
    console.log(`\n──────────────────────────────────────────`);
    console.log(`🎯 TARGET: ${item.url}`);
    
    let shortUrl = "";
    try {
      shortUrl = await shortenWithSeoFallback(item.url, item.keyword);
      reportMessage += `🎯 <a href="${shortUrl}">${shortUrl}</a>\n`;
      const cleanTarget = item.url.split('/')[4] || item.url;
      reportMessage += `   └─ <i>${cleanTarget}</i>\n\n`;
      results.push({ url: item.url, shortUrl, status: 'SUCCESS' });
    } catch (error) {
      console.error(`❌ [CRITICAL] Failed to shorten: ${item.url}`);
      reportMessage += `❌ <code>${item.url}</code> (Kısaltılamadı!)\n\n`;
      results.push({ url: item.url, shortUrl: item.url, status: 'FAILED' });
    }
    
    // 1-second sleep to respect shortener API rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  reportMessage += `⚡ <i>Hydra Network - Auto Reporting Engine</i>`;

  console.log('\n📲 Sending Telegram Report...');
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
      console.log('🏆 Telegram notification sent successfully!');
    }
  } catch (tgErr) {
    console.error('⚠️ Telegram notification failed:', tgErr.message);
  }

  console.log('\n🏁 Process complete. Results:');
  console.table(results);
}

run();
