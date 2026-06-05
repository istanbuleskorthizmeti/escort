import https from 'https';
import dns from 'dns';

function customLookup(hostname, options, callback) {
  const cb = typeof callback === 'function' ? callback : options;
  if (hostname === 'vipescorthizmeti.com') {
    if (options && options.all) {
      cb(null, [{ address: '104.21.0.182', family: 4 }]);
    } else {
      cb(null, '104.21.0.182', 4);
    }
  } else {
    dns.lookup(hostname, options, callback);
  }
}

async function checkRedirect() {
  const req = https.get({
    hostname: 'vipescorthizmeti.com',
    path: '/',
    lookup: customLookup,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5'
    }
  }, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
    res.resume();
  });

  req.on('error', (err) => {
    console.error('Request Error:', err.message);
  });
}

checkRedirect();
