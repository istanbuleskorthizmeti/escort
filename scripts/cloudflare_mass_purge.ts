import https from 'https';
import fs from 'fs';
import path from 'path';

// Parse .env manually to avoid dependency issues
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return {};
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env: Record<string, string> = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      let key = match[1].trim();
      let val = match[2].trim();
      // Remove quotes if present
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      env[key] = val;
    }
  });
  return env;
}

const env = loadEnv();
const CF_TOKEN = env['CF_API_TOKEN'] || 'cfat_JwtaN2nqkC7QxGItIaAbu2nA6TyojAqHS7DWfvpse525d170';
const TG_TOKEN = env['TELEGRAM_BOT_TOKEN'] || '8656705130:AAFJr9QsnYASOQgIoAEEw_V8EzobjXH7nBc';
const TG_CHAT_ID = env['TELEGRAM_CHAT_ID'] || '-1003961137983';

async function apiCall(endpoint: string, method = 'GET', body: any = null): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.cloudflare.com',
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Bearer ${CF_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function sendTelegramMessage(text: string) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${TG_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.write(JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    }));
    req.end();
  });
}

async function run() {
  console.log('🌀 [CLOUDFLARE] Connecting with Scoped Token and fetching active zones...');
  
  try {
    const zonesRes = await apiCall('/client/v4/zones?per_page=100');
    if (!zonesRes.success) {
      console.error('❌ Cloudflare API Error:', JSON.stringify(zonesRes, null, 2));
      return;
    }
    
    const zones = zonesRes.result || [];
    console.log(`📡 Found ${zones.length} active domains under the account.`);
    
    if (zones.length === 0) {
      console.log('⚠️ No active zones found to purge.');
      return;
    }
    
    let successCount = 0;
    let authErrorDetected = false;
    const purgedDomains: string[] = [];
    
    for (const zone of zones) {
      console.log(`🧹 Purging cache for: ${zone.name} (Zone ID: ${zone.id})...`);
      const purgeRes = await apiCall(`/client/v4/zones/${zone.id}/purge_cache`, 'POST', { purge_everything: true });
      if (purgeRes.success) {
        console.log(`✅ Cache purged successfully for ${zone.name}`);
        purgedDomains.push(zone.name);
        successCount++;
      } else {
        console.error(`❌ Failed to purge cache for ${zone.name}:`, JSON.stringify(purgeRes.errors, null, 2));
        if (purgeRes.errors && purgeRes.errors.some((e: any) => e.code === 10000)) {
          authErrorDetected = true;
        }
      }
    }
    
    if (authErrorDetected) {
      console.log('\n⚠️  [DIAGNOSTIC] Authentication error (10000) detected on Purge Cache.');
      console.log('This means your Scoped API Token has DNS Edit permissions but LACKS "Zone - Cache Purge - Edit" permission.');
      console.log('Please edit the API Token on Cloudflare Profile dashboard and add "Zone - Cache Purge - Edit" permission.');
    }
    
    if (successCount > 0) {
      const timestamp = new Date().toLocaleString('tr-TR');
      const domainListHtml = purgedDomains.map(d => `• <code>${d}</code>`).join('\n');
      
      const reportHtml = `🧹 <b>[CLOUDFLARE MASS CACHE PURGE]</b>\n\n` +
                         `🔥 <b>Temizlenen Alan Adı Sayısı:</b> <code>${successCount} / ${zones.length}</code>\n` +
                         `⚡ <b>Önbellek Durumu:</b> Sıfırlandı\n` +
                         `⏰ <b>Zaman:</b> <code>${timestamp}</code>\n\n` +
                         `🌐 <b>Sıfırlanan Alan Adları:</b>\n${domainListHtml}\n\n` +
                         `<i>#Cloudflare #CachePurge #GodMode</i>`;
                         
      await sendTelegramMessage(reportHtml);
    }
    
    console.log(`\n🏁 Operation Completed. Successful purges: ${successCount}/${zones.length}`);
  } catch (err: any) {
    console.error('💥 Fatal error during Cloudflare Mass Purge:', err.message || err);
  }
}

run();
