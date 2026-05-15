import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { indexingService } from '@/lib/seo/indexing';
import { siteConfig } from '@/config/site';

/**
 * ⚡ YILDIRIM HAREKATI (MASS PING)
 * Forces Google Indexing API to instantly index 200 URLs at a time.
 */

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // Security Check (VIP Elite Key)
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log("⚡ [MASS_PING] Yıldırım Harekatı Başlıyor...");
    
    // Fetch top 200 non-indexed or recently updated pages
    const pages = await prisma.pageContent.findMany({
      take: 200,
      orderBy: { updatedAt: 'desc' },
      select: { slug: true }
    });

    if (pages.length === 0) {
      return NextResponse.json({ message: "Pinglenecek link bulunamadı." });
    }

    const results = { success: 0, failed: 0, errors: [] as string[] };

    // Ping Google sequentially (avoid rate limit ban hammer)
    for (const page of pages) {
      const cleanSlug = page.slug.replace(/^\//, '');
      const url = `https://${siteConfig.domain}/${cleanSlug}`;
      
      const pingResult = await indexingService.notifyUrlUpdate(url);
      
      if (pingResult.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push(url);
      }
      
      // Delay 500ms between pings
      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`⚡ [MASS_PING] Rapor: ${results.success} Başarılı, ${results.failed} Hata.`);
    return NextResponse.json({ message: "Yıldırım Harekatı Tamamlandı", results });

  } catch (error: any) {
    console.error("⚡ [MASS_PING] Kritik Hata:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
