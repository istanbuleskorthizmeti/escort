import { TelegramService } from '../lib/crm/telegram';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || '1_m4rqy7kxSppRB4d4EjAGeyK_VEp6YwFH0m9wN74aRI';
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
  const lookerLink = `https://lookerstudio.google.com/reporting/create?c.reportId=new&ds.ds0.connector=googleSheets&ds.ds0.spreadsheetId=${spreadsheetId}`;

  const message = `
🛡️ <b>HYDRA ENTERPRISE SYSTEM INTEGRATION REPORT</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🥷 <b>OPERATOR:</b> <code>DRKCNAY ELITE</code>
📅 <b>DATE:</b> <code>${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}</code>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

📊 <b>1. GOOGLE SEARCH CONSOLE DÖNGÜSÜ:</b>
• <b>Aktif Taranan Fleet:</b> <code>62 Domain</code>
• <b>Derin Kelime Limit:</b> <code>500 Satır / Domain</code>
• <b>Veri Boyutları:</b> <code>Query, Page, Device, Country</code>
• <b>Fırsat Kelime Algoritması:</b> <code>Sayfa 2 & 3 (Sıralama 10-25) Otomatik Ayrıştırma</code>
• 📥 <a href="${spreadsheetUrl}">MASTER GOOGLE SHEET</a>
• 📈 <a href="${lookerLink}">LOOKER STUDIO DASHBOARD</a>

⚙️ <b>2. OTOMASYON & CRON TAB:</b>
• <b>Zamanlayıcı Kurulumu:</b> <code>Aktif [Her Sabah 09:00]</code>
• <b>Log Dosyası:</b> <code>/root/esc/logs/enterprise-loop.log</code>
• <b>VM Servis Çalışma Yolu:</b> <code>/root/esc/scripts/google-enterprise-integration.ts</code>

🖥️ <b>3. AKTİF SUNUCU VE FATURA HATLARI:</b>
• <b>GCP VM (Operational Center):</b> <code>34.185.231.84</code>
• <b>Database VPS (PostgreSQL Host):</b> <code>213.232.235.181</code>
• <b>Hydra Attack / Production Server:</b> <code>187.77.111.203</code>

🌐 <b>4. CLOUDFLARE GEOLOCATION PLAN:</b>
• <b>Dağıtım Metodu:</b> <code>İstanbul PoP Uç Noktaları</code>
• <b>Maskeleme Durumu:</b> <code>Aktif [Ana IP'ler Gizlendi]</code>
• <b>Bağlantı Optimizasyonu:</b> <code>Maksimum Açılış Hızı (Türkiye Lokasyon)</code>

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🧛‍♂️ <i>All systems online. Auto-scheduler active. Command panel secured.</i>
  `.trim();

  console.log('Sending comprehensive report to Telegram...');
  await TelegramService.sendMessage(message);
  console.log('Report successfully sent.');
}

main().catch(err => {
  console.error('Failed to send report:', err);
});
