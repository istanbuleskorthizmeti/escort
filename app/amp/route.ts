import { NextResponse } from 'next/server';
import { vitrinImages } from '@/lib/vitrin-images';
import { siteConfig } from '@/config/site';
import { ThemeEngine } from '@/lib/theme-engine';
import { getDomainConfig } from '@/config/domains';
import { generateUltraGraphSchema } from '@/lib/seo-schema';
import { getCanonicalHost } from '@/lib/site-context';
import { slugify, turkishToLower, toTitleCaseTR } from '@/lib/utils';
import { getSafeVipProfileIdx } from '@/lib/vitrin-blacklist';
import { DRKCNAYSpintax } from '@/lib/spintax-engine';
import fs from 'fs';
import path from 'path';
function spinTextWithHost(text: string, host: string, brandName: string): string {
  if (!text) return "";
  
  // Simple seed generation from host
  let seed = 0;
  for (let i = 0; i < host.length; i++) {
    seed += host.charCodeAt(i);
  }
  
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  const choose = (arr: string[]) => arr[Math.floor(rand() * arr.length)];

  // Synonym dictionary for deterministic replacement
  const synonyms: { [key: string]: string[] } = {
    "seçkin": ["elit", "lüks", "vip", "seçkin", "premium", "kaliteli"],
    "partner": ["arkadaş", "partner", "refakatçi", "eşlikçi"],
    "deneyimi": ["deneyimi", "tecrübesi", "macerası", "birlikteliği"],
    "sunuyoruz": ["sunuyoruz", "sağlıyoruz", "vermekteyiz", "vaat ediyoruz", "organize ediyoruz"],
    "buluşmalarında": ["buluşmalarında", "görüşmelerinde", "randevularında", "seanslarında"],
    "gerçek": ["gerçek", "doğal", "%100 gerçek", "doğrulanmış", "güncel"],
    "zarif": ["zarif", "çekici", "hoş", "estetik", "seksi"],
    "beklentilerinizi": ["beklentilerinizi", "isteklerinizi", "tüm arzularınızı", "hayallerinizi"],
    "çalışıyoruz": ["çalışıyoruz", "hizmet veriyoruz", "aktif durumdayız"],
    "herhangi bir": ["hiçbir", "herhangi bir", "hiçbir şekilde"],
    "talep etmiyoruz": ["talep etmiyoruz", "istemiyoruz", "almamaktayız", "beklemiyoruz"],
    "yüz yüze": ["yüz yüze", "birebir", "doğrudan", "yüz yüze güvenli"],
    "servis": ["servis", "gönderim", "ulaşım", "hizmet"],
    "güvenlidir": ["güvenlidir", "güvenilirdir", "emniyetlidir", "sorunsuzdur"],
    "bizlere": ["bizlere", "ekiplerimize", "bize"],
    "ulaşabilirsiniz": ["ulaşabilirsiniz", "ulaşım sağlayabilirsiniz", "yazabilirsiniz"],
    "görüşmelerimiz": ["görüşmelerimiz", "buluşmalarımız", "seanslarımız"],
  };

  let spun = text;
  
  // Replace words deterministically if they exist in the text
  Object.keys(synonyms).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    spun = spun.replace(regex, () => choose(synonyms[word]));
  });

  return spun;
}

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
      const lower = turkishToLower(word);
      if (trMap[lower]) return trMap[lower];
      return toTitleCaseTR(word);
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

  // Resolve matching Google Sites page from live_google_sites.json
  let relatedSiteLink = "";
  try {
    const filePath = path.join(process.cwd(), 'data', 'live_google_sites.json');
    if (fs.existsSync(filePath)) {
      const sites: string[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const slug = slugify(locationName);
      // Try to find a site containing the district slug
      const matched = sites.find(s => s.toLowerCase().includes(slug));
      if (matched) {
        relatedSiteLink = matched;
      }
    }
  } catch (e) {
    console.error("⚠️ Failed reading live_google_sites.json:", e);
  }

  // 🛡️ TİB Bypass: Satellite pages redirect to high-DR Google Sites or flagship domain
  const isSatellite = domainConfig?.role === 'SATELLITE';
  let redirectDestinationUrl = canonicalUrl;
  if (isSatellite) {
    if (relatedSiteLink) {
      redirectDestinationUrl = relatedSiteLink;
    } else {
      redirectDestinationUrl = `https://dorukcanay.digital/istanbul/${slugify(locationName)}`;
    }
  }

  // Resolve unique content from amp_unique_content.json
  let uniqueText = "";
  let uniqueFaqs: { q: string; a: string }[] = [];

  try {
    const contentPath = path.join(process.cwd(), 'data', 'amp_unique_content.json');
    if (fs.existsSync(contentPath)) {
      const contentMap = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
      const slug = slugify(locationName);
      if (contentMap[slug]) {
        if (contentMap[slug].text) {
          uniqueText = spinTextWithHost(contentMap[slug].text, host, brandName);
        }
        if (contentMap[slug].faq && Array.isArray(contentMap[slug].faq)) {
          uniqueFaqs = contentMap[slug].faq.map((faq: { q: string; a: string }) => {
            return {
              q: spinTextWithHost(faq.q, host + "-q", brandName),
              a: spinTextWithHost(faq.a, host + "-a", brandName)
            };
          });
        }
      }
    }
  } catch (e) {
    console.error("⚠️ Failed reading amp_unique_content.json:", e);
  }

  // If uniqueText is empty, dynamically spin generic texts using DRKCNAYSpintax Engine
  if (!uniqueText) {
    const seed = locationName + host;
    const spintaxEngine = new DRKCNAYSpintax(seed);

    const isFlagship = host.includes('dorukcanay.digital');
    
    const flagSpins = [
      "{[LOC] genelinde {seçkin ve lüks|asillik ve ihtişam dolu} bir {refakatçi deneyimi|VIP partnerlik} sunuyoruz.} {Dorukcanay Elite güvencesi altında, {tamamen doğrulanmış fotoğraflar|profesyonel model vitrini} ile {akıllardan silinmeyecek|unutulmaz} bir seans planlayın.} {Buluşmalarımızda {kesinlikle ön ödeme|hiçbir şekilde kapora} talep edilmeyip, {yüz yüze ve elden ödeme|güvenilir elden ödemeli model} esastır.} {{Gizlilik ve maksimum mahremiyet|Üst düzey güvenlik standartları} altında otele ve eve gelen {seçkin manken ve partnerlerimizle|elit eşlikçilerimizle} {hayal ettiğiniz prestijli geceyi|C-Level buluşmayı} başlatın.}",
      "{Lüks ve prestijin [LOC] bölgesindeki {en seçkin adresi|tek temsilcisi} olan platformumuzda, {gerçek podyum modelleri|bağımsız elite refakatçiler} sizi bekliyor.} {Ön ödemesiz, kaporasız ve %100 güvenli buluşma prensiplerimizle {7/24 hizmetinizdeyiz|ayrıcalıklı seanslar düzenliyoruz}.} {Eve ve otele servis seçeneklerimizle, {konforunuz ve gizliliğiniz|seçkin mahremiyet standartlarınız} en üst düzeyde korunmaktadır.}"
    ];
    const standardSpins = [
      "{[LOC] genelinde {vip eskort bayan|ateşli eskort model} arayanlar için {en elit ve çekici|en seksi} modeller burada listelenmektedir.} {Aradığınız {seçkin partner deneyimine|limitsiz tutkulu geceye} ulaşmak, randevu oluşturmak ve iletişim kurmak için telefon numaralarımız üzerinden {7/24 bizlere ulaşabilirsiniz|WhatsApp üzerinden anında yazabilirsiniz}.} {Rezidans, ev veya otel konseptli tüm görüşmelerimiz tamamen {kaporasız ve yüz yüze|ön ödemesiz elden ödemeli} güvenilir görüşmeler esasına dayanmaktadır.} {Hiçbir ön ödeme veya transfer ücreti talep edilmeden, doğrudan elden ödemeli VIP hizmet alırsınız.} {[LOC] vip eskort, yerli model partnerler ve üniversiteli eskort alternatiflerimizle hayal ettiğiniz geceyi planlayın.}",
      "{[LOC] escort model arayışınızda, {gerçek ve doğrulanmış resimli|en seçkin} partnerlerle {kaporasız ve depozitosuz|yüz yüze} buluşma fırsatı sunuyoruz.} {Eve ve otele gelen {vip model ve bayan|rus ve yerli eskort} modellerimizle {7/24 aktif görüşme|limitsiz fantezi geceleri} yapabilirsiniz.} {Gizlilik prensipleri altında, %100 elden ödemeli güvenli randevunuzu hemen oluşturun.}"
    ];

    const spins = isFlagship ? flagSpins : standardSpins;
    const chosenSpin = spins[seed.length % spins.length];
    
    uniqueText = spintaxEngine.resolve(chosenSpin, { LOC: locationName });

    if (uniqueFaqs.length === 0) {
      if (isFlagship) {
        uniqueFaqs = [
          { 
            q: spintaxEngine.resolve("{[LOC] VIP refakatçi seansları kaporasız mı?}", { LOC: locationName }), 
            a: spintaxEngine.resolve("{Evet, Dorukcanay Elite bünyesindeki tüm seanslar %100 kaporasız ve elden ödemelidir. Hiçbir depozito talep edilmez.}", {})
          },
          { 
            q: spintaxEngine.resolve("{[LOC] otele servis hizmetiniz var mı?}", { LOC: locationName }), 
            a: spintaxEngine.resolve("{Evet, seçkin modellerimiz sadece lüks otellere ve rezidanslara servis sağlamaktadır. Güvenliğiniz ve gizliliğiniz en üst düzeyde korunur.}", {})
          }
        ];
      } else {
        uniqueFaqs = [
          { 
            q: spintaxEngine.resolve("{[LOC] escort vip hizmetleri kaporasız mı?}", { LOC: locationName }), 
            a: spintaxEngine.resolve("{Evet, listemizde yer alan tüm buluşmalar %100 ön ödemesiz, kaporasız ve elden ödemelidir.}", {})
          },
          { 
            q: spintaxEngine.resolve("{[LOC] otele ve eve gelen bayan servisiniz var mı?}", { LOC: locationName }), 
            a: spintaxEngine.resolve("{Evet, vip eskort bayan partnerlerimiz talep etmeniz halinde eve ve otele servis sağlamaktadır.}", {})
          }
        ];
      }
    }
  }

  // Generate host-specific dynamic schema details
  const isFlagship = host.includes('dorukcanay.digital');
  const schemaDescription = isFlagship
    ? `${locationName} bölgesinde elit ve prestijli VIP model refakatçi hizmeti. ${brandName} ile %100 doğrulanmış gerçek profiller ve kaporasız randevu.`
    : `${locationName} genelinde kaporasız vip eskort bayan kataloğu. ${brandName} ile ${locationName} escort bayan telefon numaraları ve aktif WhatsApp buluşma hattı.`;
  const schemaCategoryTitle = isFlagship
    ? `${brandName.toUpperCase()} PREMIUM PARTNER KATALOĞU`
    : `${brandName.toUpperCase()} VIP ESCORT AJANSI`;

  const schema = generateUltraGraphSchema({
    locationName: locationName,
    city: "İstanbul",
    description: schemaDescription,
    url: canonicalUrl,
    categoryTitle: schemaCategoryTitle,
    faqs: uniqueFaqs
  });

  // Select first 12 profiles from vitrinImages to display on AMP
  const ampProfiles = vitrinImages.slice(0, 12);

  const html = `<!doctype html>
<html amp lang="tr">
<head>
  <meta charset="utf-8">
  <title>🔞 ${locationName} Escort Bayan | ${brandName} VIP Kataloğu</title>
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  
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
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
      font-family: Georgia, Cambria, "Times New Roman", Times, serif;
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
    .amp-guide-box {
      margin-top: 40px;
      padding: 20px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
    }
    .amp-guide-title {
      font-size: 1.5rem;
      color: var(--primary);
      margin-bottom: 15px;
      font-weight: 900;
      text-transform: uppercase;
      font-style: italic;
    }
    .amp-guide-text {
      color: var(--text-muted);
      font-size: 0.9rem;
      line-height: 1.6;
    }
    .amp-related-link-box {
      margin-top: 15px;
      font-weight: 700;
    }
    .amp-related-link-box a {
      color: var(--primary);
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">${brandName.toUpperCase()} <span>VIP</span></div>
  </header>
  
  <div class="hero">
    <span class="badge">Buluşmak ve Randevu Almak İçin</span>
    <h1>${brandName.toUpperCase()} ${locationName.toUpperCase()} ESCORT</h1>
    <p>İletişim ve randevu için en seçkin ${locationName} vip eskort bayan modelleri. ${brandName} güvencesiyle %100 kaporasız ve yüz yüze güvenli görüşme.</p>
  </div>
  
  <div class="container">
    <div class="grid">
      ${ampProfiles.map((p, index) => {
        const isCustomImage = p.src && (p.src.startsWith('http') || p.src.includes('uploads') || !p.src.includes('seo_'));
        
        let imageSrc = '';
        if (isCustomImage) {
          imageSrc = p.src.startsWith('http') ? p.src : `https://${host}${p.src}`;
        } else {
          const safeIdx = (index % 221) + 1;
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
              ${index < 2 ? 'data-hero' : ''}
              alt="${title} - ${locationName} buluşmak için vip eskort bayan">
            </amp-img>
          </div>
          <div class="card-info">
            <div class="card-badge">${niche}</div>
            <div class="card-title">${title}</div>
            <div class="card-meta">${age} • ${locationName}</div>
            <a href="${redirectDestinationUrl}" class="btn" target="_blank" rel="noopener noreferrer">Buluşmak İçin Randevu Al</a>
          </div>
        </div>
        `;
      }).join('\n')}
    </div>
  </div>
  
  <div class="container amp-guide-box">
    <h2 class="amp-guide-title">
      ${brandName} ${locationName} Escort, Eskort, VIP İletişim Rehberi
    </h2>
    <p class="amp-guide-text">
      ${uniqueText}
    </p>
    ${relatedSiteLink ? `
    <p class="amp-related-link-box">
      🔗 <a href="${relatedSiteLink}" target="_blank" rel="noopener">Resmi ${locationName} Partner Portalı (Google Sites)</a>
    </p>` : ''}
  </div>

  <div class="footer-section">
    <p>© ${new Date().getFullYear()} ${brandName} ESCORT ESKORT GACI NETWORK. TÜM HAKLARI SAKLIDIR.</p>
    <p>
      <a href="${redirectDestinationUrl}">Masaüstü Sürüm</a> | 
      <a href="https://wa.me/${siteConfig.contact.whatsappNumber}">WhatsApp İletişim</a>
      ${relatedSiteLink ? ` | <a href="${relatedSiteLink}" target="_blank" rel="noopener">Google Sites Kataloğu</a>` : ''}
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
