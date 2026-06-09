import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { sendTelegramReport } from '../lib/telegram';
import { DOMAIN_MATRIX } from '../config/domains';

dotenv.config();

async function runMultiDomainReport() {
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
    console.log("📡 Listing all registered Search Console properties...");
    const sitesRes = await sc.sites.list({ auth });
    const verifiedSites = (sitesRes.data.siteEntry || []).map(s => s.siteUrl).filter(Boolean) as string[];
    console.log(`✅ Found ${verifiedSites.length} verified sites in Search Console.`);

    const today = new Date();
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(today.getDate() - 10);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const startDate = formatDate(tenDaysAgo);
    const endDate = formatDate(today);

    // Get list of hosts from our domain matrix to match
    const activeHosts = Array.from(new Set(DOMAIN_MATRIX.map(d => d.host)));

    let currentReportChunk = 
      `⚔️ <b>[HYDRA GSC TEK TEK PERFORMANS RAPORU]</b>\n` +
      `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n` +
      `📅 <b>Dönem:</b> ${startDate} / ${endDate}\n` +
      `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n`;

    let matchedCount = 0;
    let chunkIndex = 1;

    for (const siteUrl of verifiedSites) {
      // Extract clean domain name from GSC siteUrl (could be 'sc-domain:domain.com' or 'https://domain.com/')
      let cleanDomain = siteUrl.replace('sc-domain:', '').replace('https://', '').replace('http://', '').replace(/\/$/, '');

      // Only report active money/satellite sites in our matrix to keep it relevant
      if (!activeHosts.some(h => cleanDomain.includes(h))) {
        continue;
      }

      console.log(`📡 Querying data for: ${siteUrl}`);
      matchedCount++;

      try {
        const queryRes = await sc.searchanalytics.query({
          auth,
          siteUrl,
          requestBody: {
            startDate,
            endDate,
            dimensions: ['query'],
            rowLimit: 3,
            searchType: 'web'
          }
        });

        // Query total stats
        const totalStatsRes = await sc.searchanalytics.query({
          auth,
          siteUrl,
          requestBody: {
            startDate,
            endDate,
            rowLimit: 1
          }
        });

        const totalRow = totalStatsRes.data.rows?.[0] || { clicks: 0, impressions: 0, position: 0 };
        const totalClicks = totalRow.clicks || 0;
        const totalImpressions = totalRow.impressions || 0;
        const avgPosition = totalRow.position ? totalRow.position.toFixed(1) : 'N/A';

        const rows = queryRes.data.rows || [];

        currentReportChunk += 
          `🌐 <b>ALAN ADI:</b> <code>${cleanDomain}</code>\n` +
          `📊 <b>Toplam Gösterim:</b> <code>${totalImpressions}</code> | <b>Tıklama:</b> <code>${totalClicks}</code>\n` +
          `📈 <b>Ortalama Konum:</b> <code>#${avgPosition}</code>\n` +
          `🎯 <b>Top Anahtar Kelimeler:</b>\n`;

        if (rows.length === 0) {
          currentReportChunk += `   • <i>Henüz gösterim/tıklama verisi birikmemiş.</i>\n`;
        } else {
          rows.forEach((row: any, idx: number) => {
            const query = row.keys?.[0] || 'Bilinmeyen';
            const pos = row.position ? row.position.toFixed(1) : '0';
            const imp = row.impressions || 0;
            currentReportChunk += `   ${idx+1}. <code>${query}</code> (Sıra: #${pos} | Gösterim: ${imp})\n`;
          });
        }
        currentReportChunk += `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n`;

      } catch (siteErr: unknown) {
        const siteErrMsg = siteErr instanceof Error ? siteErr.message : String(siteErr);
        console.error(`❌ Failed query for ${siteUrl}:`, siteErrMsg);
        currentReportChunk += 
          `🌐 <b>ALAN ADI:</b> <code>${cleanDomain}</code>\n` +
          `❌ <i>Veri sorgulama hatası: ${siteErrMsg}</i>\n` +
          `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n`;
      }

      // Check chunk size or item count. If we have 8 sites in the current chunk, send it to avoid Telegram 4096-char limit.
      if (matchedCount % 8 === 0) {
        console.log(`📤 Sending chunk ${chunkIndex}...`);
        await sendTelegramReport(currentReportChunk + `<i>#ReportChunk-${chunkIndex}</i>`);
        chunkIndex++;
        currentReportChunk = `⚔️ <b>[HYDRA GSC TEK TEK PERFORMANS RAPORU - DEVAM]</b>\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n`;
      }

      // Anti-blocking sleep between api calls
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Send remaining chunk
    if (matchedCount % 8 !== 0 && matchedCount > 0) {
      console.log(`📤 Sending final chunk ${chunkIndex}...`);
      await sendTelegramReport(currentReportChunk + `<i>#ReportChunk-Final #GodModeActive</i>`);
    }

    if (matchedCount === 0) {
      await sendTelegramReport(`⚪ <i>Hydra Domain Matrix ile eşleşen doğrulanmış Search Console mülkü bulunamadı.</i>`);
    }

    console.log("✅ Tüm raporlar Telegram'a başarıyla parça parça gönderildi.");

  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("❌ Multi-Domain Performance Report Failed:", errMsg);
    await sendTelegramReport(`❌ <b>[HYDRA GSC TEK TEK RAPOR HATA]</b>\nİşlem başarısız: <code>${errMsg}</code>`);
  }
}

runMultiDomainReport();
