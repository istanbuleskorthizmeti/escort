import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TelegramService } from "@/lib/crm/telegram";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.CRM_ENCRYPTION_KEY || "DRKCNAY-elite-secret-key-2026");

export async function POST(req: NextRequest) {
  try {
    const { action, code } = await req.json();

    if (action === "send") {
      // 1. Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

      // 2. Save to DB
      await prisma.adminOTP.create({
        data: {
          code: otpCode,
          expiresAt,
        },
      });

      // 3. Send to Telegram
      await TelegramService.sendMessage(`🛡️ *DRKCNAY ADMIN GİRİŞ TALEBİ*\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n🔑 GİRİŞ KODU: \`${otpCode}\`\n⏳ SÜRE: 5 Dakika\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n🚀 v6.2 Elite Access Controller`);

      return NextResponse.json({ success: true, message: "OTP sent to Telegram group." });
    }

    if (action === "verify") {
      if (!code) return NextResponse.json({ error: "Kod gerekli." }, { status: 400 });

      // 1. Find valid OTP
      const validOtp = await prisma.adminOTP.findFirst({
        where: {
          code: code,
          expiresAt: { gt: new Date() },
          isUsed: false,
        },
      });

      if (!validOtp) {
        return NextResponse.json({ error: "Geçersiz veya süresi dolmuş kod." }, { status: 401 });
      }

      // 2. Mark as used
      await prisma.adminOTP.update({
        where: { id: validOtp.id },
        data: { isUsed: true },
      });

      // 3. Create Admin Session
      const response = NextResponse.json({ success: true });
      const { setAdminSessionCookie } = require("@/lib/admin-auth");
      setAdminSessionCookie(response);

      return response;
    }

    return NextResponse.json({ error: "Geçersiz işlem." }, { status: 400 });
  } catch (error: any) {
    console.error("OTP API Error:", error.message);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
