
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { TelegramService } from '../crm/telegram';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 🧛‍♂️ HYDRA GA4 INTELLIGENCE
 * Fetches real-time organic traffic data from Google Analytics 4.
 */

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: 'google-key.json', // Google API anahtarın burada olmalı
});

export class GA4Service {
  private static propertyId = process.env.GA4_PROPERTY_ID || 'PROPERTIES_ID_MISSING';

  static async sendRealtimeReport() {
    console.log("🛰️ [GA4] Fetching Real-time Traffic Data...");
    
    try {
      const [response] = await analyticsDataClient.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        dimensions: [{ name: 'city' }],
        metrics: [{ name: 'activeUsers' }],
      });

      let totalUsers = 0;
      let cityBreakdown = "";

      response.rows?.forEach(row => {
        const users = parseInt(row.metricValues?.[0]?.value || '0');
        const city = row.dimensionValues?.[0]?.value || 'Bilinmiyor';
        totalUsers += users;
        cityBreakdown += `📍 ${city}: <b>${users}</b> kişi\n`;
      });

      if (totalUsers > 0) {
        await TelegramService.sendMessage(`
🔥 <b>ANLIK GERÇEK TRAFİK RAPORU (GA4)</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
👥 <b>Toplam Aktif Kullanıcı:</b> ${totalUsers}
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
${cityBreakdown}
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🧛‍♂️ <i>Gerçek kullanıcılar şu an vitrinleri inceliyor.</i>
        `.trim());
      }
    } catch (err: any) {
      console.error("❌ [GA4] Error:", err.message);
    }
  }
}
