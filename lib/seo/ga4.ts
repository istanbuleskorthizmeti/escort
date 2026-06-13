
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { TelegramService } from '../crm/telegram';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 🧛‍♂️ HYDRA GA4 INTELLIGENCE
 * Fetches real-time organic traffic data from Google Analytics 4.
 */


import fs from 'fs';
import path from 'path';

export class GA4Service {
  private static propertyId = process.env.GOOGLE_GA4_PROPERTY_ID || process.env.GA4_PROPERTY_ID || 'PROPERTIES_ID_MISSING';

  static async sendRealtimeReport() {
    console.log("🛰️ [GA4] Fetching Real-time Traffic Data...");
    
    const rootDir = process.cwd();
    let files: string[] = [];
    try {
      files = fs.readdirSync(rootDir);
    } catch (fsErr: any) {
      console.error("❌ [GA4] Failed to read root directory for key files:", fsErr.message);
      return;
    }

    const keyFiles = files.filter(f => f.endsWith('.json') && (
      f.startsWith('google-key') || 
      f.startsWith('hydra-gcp-key') || 
      f.startsWith('strong-return-key')
    ));

    // Sort to prioritize google-key.json, then others
    keyFiles.sort((a, b) => {
      if (a === 'google-key.json') return -1;
      if (b === 'google-key.json') return 1;
      return 0;
    });

    if (keyFiles.length === 0) {
      console.error("❌ [GA4] No service account key files found in root directory.");
      return;
    }

    let success = false;
    for (const keyFile of keyFiles) {
      try {
        console.log(`🔐 [GA4] Attempting authentication with key: ${keyFile}`);
        const analyticsDataClient = new BetaAnalyticsDataClient({
          keyFilename: path.join(rootDir, keyFile)
        });

        const [response] = await analyticsDataClient.runRealtimeReport({
          property: `properties/${this.propertyId}`,
          dimensions: [{ name: 'city' }],
          metrics: [{ name: 'activeUsers' }],
        });

        let totalUsers = 0;
        let cityBreakdown = "";

        interface GA4Row {
          metricValues?: Array<{ value?: string | null }> | null;
          dimensionValues?: Array<{ value?: string | null }> | null;
        }

        response.rows?.forEach((row: GA4Row) => {
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
🔑 <b>Auth Key:</b> ${keyFile}
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
${cityBreakdown}
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🧛‍♂️ <i>Gerçek kullanıcılar şu an vitrinleri inceliyor.</i>
          `.trim());
        }

        console.log(`✅ [GA4] Real-time traffic retrieved successfully using key: ${keyFile}. Active users: ${totalUsers}`);
        success = true;
        break; // Stop rotation on first successful execution
      } catch (err: any) {
        console.warn(`⚠️ [GA4] Key ${keyFile} failed:`, err.message);
      }
    }

    if (!success) {
      console.error("❌ [GA4] All service account keys failed to retrieve GA4 property data.");
    }
  }
}
