import https from 'https';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { DOMAIN_MATRIX, API_HQ_DOMAIN } from '../config/domains';

dotenv.config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramAlert(message: string) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("⚠️ [FAILOVER] Telegram credentials missing. Skipping alert.");
    return;
  }
  const postData = JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'HTML',
    disable_web_page_preview: true
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve(true));
    });
    req.on('error', () => resolve(false));
    req.write(postData);
    req.end();
  });
}

function checkDomainStatus(host: string): Promise<number> {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = https.request({
      hostname: host,
      port: 443,
      path: '/',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 6000
    }, (res) => {
      resolve(res.statusCode || 500);
    });

    req.on('error', () => {
      resolve(500); // Connection error / Down
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(408); // Timeout
    });

    req.end();
  });
}

async function runFailover() {
  console.log("🕵️‍♂️ [FAILOVER] Commencing health audit on Hydra Domain Matrix...");
  
  const moneySites = DOMAIN_MATRIX.filter(d => d.role === 'MONEY_SITE');
  const activeMoneySites: string[] = [];
  const deadMoneySites: string[] = [];

  for (const site of moneySites) {
    console.log(`📡 Checking Money Site: ${site.host}...`);
    const status = await checkDomainStatus(site.host);
    
    // Status 200 to 399 are considered active/working
    if (status >= 200 && status < 400) {
      console.log(`🟢 [ACTIVE] ${site.host} (Status: ${status})`);
      activeMoneySites.push(site.host);
    } else {
      console.warn(`🔴 [DOWN] ${site.host} (Status: ${status})`);
      deadMoneySites.push(site.host);
    }
  }

  // Check if current API_HQ_DOMAIN host is down
  let isCurrentHqDown = false;
  try {
    const hqHost = new URL(API_HQ_DOMAIN).hostname;
    isCurrentHqDown = deadMoneySites.includes(hqHost);
  } catch (e) {
    isCurrentHqDown = true;
  }

  if (isCurrentHqDown) {
    console.log("🚨 [FAILOVER ALERT] Primary Redirect HQ is DOWN. Initiating automatic backup redirection swap...");
    
    // Pick the next available active money site
    const backupHost = activeMoneySites.find(host => host !== 'istanbulescort.blog');
    
    if (backupHost) {
      const backupUrl = `https://${backupHost}/amp`;
      console.log(`🔄 [FAILOVER ACTION] Switching API_HQ_DOMAIN to backup: ${backupUrl}`);

      // Modify config/domains.ts to reflect the new target
      const configPath = path.join(process.cwd(), 'config', 'domains.ts');
      let configContent = fs.readFileSync(configPath, 'utf8');
      
      const targetString = `export const API_HQ_DOMAIN = '${API_HQ_DOMAIN}';`;
      const replacementString = `export const API_HQ_DOMAIN = '${backupUrl}';`;
      
      if (configContent.includes(targetString)) {
        configContent = configContent.replace(targetString, replacementString);
        fs.writeFileSync(configPath, configContent);
        console.log("✅ [FAILOVER SUCCESS] config/domains.ts updated successfully.");
        
        // Alert Telegram
        const alertMsg = 
          `🚨 <b>[HYDRA ALERT: FAILOVER ACTIVATED]</b>\n` +
          `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n` +
          `⚠️ <b>Ana Portal Çöktü:</b> <code>${API_HQ_DOMAIN}</code>\n` +
          `🔄 <b>Yedek Devreye Alındı:</b> <code>${backupUrl}</code>\n` +
          `💻 <b>Durum:</b> config/domains.ts dinamik olarak güncellendi.\n` +
          `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n` +
          `<i>#SovereignHydra #FailoverAutomated #ZeroDowntime</i>`;
        
        await sendTelegramAlert(alertMsg);
      } else {
        console.warn("⚠️ Could not locate the API_HQ_DOMAIN declaration in config/domains.ts for exact replacement.");
      }
    } else {
      console.error("❌ [CRITICAL] No active backup money sites available for failover!");
      await sendTelegramAlert(
        `🚨 <b>[CRITICAL FAILURE: NO ACTIVE MIRRORS]</b>\n` +
        `Ana portal ve tüm yedek money siteleri çökmüş durumda! Derhal müdahale edin.`
      );
    }
  } else {
    console.log("✅ [SUCCESS] Primary Redirect HQ is healthy. No failover actions required.");
    if (deadMoneySites.length > 0) {
      await sendTelegramAlert(
        `⚠️ <b>[HYDRA UYARI: HASARLI DOMAİNLER]</b>\n` +
        `Bazı yedek money siteleri çevrimdışı:\n` +
        deadMoneySites.map(h => `- <code>${h}</code>`).join('\n')
      );
    }
  }
}

runFailover().catch(console.error);
