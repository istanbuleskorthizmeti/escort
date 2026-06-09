import { NextResponse } from 'next/server';
import { vitrinImages } from '@/lib/vitrin-images';
import { siteConfig } from '@/config/site';
import { ThemeEngine } from '@/lib/theme-engine';
import { getDomainConfig } from '@/config/domains';
import { generateUltraGraphSchema } from '@/lib/seo-schema';
import { getCanonicalHost } from '@/lib/site-context';
import { slugify } from '@/lib/utils';
import { getSafeVipProfileIdx } from '@/lib/vitrin-blacklist';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawHost = request.headers.get("host") || siteConfig.domain;
  const host = getCanonicalHost(rawHost);
  const locParam = url.searchParams.get("loc");
  
  const domainConfig = getDomainConfig(host);
  const defaultDistrict = domainConfig?.targetDistrict || "İstanbul";
  
  // Resolve location context
  const rawLoc = locParam || defaultDistrict;
  const locationName = rawLoc
    .split('-')
    .map(word => {
      // Custom mapping for popular districts to have correct Turkish characters on AMP titles
      const trMap: { [key: string]: string } = {
        istanbul: 'İstanbul', kadikoy: 'Kadıköy', besiktas: 'Beşiktaş',
        sisli: 'Şişli', beylikduzu: 'Beylikdüzü', bakirkoy: 'Bakırköy',
        atasehir: 'Ataşehir', esenyurt: 'Esenyurt', fatih: 'Fatih',
        bagcilar: 'Bağcılar', bahcelievler: 'Bahçelievler', umraniye: 'Ümraniye',
        pendik: 'Pendik', maltepe: 'Maltepe', kartal: 'Kartal',
        sariyer: 'Sarıyer', uskudar: 'Üsküdar', avcilar: 'Avcılar',
        kagitthane: 'Kağıthane', sancaktepe: 'Sancaktepe', basaksehir: 'Başakşehir',
        esenler: 'Esenler', eyupsultan: 'Eyüpsultan', beykoz: 'Beykoz',
        beyoglu: 'Beyoğlu', cekmekoy: 'Çekmeköy', tuzla: 'Tuzla',
        arnavutkoy: 'Arnavutköy', gaziosmanpasa: 'Gaziosmanpaşa', sultanbeyli: 'Sultanbeyli',
        gungoren: 'Güngören', zeytinburnu: 'Zeytinburnu', sile: 'Şile',
        catalca: 'Çatalca', silivri: 'Silivri', buyukcekmece: 'Büyükçekmece',
        kucukcekmece: 'Küçükçekmece', adalar: 'Adalar', bayrampasa: 'Bayrampaşa',
        sultangazi: 'Sultangazi'
      };
      const lower = word.toLowerCase();
      if (trMap[lower]) return trMap[lower];
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
  
  const theme = ThemeEngine.getTheme(host);
  const brandName = theme.brandName || "DRKCNAY ELITE";
  const slogan = theme.slogan || "Lüks ve Seçkin VIP Eşlik Hizmeti";
  const primaryColor = theme.primaryColor || "#e11d48";
  
  // Set canonical URL pointing to the standard HTML version
  const canonicalUrl = locParam 
    ? `https://${host}/${locParam.toLowerCase()}` 
    : `https://${host}`;

  // Generate dynamic schema
  const schema = generateUltraGraphSchema({
    locationName: locationName,
    city: "İstanbul",
    description: `${locationName} bölgesinin en elit VIP escort ajansı rehberi. %100 gerçek escort bayan profilleri ve kaporasız randevu sistemi.`,
    url: canonicalUrl,
    categoryTitle: "İSTANBUL ESCORT AJANSI v24.0"
  });

  // Select first 12 profiles from vitrinImages to display on AMP
  const ampProfiles = vitrinImages.slice(0, 12);

  const html = `<!doctype html>
<html ⚡ lang="tr">
<head>
  <meta charset="utf-8">
  <title>🔞 ${locationName} ESCORT ESKORT | Buluşmak İçin Çıtır Gacı Bayan Randevu</title>
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Playfair+Display:ital,wght@0,700;1,900&display=swap" rel="stylesheet">
  
  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
  <noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  
  <script type="application/ld+json">
    ${JSON.stringify(schema)}
  </script>

  <style amp-custom>
    :root {
      --primary: ${primaryColor};
      --bg: #030303;
      --card-bg: #09090b;
      --card-border: #18181b;
      --text: #ffffff;
      --text-muted: #a1a1aa;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Outfit', sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    header {
      background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent);
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(10px);
    }
    .brand {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 900;
      font-style: italic;
      letter-spacing: -1px;
      margin: 0;
      color: var(--text);
    }
    .brand span {
      color: var(--primary);
      text-shadow: 0 0 20px rgba(225, 29, 72, 0.4);
    }
    .hero {
      padding: 50px 20px;
      text-align: center;
      background: radial-gradient(circle at center, rgba(225, 29, 72, 0.1) 0%, transparent 70%);
      border-bottom: 1px solid var(--card-border);
    }
    .badge {
      display: inline-block;
      background: rgba(225, 29, 72, 0.1);
      border: 1px solid rgba(225, 29, 72, 0.2);
      color: var(--primary);
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2px;
      padding: 6px 16px;
      border-radius: 50px;
      margin-bottom: 15px;
    }
    .hero h1 {
      font-size: 38px;
      font-weight: 900;
      margin: 0 0 15px 0;
      letter-spacing: -1px;
      line-height: 1.1;
      text-transform: uppercase;
    }
    .hero p {
      color: var(--text-muted);
      font-size: 16px;
      max-width: 600px;
      margin: 0 auto;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    @media (min-width: 768px) {
      .grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    @media (min-width: 1024px) {
      .grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    .card {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      transition: border-color 0.3s;
    }
    .card-img-wrap {
      position: relative;
      background-color: #121214;
    }
    .card-info {
      padding: 15px;
    }
    .card-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 4px 0;
    }
    .card-meta {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 12px;
    }
    .card-badge {
      display: inline-block;
      background: var(--primary);
      color: white;
      font-size: 9px;
      font-weight: 900;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .btn {
      display: block;
      background-color: var(--primary);
      color: white;
      text-align: center;
      text-decoration: none;
      font-weight: 700;
      padding: 10px;
      border-radius: 8px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .footer-section {
      background: #050507;
      border-top: 1px solid var(--card-border);
      padding: 40px 20px;
      text-align: center;
      color: var(--text-muted);
      font-size: 12px;
    }
    .footer-section a {
      color: var(--text);
      text-decoration: none;
      margin: 0 10px;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">${brandName.toUpperCase()} <span>GACI</span></div>
  </header>
  
  <div class="hero">
    <span class="badge">Buluşmak ve Randevu Almak İçin</span>
    <h1>${locationName.toUpperCase()} ESCORT ESKORT GACI</h1>
    <p>İletişim ve randevu için en seçkin ${locationName} escort, eskort, gacı, çıtır genç kız ve bayan modellerimizle hemen buluşun. Tüm görüşmeler yüz yüze kaporasızdır.</p>
  </div>
  
  <div class="container">
    <div class="grid">
      ${ampProfiles.map((p, index) => {
        const isCustomImage = p.src && (p.src.startsWith('http') || p.src.includes('uploads') || !p.src.includes('seo_'));
        
        let imageSrc = '';
        if (isCustomImage) {
          imageSrc = p.src.startsWith('http') ? p.src : `https://${host}${p.src}`;
        } else {
          const safeIdx = (index % 310) + 1;
          const currentSafeIdx = getSafeVipProfileIdx(safeIdx, index + 1);
          imageSrc = `https://${host}/${slugify(locationName)}-vip-escort-ilan-${currentSafeIdx}.webp`;
        }
        const title = p.title || "Elite Model";
        const age = p.age ? `${p.age} Yaş` : "24 Yaş";
        const niche = p.niche || "Elite Model";
        return `
        <div class="card">
          <div class="card-img-wrap">
            <amp-img 
              src="${imageSrc}" 
              width="300" 
              height="400" 
              layout="responsive" 
              alt="${title} - ${locationName} buluşmak için eskort gacı bayan">
            </amp-img>
          </div>
          <div class="card-info">
            <div class="card-badge">${niche}</div>
            <div class="card-title">${title}</div>
            <div class="card-meta">${age} • ${locationName}</div>
            <a href="https://wa.me/${siteConfig.contact.whatsappNumber}" class="btn" target="_blank" rel="noopener noreferrer">Buluşmak İçin Randevu Al</a>
          </div>
        </div>
        `;
      }).join('\n')}
    </div>
  </div>
  
  <div class="container" style="margin-top: 40px; padding: 20px; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 8px;">
    <h2 style="font-size: 1.5rem; color: var(--primary); margin-bottom: 15px; font-weight: 900; text-transform: uppercase; font-style: italic;">
      ${locationName} Escort, Eskort, Gacı Buluşma ve İletişim Rehberi
    </h2>
    <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">
      ${locationName} genelinde çıtır eskort bayan arayanlar için en hiddetli gacı ve genç kız modelleri burada listelenmektedir. 
      Randevu almak için, buluşmak için ve iletişim kurmak için telefon numaralarımız üzerinden 7/24 bizlere ulaşabilirsiniz. 
      Tamamen kaporasız ve yüz yüze güvenilir görüşmeler ile partnerinizle hemen buluşun.
    </p>
  </div>

  <div class="footer-section">
    <p>© ${new Date().getFullYear()} ${brandName} ESCORT ESKORT GACI NETWORK. TÜM HAKLARI SAKLIDIR.</p>
    <p>
      <a href="${canonicalUrl}">Masaüstü Sürüm</a> | 
      <a href="https://wa.me/${siteConfig.contact.whatsappNumber}">WhatsApp İletişim</a>
    </p>
  </div>
</body>
</html>
`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
