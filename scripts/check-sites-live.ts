import { PrismaClient } from '@prisma/client';
import https from 'https';

const prisma = new PrismaClient();

const googleSites = [
  { url: "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa", keyword: "sefakoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa", keyword: "bakirkoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa", keyword: "catalca-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa", keyword: "beylikduzu-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa?read_current=1", keyword: "besyol-universiteli-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/ana-sayfa", keyword: "besyol-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/istanbul-escort/ana-sayfa", keyword: "istanbul-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/sancaktepe-escort-drkcnay1-v/ana-sayfa", keyword: "sancaktepe-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v/ana-sayfa", keyword: "kartal-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/cekmekoy-escort-drkcnay1-v/ana-sayfa", keyword: "cekmekoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/arnavutkoy-escort-drkcnay1-v/ana-sayfa", keyword: "arnavutkoy-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/basaksehir-escort-drkcnay1-v/ana-sayfa", keyword: "basaksehir-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v/ana-sayfa", keyword: "esenler-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/adalar-escort-drkcnay1-v/ana-sayfa", keyword: "adalar-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/silivriescort-drkcnay2026/ana-sayfa", keyword: "silivri-vip-escort-2026" },
  { url: "https://sites.google.com/dorukcanay.digital/beyoglu-escort-drkcnay1-v/ana-sayfa", keyword: "beyoglu-vip-escort-2026" }
];

function checkUrl(url: string): Promise<{ status: number; redirectUrl?: string }> {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const req = https.request({
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        },
        timeout: 10000
      }, (res) => {
        resolve({
          status: res.statusCode || 500,
          redirectUrl: res.headers.location
        });
      });
      req.on('error', (e) => resolve({ status: 500 }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ status: 408 });
      });
      req.end();
    } catch (e) {
      resolve({ status: 400 });
    }
  });
}

async function runLocalAudit() {
  console.log('🔍 Starting local health check of all active Google Sites...');
  
  const results = [];
  for (const site of googleSites) {
    const outcome = await checkUrl(site.url);
    console.log(`Checking: ${site.keyword}... Status: ${outcome.status}`);
    
    // Check clean URL too (without '/ana-sayfa')
    const cleanUrl = site.url.replace('/ana-sayfa', '');
    const cleanOutcome = await checkUrl(cleanUrl);
    
    results.push({
      keyword: site.keyword,
      url: site.url,
      status: outcome.status,
      redirect: outcome.redirectUrl || '-',
      cleanUrl,
      cleanStatus: cleanOutcome.status
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n📊 [GOOGLE SITES HEALTH REPORT]');
  console.table(results.map(r => ({
    Keyword: r.keyword,
    'Page Status': r.status === 200 ? '🟢 200 OK' : `🔴 ${r.status}`,
    'Base Status': r.cleanStatus === 200 ? '🟢 200 OK' : `🔴 ${r.cleanStatus}`,
    Redirect: r.redirect
  })));
  
  process.exit(0);
}

runLocalAudit().catch(console.error);
