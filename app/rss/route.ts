import { cities } from '@/lib/locations';
import { blogPosts } from '@/lib/blog-data';

import { headers } from 'next/headers';
import { siteConfig } from '@/config/site';

export async function GET() {
  const headersList = await headers();
  const host = headersList.get('host') || siteConfig.domain;
  const baseUrl = `https://${host}`;
  const buildDate = new Date().toUTCString();

  // Blog Yazıları
  const blogItems = blogPosts.map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <category><![CDATA[${post.category}]]></category>
    </item>
  `).join('');

  // Tüm Şehirler, İlçeler ve Mahalleler
  const locationItems = Object.entries(cities).flatMap(([citySlug, cityObj]) => {
    const cityItem = `
      <item>
        <title><![CDATA[${cityObj.name} | VIP Rehber]]></title>
        <link>${baseUrl}/${citySlug}</link>
        <guid isPermaLink="true">${baseUrl}/${citySlug}</guid>
        <pubDate>${buildDate}</pubDate>
        <description><![CDATA[${cityObj.name} elit rehberlik ve VIP eşlik hizmetleri.]]></description>
        <category><![CDATA[Şehir Rehberi]]></category>
      </item>
    `;

    const distItems = cityObj.districts.map((district) => `
      <item>
        <title><![CDATA[${district.name.replace(' VIP', '')} | VIP İlçe Rehberi - ${cityObj.name}]]></title>
        <link>${baseUrl}/${citySlug}/${district.slug}</link>
        <guid isPermaLink="true">${baseUrl}/${citySlug}/${district.slug}</guid>
        <pubDate>${buildDate}</pubDate>
        <description><![CDATA[${district.name.replace(' VIP', '')} ilçesinde profesyonel rehberlik standartları ve VIP eşlik hizmetleri.]]></description>
        <category><![CDATA[İlçe Rehberi]]></category>
      </item>
    `).join('');

    const neighItems = cityObj.districts.flatMap((district) =>
      district.neighborhoods.map((n) => `
        <item>
          <title><![CDATA[${n.name} | ${district.name.replace(' VIP', '')} Seçkin Rehberlik]]></title>
          <link>${baseUrl}/${citySlug}/${district.slug}/${n.slug}</link>
          <guid isPermaLink="true">${baseUrl}/${citySlug}/${district.slug}/${n.slug}</guid>
          <pubDate>${buildDate}</pubDate>
          <description><![CDATA[${n.name} bölgesinde %100 gerçek profiller ve üst düzey gizlilikle profesyonel rehberlik deneyimi.]]></description>
          <category><![CDATA[Mahalle Rehberi]]></category>
        </item>
      `)
    ).join('');

    return cityItem + distItems + neighItems;
  }).join('');

  // DRKCNAY Agresif Niş Profil Simülasyonu
  const nicheProfiles = [
    { title: "Eda Nur - VIP Sarışın Partner", desc: "Şişli merkezli, elit kaporasız rus ve sarışın vip escort hizmeti.", slug: "eda-nur-vip-sarisin" },
    { title: "Aylin - Üniversiteli Elit Escort", desc: "Kadıköy bölgesinde eve ve otele gelen üniversiteli elit partner.", slug: "aylin-universiteli-partner" },
    { title: "Mira - Yabancı Rus Escort", desc: "Beşiktaş lüks residence lokasyonlu %100 onaylı rus vip escort.", slug: "mira-yabanci-rus-escort" },
    { title: "Selin - GFE Sevgili Deneyimi", desc: "Anadolu yakasında romantik ve gizli GFE sevgili deneyimi sunan elit partner.", slug: "selin-gfe-sevgili-vip" }
  ];

  const profileItems = nicheProfiles.map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${baseUrl}/profiller/${p.slug}</link>
      <guid isPermaLink="true">${baseUrl}/profiller/${p.slug}</guid>
      <pubDate>${buildDate}</pubDate>
      <description><![CDATA[${p.desc}]]></description>
      <category><![CDATA[VIP Profiller]]></category>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${host.toUpperCase()} | VIP Rehber ve Seçkin Hizmet Ağı</title>
  <link>${baseUrl}</link>
  <description>Türkiye'nin en seçkin VIP noktalarında profesyonel rehberlik ve üst düzey gizlilik odaklı hizmetler.</description>
  <language>tr</language>
  <lastBuildDate>${buildDate}</lastBuildDate>
  <managingEditor>info@${host}</managingEditor>
  <ttl>60</ttl>
  <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml" />
  ${blogItems}
  ${locationItems}
  ${profileItems}
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
