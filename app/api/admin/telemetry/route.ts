import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    // 1. Fetch/Simulate API Limits
    // In a real scenario, you'd check Redis caches or exact DB counts.
    // We simulate the structure here based on the VIP Elite architecture.
    const limits = [
      {
        id: "gsc-index",
        name: "Google Indexing API",
        used: Math.floor(Math.random() * 50) + 120, // 120-170
        total: 200,
        color: "emerald"
      },
      {
        id: "omni-ai",
        name: "OmniAI Spintax Tokens",
        used: Math.floor(Math.random() * 20000) + 70000,
        total: 100000,
        color: "rose"
      },
      {
        id: "gbp-drip",
        name: "Google Maps (GBP) Submissions",
        used: fs.existsSync(path.join(process.cwd(), 'gbp_drip_log.txt')) 
                ? fs.readFileSync(path.join(process.cwd(), 'gbp_drip_log.txt'), 'utf-8').trim().split('\\n').filter(Boolean).length 
                : 0,
        total: 14, // Weekly limit max
        color: "cyan"
      },
      {
        id: "cloudflare-purge",
        name: "Cloudflare Cache Purge",
        used: Math.floor(Math.random() * 500),
        total: 2000,
        color: "amber"
      }
    ];

    // 2. Read latest telemetry logs (e.g. from gbp_drip_log.txt or indexer log)
    const logs: any[] = [];
    
    // Check GBP Logs
    const gbpPath = path.join(process.cwd(), 'gbp_drip_log.txt');
    if (fs.existsSync(gbpPath)) {
      const gbpLines = fs.readFileSync(gbpPath, 'utf8').trim().split('\\n').slice(-5);
      gbpLines.forEach(line => {
        if(line) logs.push({ type: 'GBP_SUBMIT', message: line, status: 'SUCCESS' });
      });
    }

    // Generate some mock indexing logs for the telemetry feed to demonstrate the UI
    const mockDomains = ['sefakoyescort.shop', 'besiktasescort.blog', 'kadikoyescort.fun'];
    for(let i=0; i<5; i++) {
        logs.push({
            type: 'GSC_INDEX',
            message: `Pinged: https://${mockDomains[Math.floor(Math.random()*mockDomains.length)]}/istanbul/sariyer`,
            status: Math.random() > 0.1 ? '200_OK' : 'QUOTA_EXCEEDED'
        });
    }

    return NextResponse.json({
      success: true,
      limits,
      telemetry: logs.reverse()
    });

  } catch (error) {
    console.error("Telemetry API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to load telemetry" }, { status: 500 });
  }
}
