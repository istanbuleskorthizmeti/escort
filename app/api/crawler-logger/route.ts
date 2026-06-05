import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("x-gtm-key");
    if (authHeader !== process.env.ADMIN_HQ_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ip, userAgent, pathname, method, status } = body;

    if (!ip || !pathname) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Googlebot kontrolü
    const isGooglebot = userAgent && userAgent.includes("Googlebot");

    if (isGooglebot) {
      await prisma.googlebotLog.create({
        data: {
          ip,
          userAgent,
          pathname,
          method: method || "GET",
          status: status || 200,
          timestamp: new Date()
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ [BOT-LOG-API] Error logging crawler entry:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
