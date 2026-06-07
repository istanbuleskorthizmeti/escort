import https from 'https';
import fs from 'fs';
import path from 'path';

/**
 * 🕵️‍♂️ DRKCNAY ELITE SEO HEALTH AUDITOR (v1.0)
 * Automatically crawls dynamic routes and validates HTTP status,
 * response times, and canonical URL header matches.
 */

const TARGET_HOSTS = [
  'istanbulescort.blog',
  'escortvip.net',
  'istanbulescort.blog'
];

interface AuditResult {
  url: string;
  status: number;
  responseTimeMs: number;
  canonicalValid: boolean;
  redirectUrl?: string;
  error?: string;
}

function fetchUrl(url: string): Promise<{ status: number; body: string; headers: any; timeMs: number }> {
  const start = Date.now();
  return new Promise((resolve) => {
    const req = https.request(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      },
      timeout: 5000
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode || 0,
          body: body,
          headers: res.headers,
          timeMs: Date.now() - start
        });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 0, body: '', headers: {}, timeMs: Date.now() - start });
    });
    req.end();
  });
}


function extractCanonical(html: string): string | null {
  const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
                html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  return match ? match[1] : null;
}

async function auditHost(host: string) {
  console.log(`\n🔍 [SEO AUDIT] Starting health check for: ${host}...`);
  const routes = [
    '/',
    '/istanbul/kadikoy',
    '/istanbul/sisli',
    '/istanbul/esenyurt',
    '/sitemap.xml',
    '/gizlilik-politikasi',
    '/cerez-politikasi',
    '/sik-sorulan-sorular',
    '/hakkimizda',
    '/iletisim'
  ];

  const results: AuditResult[] = [];

  for (const route of routes) {
    const targetUrl = `https://${host}${route}`;
    console.log(`📡 Requesting: ${route}...`);
    
    const res = await fetchUrl(targetUrl);
    
    if (res.status === 200) {
      const canonical = extractCanonical(res.body);
      const expectedCanonical = targetUrl.split('?')[0]; // Remove query params
      const canonicalValid = canonical ? canonical.toLowerCase() === expectedCanonical.toLowerCase() : false;

      results.push({
        url: targetUrl,
        status: res.status,
        responseTimeMs: res.timeMs,
        canonicalValid
      });
    } else if (res.status >= 300 && res.status < 400) {
      results.push({
        url: targetUrl,
        status: res.status,
        responseTimeMs: res.timeMs,
        canonicalValid: false,
        redirectUrl: res.headers.location
      });
    } else {
      results.push({
        url: targetUrl,
        status: res.status,
        responseTimeMs: res.timeMs,
        canonicalValid: false,
        error: `HTTP Error ${res.status}`
      });
    }

    // Rate throttle to prevent server overloading
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(`\n📊 [AUDIT REPORT - ${host}]`);
  console.table(results.map(r => ({
    Route: r.url.replace(`https://${host}`, ''),
    Status: r.status === 200 ? '🟢 200 OK' : (r.status >= 300 && r.status < 400 ? `🟡 ${r.status} Redirect` : `🔴 ${r.status}`),
    TTFB: `${r.responseTimeMs}ms`,
    'Canonical Link': r.canonicalValid ? '🟢 Valid' : '🔴 N/A',
    'Redirect Target': r.redirectUrl || '-'
  })));
}

async function run() {
  for (const host of TARGET_HOSTS) {
    await auditHost(host);
  }
}

run().catch(console.error);
