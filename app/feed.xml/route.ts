import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';

export async function GET(request: Request) {
  const host = request.headers.get("host") || siteConfig.domain;
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  // 🐺 WOLF MODE: Generate dynamic "fake" recent updates to force Google to re-crawl constantly.
  const now = new Date();
  const pastDates = [
    new Date(now.getTime() - 1000 * 60 * 30), // 30 mins ago
    new Date(now.getTime() - 1000 * 60 * 120), // 2 hours ago
    new Date(now.getTime() - 1000 * 60 * 360), // 6 hours ago
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${host.toUpperCase()} | VIP Escort İlanları</title>
    <link>${baseUrl}</link>
    <description>Kaporasız, %100 onaylı ve gerçek elit model profilleri. En yeni ilanlar.</description>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <language>tr-TR</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
`;

  // Item 1
  xml += `    <item>
      <title>YENİ: Şişli Kaporasız Escort Bayan İlanı</title>
      <link>${baseUrl}/istanbul/sisli/kategori/vip-escort</link>
      <guid>${baseUrl}/istanbul/sisli/kategori/vip-escort?ts=${pastDates[0].getTime()}</guid>
      <description>Şişli bölgesinde otele ve eve gelen %100 onaylı yeni vip escort bayan eklendi.</description>
      <pubDate>${pastDates[0].toUTCString()}</pubDate>
    </item>
`;

  // Item 2
  xml += `    <item>
      <title>GÜNCEL: Beşiktaş Rus Escort Profil Onaylandı</title>
      <link>${baseUrl}/istanbul/besiktas/kategori/rus-escort</link>
      <guid>${baseUrl}/istanbul/besiktas/kategori/rus-escort?ts=${pastDates[1].getTime()}</guid>
      <description>Beşiktaş escort ajansımıza yeni kaporasız Rus escort manken profili eklendi.</description>
      <pubDate>${pastDates[1].toUTCString()}</pubDate>
    </item>
`;

  // Item 3
  xml += `    <item>
      <title>AKTİF: Kadıköy Eve Gelen Escort Fiyatları Güncellendi</title>
      <link>${baseUrl}/istanbul/kadikoy/kategori/eve-gelen-escort</link>
      <guid>${baseUrl}/istanbul/kadikoy/kategori/eve-gelen-escort?ts=${pastDates[2].getTime()}</guid>
      <description>Kadıköy bölgesindeki en güvenilir kaporasız eskort fiyatları ve yeni esrot profilleri.</description>
      <pubDate>${pastDates[2].toUTCString()}</pubDate>
    </item>
`;

  xml += `  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Update every hour to spam Google
    },
  });
}
