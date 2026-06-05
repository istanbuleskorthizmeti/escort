const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'istanbulescort.blog',
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    fs.writeFileSync('scratch/external_home.html', data, 'utf8');
    console.log('Saved external homepage to scratch/external_home.html');
  });
});

req.on('error', (e) => {
  console.error('Error fetching external homepage:', e);
});

req.end();
