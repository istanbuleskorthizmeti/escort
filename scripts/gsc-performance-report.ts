import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { sendTelegramReport } from '../lib/telegram';

dotenv.config();

async function runGSCPerformance() {
  console.log("🔒 [AUTH] Initializing Google Auth for Search Console...");
  const keyPath = path.join(process.cwd(), 'google-key.json');
  if (!fs.existsSync(keyPath)) {
    console.error("❌ google-key.json key file not found!");
    process.exit(1);
  }

  const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  const auth = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly', 'https://www.googleapis.com/auth/webmasters'],
  });

  const sc = google.searchconsole('v1');

  try {
    const today = new Date();
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(today.getDate() - 10);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const startDate = formatDate(tenDaysAgo);
    const endDate = formatDate(today);

    const siteUrl = 'sc-domain:istanbulescort.blog';

    console.log(`📡 Querying GSC Search Performance for ${siteUrl} (${startDate} to ${endDate})...`);
    
    const res = await sc.searchanalytics.query({
      auth,
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 100,
        searchType: 'web'
      }
    });

    const rows = res.data.rows || [];
    console.log(`✅ Retrieved ${rows.length} performance queries.`);
    console.log("📝 Queries list:");
    rows.forEach((r: any, i: number) => {
      console.log(`  [${i+1}] Query: "${r.keys?.[0]}" - Clicks: ${r.clicks} - Imp: ${r.impressions} - Pos: ${r.position?.toFixed(1)}`);
    });
    fs.writeFileSync('GSC_FULL_QUERIES.json', JSON.stringify(rows, null, 2));

    let telegramMsg = 
      `📈 <b>[HYDRA GSC GERÇEK PERFORMANS RAPORU]</b>\n` +
      `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n` +
      `🌍 <b>Domain:</b> <code>istanbulescort.blog</code>\n` +
      `📅 <b>Dönem:</b> ${startDate} / ${endDate}\n` +
      `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n` +
      `🎯 <b>EN YÜKSEK TRAFİK / HİT ALAN ANAHTAR KELİMELER:</b>\n\n`;

    if (rows.length === 0) {
      telegramMsg += `⚪ <i>GSC'de henüz organik gösterim verisi birikmemiş veya mülk doğrulaması yeni yapılmış.</i>\n`;
    } else {
      rows.forEach((row: any, idx: number) => {
        const query = row.keys?.[0] || 'Bilinmeyen';
        const clicks = row.clicks || 0;
        const impressions = row.impressions || 0;
        const position = row.position ? row.position.toFixed(1) : '0';
        const ctr = row.ctr ? (row.ctr * 100).toFixed(1) : '0';

        let medal = '📈';
        if (idx === 0) medal = '🥇';
        else if (idx === 1) medal = '🥈';
        else if (idx === 2) medal = '🥉';

        telegramMsg += `${medal} <b>${query}</b>\n` +
                      `   • <b>Pozisyon:</b> #${position} | <b>CTR:</b> %${ctr}\n` +
                      `   • <b>Gösterim:</b> ${impressions} | <b>Tıklama:</b> ${clicks}\n\n`;
      });
    }

    telegramMsg += 
      `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n` +
      `💡 <i>Not: Basit HTTP tarayıcıları Google CAPTCHA engeline takıldığı için sıralamaları göremiyordu. Bu rapor, doğrudan Google Search Console API entegrasyonuyla çekilen %100 doğrulanmış, manipüle edilemez verilerdir.</i>\n\n` +
      `<i>#RealDataOnly #AnalyticsVerified #GodModeActive</i>`;

    console.log("📤 Rapor Telegram'a gönderiliyor...");
    await sendTelegramReport(telegramMsg);
    console.log("✅ Rapor Telegram'a başarıyla gönderildi.");

  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("❌ GSC Performance Query Failed:", errMsg);
    
    // Fallback notification
    await sendTelegramReport(`❌ <b>[HYDRA GSC HATA]</b>\nVeri çekme başarısız: <code>${errMsg}</code>`);
  }
}

runGSCPerformance();
