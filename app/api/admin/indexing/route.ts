import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { requireAdminSession } from '@/lib/admin-auth';

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    const stateFile = path.join(process.cwd(), 'scripts/indexed-urls.json');
    let indexedCount = 0;
    if (fs.existsSync(stateFile)) {
      const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
      indexedCount = state.length;
    }

    const keysDir = process.cwd();
    const keys = fs.readdirSync(keysDir).filter(f => f.startsWith('google-key') && f.endsWith('.json'));

    return NextResponse.json({
      success: true,
      stats: {
        indexed: indexedCount,
        keys: keys.length,
        quotaTotal: keys.length * 200
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}

export async function POST(req: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    const { action } = await req.json();

    if (action === 'trigger_index') {
      const scriptPath = path.join(process.cwd(), 'scripts/google-indexer.js');
      
      // Run as background process
      exec(`node ${scriptPath}`, (error, stdout, stderr) => {
        console.log('Indexing started via Admin Hub');
        if (error) console.error(`Exec Error: ${error}`);
      });

      return NextResponse.json({ success: true, message: "İndeksleme işlemi arka planda başlatıldı." });
    }

    return NextResponse.json({ success: false, error: "Geçersiz işlem" });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}
