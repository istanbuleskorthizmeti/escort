import https from 'https';

/**
 * ⚡ DRKCNAY ELITE PROTOCOL: REAL-TIME PING SERVICE (NUCLEAR v12.0)
 * Tumblr, Blogger, WordPress post'ları yayınlandıktan hemen sonra
 * Google Indexing API + IndexNow'a bildirim gönderir.
 */

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'drkcnay-elite-key';
const INDEXNOW_HOST = 'vipescorthizmeti.com'; // Ana domain (DRKCNAY Merkez)

// IndexNow'a tek URL gönder
export async function pingIndexNow(url: string): Promise<void> {
  const payload = JSON.stringify({
    host: new URL(url).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
    urlList: [url],
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.indexnow.org',
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      console.log(`🔔 [INDEXNOW] ${res.statusCode === 202 ? '✅' : '⚠️'} ${url.substring(0, 70)}`);
      resolve();
    });
    req.on('error', () => resolve()); // silent fail — asla bloklama
    req.setTimeout(5000, () => { req.destroy(); resolve(); });
    req.write(payload);
    req.end();
  });
}

// Birden fazla URL'yi batch ping et
export async function pingUrls(urls: string[]): Promise<void> {
  if (urls.length === 0) return;

  // Hostname'e göre grupla (IndexNow host başına)
  const grouped = urls.reduce<Record<string, string[]>>((acc, url) => {
    try {
      const host = new URL(url).hostname;
      acc[host] = [...(acc[host] || []), url];
    } catch {
      // Geçersiz URL — atla
    }
    return acc;
  }, {});

  const payload = JSON.stringify({
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urls.slice(0, 10000),
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.indexnow.org',
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      console.log(`🔔 [INDEXNOW BATCH] ${res.statusCode === 202 ? '✅' : '⚠️'} ${urls.length} URL gönderildi`);
      resolve();
    });
    req.on('error', () => resolve());
    req.setTimeout(10000, () => { req.destroy(); resolve(); });
    req.write(payload);
    req.end();
  });
}

/**
 * Platform post yayınlandıktan sonra çağır.
 * postUrl: Tumblr/Blogger/WP post URL'i
 * backlinks: Bu post'un linkini verdiği ana site URL'leri
 */
export async function pingPlatformPost(postUrl: string, backlinks: string[] = []): Promise<void> {
  const allUrls = [postUrl, ...backlinks].filter(Boolean);
  console.log(`🚀 [PING] ${postUrl.substring(0, 70)}`);
  // Fire-and-forget — bloklama yok
  pingUrls(allUrls).catch(() => {});
}
