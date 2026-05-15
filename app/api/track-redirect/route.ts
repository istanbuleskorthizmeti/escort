import { NextResponse } from 'next/server';
import { bot } from '@/lib/crm/bot-instance';

const CHAT_ID = "-1003961137983"; // Management Group

export async function POST(req: Request) {
    try {
        const { domain, slug, title, type } = await req.json();
        const ip = req.headers.get('x-forwarded-for') || 'unknown';

        let message = '';
        if (type === 'LEAD_CLICK') {
            message = `🔥 <b>YENİ WHATSAPP LEAD!</b>\n\n` +
                      `🌐 <b>Domain:</b> ${domain}\n` +
                      `📍 <b>Konum:</b> ${slug}\n` +
                      `📱 <b>Hedef:</b> WhatsApp (Tıklandı)\n` +
                      `🔍 <b>IP:</b> ${ip}\n\n` +
                      `⚡ <i>Müşteri bağlanmak için tıkladı!</i>`;
        } else if (type === 'SESSION_START') {
            const referrer = req.headers.get('referer') || 'Doğrudan';
            const userAgent = req.headers.get('user-agent') || 'Bilinmiyor';
            
            message = `👤 <b>YENİ ZİYARETÇİ</b>\n\n` +
                      `🌐 <b>Domain:</b> ${domain}\n` +
                      `📍 <b>Sayfa:</b> ${slug}\n` +
                      `🔗 <b>Kaynak:</b> ${referrer}\n` +
                      `🔍 <b>IP:</b> ${ip}\n` +
                      `📱 <b>Cihaz:</b> ${userAgent.slice(0, 100)}...\n\n` +
                      `🕒 <i>Müşteri şu an sitede geziniyor...</i>`;
        } else {
            message = `🚀 <b>YENİ YÖNLENDİRME!</b>\n\n` +
                      `🌐 <b>Domain:</b> ${domain}\n` +
                      `📍 <b>Şube/İlçe:</b> ${title || slug}\n` +
                      `📱 <b>Hedef:</b> WhatsApp\n\n` +
                      `⚡ <i>Müşteri yönlendiriliyor...</i>`;
        }

        // 🛡️ Fail-safe notification
        if (bot) {
            bot.telegram.sendMessage(CHAT_ID, message, { parse_mode: 'HTML' }).catch(() => {});
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Tracking Error (Handled):', error);
        // Still return success to prevent frontend crash
        return NextResponse.json({ success: true, warning: 'Notification failed' });
    }
}
