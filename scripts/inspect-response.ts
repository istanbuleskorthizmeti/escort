import https from 'https';

function checkDomain(domain: string) {
  const req = https.request(`https://${domain}/istanbul/kadikoy`, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    }
  }, (res) => {
    let body = '';
    res.on('data', (c) => body += c);
    res.on('end', () => {
      // Find where <link rel="canonical" exists
      const idx = body.indexOf('canonical');
      if (idx !== -1) {
        console.log(`FOUND "canonical" AT INDEX ${idx}:`);
        console.log(body.substring(idx - 100, idx + 200));
      } else {
        console.log(`"canonical" NOT FOUND IN HTML BODY!`);
      }
    });
  });
  req.on('error', (e) => console.error(e));
  req.end();
}

checkDomain('escortvip.net');
