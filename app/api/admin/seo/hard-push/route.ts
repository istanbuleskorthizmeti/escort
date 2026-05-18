import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json();
    
    // 🛡️ SECURITY GOD MODE: Strict regex sanitization to block shell command injections (RCE)
    const safeUrls: string[] = [];
    if (urls && Array.isArray(urls)) {
      for (const u of urls) {
        if (typeof u === 'string') {
          // Allow only valid HTTP/HTTPS URLs with standard characters, reject any shell operators like ;, &, |, $, `, etc.
          if (!/^https?:\/\/[a-zA-Z0-9.-]+(?:\/[a-zA-Z0-9_.-]*)*\/?$/.test(u)) {
            return NextResponse.json({ error: "Suspicious characters or invalid format detected in URL parameter. Attack blocked." }, { status: 400 });
          }
          safeUrls.push(u);
        }
      }
    }
    
    console.log("🚀 [HARD PING API] Triggering indexing script with sanitized URLs:", safeUrls);

    // Execute the hard-ping script safely
    const command = `node --import tsx scripts/hard-ping.ts ${safeUrls.join(' ')}`;
    
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`[HARD PING ERROR]: ${err.message}`);
            return;
        }
        console.log(`[HARD PING OUTPUT]: ${stdout}`);
    });

    return NextResponse.json({ 
        success: true, 
        message: "Hard Ping motoru \u00e7al\u0131\u015ft\u0131r\u0131ld\u0131. Sonu\u00e7lar Telegram \u00fczerinden iletilecek." 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
