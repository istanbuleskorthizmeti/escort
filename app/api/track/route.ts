import { NextRequest, NextResponse } from "next/server";
import { sendTelegramReport, formatReportMessage } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const host = req.headers.get('host') || 'unknown';
    
    // Format the intelligence report
    const message = formatReportMessage('REDIRECT', {
      host: host,
      pathname: data.profileName || 'General Vitrin',
      target: 'WhatsApp'
    });

    // Send to DRKCNAY War Room
    await sendTelegramReport(message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
