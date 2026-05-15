import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json();
    
    // Safety check: only allow authorized admins to trigger this (handled by middleware)
    
    console.log("🚀 [HARD PING API] Triggering indexing script...");

    // Execute the hard-ping script in the background
    // We pass a few URLs for now or let the script use its defaults
    const command = `node --import tsx scripts/hard-ping.ts ${urls ? urls.join(' ') : ''}`;
    
    // We run it asynchronously and don't wait for the full finish to return a response
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
