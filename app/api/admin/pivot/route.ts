import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { requireAdminSession } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    const filePath = path.join(process.cwd(), 'scripts/proposed_updates.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: true, proposals: [] });
    }
    const proposals = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return NextResponse.json({ success: true, proposals });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}

export async function POST(req: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  try {
    const { action, url } = await req.json();

    if (action === 'analyze') {
      const scriptPath = path.join(process.cwd(), 'scripts/auto_pivot.mjs');
      
      // Run the script in the background
      exec(`node ${scriptPath}`, (error, stdout) => {
        if (error) console.error(`Auto-Pivot Error: ${error}`);
        console.log(`Auto-Pivot Output: ${stdout}`);
      });

      return NextResponse.json({ success: true, message: "Analiz işlemi başlatıldı." });
    }

    if (action === 'approve') {
      const filePath = path.join(process.cwd(), 'scripts/proposed_updates.json');
      let proposals = [];
      if (fs.existsSync(filePath)) {
        proposals = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }

      const updatedProposals = proposals.map((p: { url: string; status: string }) => 
        p.url === url ? { ...p, status: 'approved' } : p
      );

      fs.writeFileSync(filePath, JSON.stringify(updatedProposals, null, 2));
      
      // TRIGGER RE-INDEXING (Fast Re-index)
      // This would normally call the indexing API
      
      return NextResponse.json({ success: true, message: "Güncelleme onaylandı ve yayına hazır." });
    }

    return NextResponse.json({ success: false, error: "Geçersiz işlem" });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}
