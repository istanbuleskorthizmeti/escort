import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const files = fs.readdirSync(/*turbopackIgnore: true*/ process.cwd());
    const keyFiles = files.filter(f => f.startsWith('google-key') && f.endsWith('.json'));

    const workers = keyFiles.map(file => {
      const filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), file);
      const data = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ filePath, 'utf8'));
      
      const hasKey = data.private_key && !data.private_key.includes('PLACEHOLDER');
      
      return {
        id: file.replace('.json', '').replace('google-key-', 'W'),
        name: data.client_email.split('@')[0],
        email: data.client_email,
        status: hasKey ? "online" : "error",
        type: "Indexing/SEO",
        health: hasKey ? 100 : 0,
        file: file
      };
    });

    return NextResponse.json({ workers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
