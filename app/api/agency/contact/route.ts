import { NextResponse } from 'next/server';

/**
 * 🏴‍☠️ DORUKCAN AY - OFFSHORE SEO AGENCY API
 * Handles incoming inquiries for PBN rental, Maps verification, and Black Hat SEO.
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact, service, message } = body;

    if (!contact || !service) {
      return NextResponse.json(
        { error: "İletişim bilgisi ve hizmet türü zorunludur." },
        { status: 400 }
      );
    }

    // Prepare Telegram Notification Payload
    const telegramMessage = `
🚨 *YENİ OFFSHORE SEO SİPARİŞİ* 🚨
👑 *Marka:* DorukcanAY Elite SEO
-----------------------------------
👤 *Müşteri:* ${name || 'Belirtilmedi'}
📞 *İletişim:* ${contact}
💼 *Hizmet:* ${service}
📝 *Mesaj:* ${message || 'Yok'}
    `;

    // Fire-and-forget to Telegram (replace with actual bot logic later)
    // fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, { ... })
    console.log("[DORUKCAN-AY] Sipariş Alındı:", telegramMessage);

    return NextResponse.json({
      success: true,
      message: "Talebiniz elit ekibimize ulaştı. 24 saat içinde gizlilik prensipleri çerçevesinde dönüş yapılacaktır.",
      brand: "DorukcanAY Elite"
    });

  } catch (error) {
    console.error("[DORUKCAN-AY] API Error:", error);
    return NextResponse.json(
      { error: "Sistem hatası. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
}
