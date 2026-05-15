import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TelegramService } from '@/lib/crm/telegram';
import { encrypt } from '@/lib/crm/encryption';
import { isValidTelegramWebhook } from '@/lib/webhook-auth';


/**
 * DRKCNAY CRM: TELEGRAM WEBHOOK
 * Handles Callback Queries and Operational Authority.
 */
export async function POST(request: Request) {
  try {
    if (!isValidTelegramWebhook(request)) {
      return NextResponse.json({ ok: false, error: 'Unauthorized webhook request' }, { status: 401 });
    }

    const payload = await request.json();

    // 1. Handle Callback Queries (Button Clicks)
    if (payload.callback_query) {
      const { id: queryId, from, data, message } = payload.callback_query;
      const [action, leadId] = data.split('_');
      
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead) return NextResponse.json({ ok: true });

      // Authority Check: Only the claimer can advance (except for the initial claim)
      if (lead.claimerId && lead.claimerId !== from.id.toString() && action !== 'claim') {
        // Not authorized
        return NextResponse.json({ ok: true });
      }

      let newStatus = lead.status;
      let logAction = '';

      switch (action) {
        case 'claim':
          if (lead.status !== 'PENDING') break;
          newStatus = 'CLAIMED';
          await prisma.lead.update({
            where: { id: leadId },
            data: { 
              status: 'CLAIMED',
              claimerId: from.id.toString(),
              claimerName: from.username || from.first_name
            }
          });
          logAction = 'CLAIMED';
          break;

        case 'loc': // loc_sent
          newStatus = 'LOCATION_SENT';
          logAction = 'LOCATION_SENT';
          break;

        case 'in': // in_session
          newStatus = 'IN_SESSION';
          logAction = 'IN_SESSION';
          break;

        case 'payment':
          newStatus = 'PAYMENT_RECEIVED';
          logAction = 'PAYMENT_RECEIVED';
          break;

        case 'complete':
          newStatus = 'COMPLETED';
          logAction = 'COMPLETED';
          // Here we would ideally ask for price. For now, we transition.
          break;

        case 'cancel':
          newStatus = 'CANCELLED';
          logAction = 'CANCELLED';
          break;
      }

      if (newStatus !== lead.status) {
        const updatedLead = await prisma.$transaction(async (tx: any) => {
          const leadUpdate = await tx.lead.update({
            where: { id: leadId },
            data: { status: newStatus as any }
          });

          await tx.leadLog.create({
            data: {
              leadId,
              action: logAction,
              adminId: from.id.toString(),
              details: encrypt(`${logAction} by ${from.username || from.first_name} at ${new Date().toISOString()}`)
            }
          });

          return leadUpdate;
        });

        // Update Telegram Message
        await TelegramService.updateLeadStatus(message.message_id, {
          id: updatedLead.id,
          cityName: updatedLead.cityName,
          districtName: updatedLead.districtName,
          category: updatedLead.category,
          status: updatedLead.status,
          claimerName: updatedLead.claimerName,
          paymentAmount: updatedLead.paymentAmount
        });
      }
    }

    // 2. Handle Text Messages (e.g. Price input)
    if (payload.message && payload.message.text) {
      const text = payload.message.text;
      const fromId = payload.message.from.id.toString();

      // Simple implementation: If user sends a number and has an active lead in PAYMENT_RECEIVED
      if (!isNaN(parseFloat(text))) {
        const activeLead = await prisma.lead.findFirst({
          where: { 
            claimerId: fromId,
            status: 'PAYMENT_RECEIVED'
          },
          orderBy: { updatedAt: 'desc' }
        });

        if (activeLead) {
          const amount = parseFloat(text);
          await prisma.$transaction([
            prisma.lead.update({
              where: { id: activeLead.id },
              data: { 
                paymentAmount: amount,
                status: 'COMPLETED'
              }
            }),
            prisma.leadLog.create({
              data: {
                leadId: activeLead.id,
                action: 'PRICE_RECORDED',
                adminId: fromId,
                details: encrypt(`Payment of ${amount} TL recorded.`)
              }
            })
          ]);

          // Update message to COMPLETED
          // Note: We'd need to track the message_id in the DB to update it here.
          // For now, we skip or the user can see it in the panel.
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
