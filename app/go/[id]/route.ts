import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { sendTelegramReport } from '../../../lib/telegram';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(request.url);
  const host = request.headers.get('host') || 'unknown';
  const referer = request.headers.get('referer') || 'Direct';
  const ua = request.headers.get('user-agent') || 'unknown';
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const city = request.headers.get('x-vercel-ip-city') || 'Bilinmiyor';
  const country = request.headers.get('x-vercel-ip-country') || 'TR';

  if (!id) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const shortLink = await prisma.shortLink.findUnique({
      where: { id }
    });

    if (!shortLink) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 🕵️ GHOST INTEL: Telegram Raporlama
    const report = `
🔥 *YENİ WHATSAPP TIKLAMASI*
━━━━━━━━━━━━━━━━━━━━
📍 *Kaynak:* \`${host}\`
🎯 *Hedef:* \`${shortLink.targetUrl}\`
🏙️ *Konum:* ${city}, ${country}
🔍 *Kelime/Referer:* \`${referer}\`
📱 *Cihaz:* \`${ua}\`
🌐 *IP:* \`${ip}\`
━━━━━━━━━━━━━━━━━━━━
    `;
    
    // Fire and forget reporting
    sendTelegramReport(report).catch(console.error);

    // Click sayacını güncelle
    prisma.shortLink.update({
      where: { id },
      data: { clicks: { increment: 1 } }
    }).catch((err: any) => console.error('[SHORTLINK] Update failed:', err));

    return NextResponse.redirect(shortLink.targetUrl, { status: 302 });

  } catch (error) {
    console.error('[SHORTLINK] Route Error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
