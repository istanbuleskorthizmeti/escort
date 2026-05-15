import { NextResponse } from 'next/server';
import { vitrinImages } from '@/lib/vitrin-images';
import { siteConfig } from '@/config/site';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const host = request.headers.get("host") || siteConfig.domain;
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // We add the homepage with all the vitrin images attached to it
  xml += `  <url>
    <loc>${baseUrl}/</loc>
`;

  // Add all vitrin images to the sitemap to force Google Images indexing
  vitrinImages.forEach((image: any) => {
    // Generate a contextual title for the image to rank in image search safely (Bypassing SafeSearch)
    const title = image.src.includes('rus') ? 'Profesyonel Rus VIP Model' 
                : image.src.includes('sar') ? 'Sarışın VIP Özel Asistan'
                : 'Elit VIP Model Görseli';
                
    xml += `    <image:image>
      <image:loc>${baseUrl}${image.src}</image:loc>
      <image:title>${title} - ${host}</image:title>
      <image:caption>Kurumsal, kaporasız ve %100 doğrulanmış VIP model profili.</image:caption>
    </image:image>
`;
  });

  xml += `  </url>
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
