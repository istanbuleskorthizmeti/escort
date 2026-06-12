/**
 * 🗺️ DRKCNAY ELITE: GBP VERIFICATION HELPER (v1.0)
 * Coordinates Google Business Profile locations, AnyTo GPS spoofing coords,
 * and reports verification stages directly to the Telegram Command Center.
 */
import { GBP_LOCATIONS } from '../lib/geo-data';
import { TelegramService } from '../lib/crm/telegram';
import dotenv from 'dotenv';

dotenv.config();

export interface GbpStatusReport {
  locationKey: string;
  name: string;
  coords: { lat: number; lng: number };
  status: 'Verified' | 'Processing' | 'New';
  address: string;
}

export const GbpVerificationHelper = {
  /**
   * Reports the current status of all GBP listings to Telegram
   */
  async reportAllStatus() {
    console.log("📡 [GBP-HELPER] Generating status report...");
    let message = `📍 <b>DRKCNAY ELITE: GBP VERIFICATION MATRIX</b>\n`;
    message += `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`;

    for (const [key, loc] of Object.entries(GBP_LOCATIONS)) {
      const statusIcon = loc.status === 'Verified' ? '🟢' : loc.status === 'Processing' ? '🟡' : '⚪';
      message += `📌 <b>${loc.name}</b> (<code>${key}</code>)\n`;
      message += `• Durum: ${statusIcon} <b>${loc.status}</b>\n`;
      message += `• Koordinat: <code>${loc.lat}, ${loc.lng}</code>\n`;
      message += `• Adres: <i>${loc.streetAddress || 'N/A'}</i>\n\n`;
    }

    message += `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`;
    message += `💡 <i>AnyTo ile ışınlanırken hedef koordinatı birebir kopyala.</i>`;

    await TelegramService.sendMessage(message);
    console.log("✅ [GBP-HELPER] Status report transmitted to Telegram.");
  },

  /**
   * Generates step-by-step AnyTo / GBP injection instructions for a specific key
   */
  async getAnyToInstructions(locationKey: string) {
    const loc = GBP_LOCATIONS[locationKey];
    if (!loc) {
      console.error(`❌ [GBP-HELPER] Location ${locationKey} not found!`);
      return;
    }

    const message = `
🔱 <b>DRKCNAY HYDRA: GBP IŞINLANMA PROTOKOLÜ</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🎯 <b>Hedef Konum:</b> <code>${loc.name}</code>
📍 <b>AnyTo Koordinatı:</b> <code>${loc.lat}, ${loc.lng}</code>
📮 <b>Adres:</b> <code>${loc.streetAddress}, ${loc.postalCode} ${loc.addressLocality}/${loc.addressRegion}</code>
📱 <b>Status:</b> <b>${loc.status}</b>

<b>TALİMATLAR:</b>
1️⃣ iPhone cihazınızı kabloyla bağlayıp AnyTo uygulamasını açın.
2️⃣ Sağ üstten <b>Teleport Mode</b> simgesini seçin.
3️⃣ Sol üst arama çubuğuna yukarıdaki koordinatı yapıştırın ve <b>Move</b> butonuna basın.
4️⃣ Telefonun haritasından mavi noktanın konumunu doğrulayın.
5️⃣ Wi-Fi kapatıp uçak modunu 10 saniye aç-kapat yaparak IP yenileyin.
6️⃣ Safari Gizli Sekmede kaydı tamamlayıp <b>info@dorukcanay.digital</b> adresine e-posta onayını gönderin.
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🚀 <i>Operasyon Başarıya Ulaştığında Rapor Et.</i>
    `.trim();

    await TelegramService.sendMessage(message);
    console.log(`✅ [GBP-HELPER] Instructions for ${locationKey} sent.`);
  }
};

// If run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const action = args[0] || 'report';
  const target = args[1] || 'beylikduzu';

  if (action === 'instructions') {
    GbpVerificationHelper.getAnyToInstructions(target).catch(console.error);
  } else {
    GbpVerificationHelper.reportAllStatus().catch(console.error);
  }
}
