import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TelegramService } from '@/lib/crm/telegram';
import { encrypt } from '@/lib/crm/encryption';
import crypto from 'crypto';


/**
 * DRKCNAY CRM: LEAD SUBMISSION
 * Capture leads from Concierge AI and notify Telegram.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { cityName, districtName, category, details, currentUrl, referrer, utmSource, utmTerm } = data;

    // Get IP, Browser and Referer
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Bilinmiyor';
    const userAgent = request.headers.get('user-agent') || 'Bilinmiyor';
    const sourceUrl = currentUrl || request.headers.get('referer') || 'Bilinmiyor';
    // DRKCNAY Intent Intelligence
    const intentData = {
      trueReferrer: referrer || sourceUrl,
      utmTerm: utmTerm || 'Bilinmiyor',
      utmSource: utmSource || 'Bilinmiyor'
    };

    const idempotencyBase =
      request.headers.get('x-idempotency-key') ||
      `${cityName}|${districtName}|${category}|${ipAddress}|${userAgent}`;
    const externalRef = crypto.createHash('sha256').update(idempotencyBase).digest('hex');

    const recentLead = await prisma.lead.findFirst({
      where: {
        externalRef,
        createdAt: { gt: new Date(Date.now() - 2 * 60 * 1000) }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (recentLead) {
      return NextResponse.json({
        success: true,
        leadId: recentLead.id,
        deduplicated: true,
        message: 'DRKCNAY CRM: Lead already captured recently.'
      });
    }

    // 1. Create Lead + log atomically
    const lead = await prisma.$transaction(async (tx: any) => {
      const createdLead = await tx.lead.create({
        data: {
          cityName,
          districtName,
          category,
          details: details ? encrypt(details) : null,
          status: 'PENDING',
          externalRef
        }
      });

      await tx.leadLog.create({
        data: {
          leadId: createdLead.id,
          action: 'CREATED',
          details: encrypt(`Lead initialized via Concierge AI at ${new Date().toISOString()}`)
        }
      });

      return createdLead;
    });

    // 2. Send Telegram Notification
    await TelegramService.sendNewLead({
      id: lead.id,
      cityName,
      districtName,
      category,
      status: lead.status,
      details: details ? `YÖNLENDİRME AKTİF: ${details}` : 'Doğrudan Web üzerinden',
      ipAddress,
      userAgent,
      sourceUrl: intentData.trueReferrer,
      utmTerm: intentData.utmTerm,
      utmSource: intentData.utmSource,
      currentUrl: currentUrl
    });

    // 3. Store Telegram Message ID for future edits
    // We'll update the lead with the message ID if telegram allows tracking
    // For now, we rely on the callback_query from Telegram to identify the message.
    
    return NextResponse.json({ 
      success: true, 
      leadId: lead.id,
      message: 'DRKCNAY CRM: Lead captured and delegated.' 
    });

  } catch (error) {
    console.error('CRM Submission Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
