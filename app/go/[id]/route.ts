import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { sendTelegramReport } from '../../../lib/telegram';
import { vitrinImages } from '../../../lib/vitrin-images';

export const dynamic = 'force-dynamic';

function cleanId(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rawHost = request.headers.get('host') || 'istanbulescort.blog';
  const host = rawHost.replace(/[^a-zA-Z0-9.:-]/g, '');
  const rawProto = request.headers.get('x-forwarded-proto') || 'https';
  const protocol = rawProto.toLowerCase() === 'http' ? 'http' : 'https';
  const referer = request.headers.get('referer') || 'Direct';
  const ua = request.headers.get('user-agent') || 'unknown';
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const city = request.headers.get('x-vercel-ip-city') || 'Bilinmiyor';
  const country = request.headers.get('x-vercel-ip-country') || 'TR';

  // Safe base URL calculation to prevent localhost redirect
  const isLocalHost = host.includes('localhost') || host.includes('127.0.0.1');
  const safeBase = isLocalHost ? 'https://istanbulescort.blog' : `${protocol}://${host}`;

  if (!id) {
    return NextResponse.redirect(new URL('/', safeBase));
  }

  // 🎓 High-EEAT Expert Profile Direct Redirect Interceptor
  if (id === 'linkedin-dorukcan') {
    return NextResponse.redirect('https://www.linkedin.com/in/dorukcan-ay-seo-expert-9b5961a8', { status: 302 });
  }
  if (id === 'linkedin-edanur') {
    return NextResponse.redirect('https://www.linkedin.com/in/eda-nur-life-sociology-9b8812b9', { status: 302 });
  }

  // 🕵️ Dynamically resolve model profiles to their WhatsApp numbers if missing from database
  const normalizedId = cleanId(id);
  const targetModel = vitrinImages.find(img => cleanId(img.title) === normalizedId);
  const hardcodedModels = [
    'melissa', 'aynur', 'svetlana', 'ceren', 'ayla', 'esila', 'berfin', 'dilan',
    'jinda', 'narin', 'rojin', 'zilan', 'asya', 'buse', 'cansel', 'damla',
    'elif', 'figen', 'gizem', 'hande', 'isil', 'kubra', 'leyla', 'merve'
  ];

  if (targetModel || hardcodedModels.includes(normalizedId)) {
    const modelTitle = targetModel ? targetModel.title : (id.charAt(0).toUpperCase() + id.slice(1));
    const globalPhone = process.env.GLOBAL_WHATSAPP_NUMBER;
    const targetPhone = globalPhone || (targetModel && targetModel.phone ? targetModel.phone : '905016355053');
    const finalPhone = (targetPhone === '905330892496' || targetPhone === '905016355053' || targetPhone === '447426976466' || targetPhone === '905368396114') ? '905016355053' : targetPhone;
    const whatsappUrl = `https://wa.me/${finalPhone}?text=Merhaba ${modelTitle}, görüşme için bilgi verir misin?`;
    
    const report = `
🔥 *DİNAMİK WHATSAPP TIKLAMASI (VİTRİN)*
━━━━━━━━━━━━━━━━━━━━
📍 *Kaynak:* \`${host}\`
🎯 *Model:* \`${modelTitle}\` (\`${finalPhone}\`)
🏙️ *Konum:* ${city}, ${country}
🔍 *Referer:* \`${referer}\`
📱 *Cihaz:* \`${ua}\`
🌐 *IP:* \`${ip}\`
━━━━━━━━━━━━━━━━━━━━
    `;
    sendTelegramReport(report).catch(console.error);
    
    return NextResponse.redirect(whatsappUrl, { status: 302 });
  }

  try {
    const shortLink = await prisma.shortLink.findUnique({
      where: { id }
    });

    if (!shortLink) {
      return NextResponse.redirect(new URL('/', safeBase));
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
    return NextResponse.redirect(new URL('/', safeBase));
  }
}

