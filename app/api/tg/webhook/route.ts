import { NextResponse } from "next/server";
import { TelegramService } from "@/lib/crm/telegram";
import { isValidTelegramWebhook } from "@/lib/webhook-auth";

export async function POST(req: Request) {
  try {
    if (!isValidTelegramWebhook(req)) {
      return NextResponse.json({ error: "Unauthorized webhook request" }, { status: 401 });
    }

    const update = await req.json();
    
    // Process update asynchronously to avoid Telegram timeouts
    TelegramService.handleUpdate(update).catch(err => {
      console.error("[TG Webhook Error]:", err);
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[TG Update Error]:", error);
    return NextResponse.json({ error: "Failed to process update" }, { status: 400 });
  }
}

// Optional: GET handler to verify accessibility
export async function GET() {
  return NextResponse.json({ status: "DRKCNAY TG Webhook Active" });
}
