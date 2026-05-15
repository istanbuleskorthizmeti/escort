import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTelegramReport } from '@/lib/telegram';

/**
 * 📲 WHATSAPP REDIRECT HUB (VIP Elite v4.0)
 * Logs every lead attempt and sends instant Telegram notifications.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log("🟢 [WHATSAPP-HUB] Lead hit detected...");
  const host = request.headers.get('host') || 'DRKCNAY VIP';
  const referer = request.headers.get('referer') || 'Direct';
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const city = request.headers.get('x-vercel-ip-city') || 'Bilinmiyor';

  // 1. 🔥 GHOST INTEL: Telegram Raporlama (Real-time Lead Capture)
  const report = `
🔥 <b>YENİ WHATSAPP LEAD TIKLAMASI</b>
━━━━━━━━━━━━━━━━━━━━
📍 <b>Kaynak:</b> <code>${host}</code>
🔍 <b>Referer:</b> <code>${referer}</code>
🏙️ <b>Konum:</b> <code>${city}</code>
🌐 <b>IP:</b> <code>${ip}</code>
━━━━━━━━━━━━━━━━━━━━
  `;
  
  // 🛡️ CRITICAL: Await the report to ensure delivery before redirect terminates the process
  console.log(`📡 [WHATSAPP] Sending Telegram report for host: ${host}`);
  await sendTelegramReport(report).catch((err: any) => {
    console.error("❌ [WHATSAPP] Telegram Delivery Failed:", err);
  });

  // 2. 📊 DB LOGGING
  prisma.whatsAppClick.create({
    data: {
      ip,
      referer,
      city,
    }
  }).catch((err: any) => console.error('[WHATSAPP] DB Logging failed:', err));

  const text = encodeURIComponent(`Merhaba, ${host} üzerinden ulaşıyorum. Bilgi almak istiyorum.`);
  const whatsappLink = `https://wa.me/905520949245?text=${text}`;
  
  return NextResponse.redirect(whatsappLink, 307);
}
