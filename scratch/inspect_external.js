const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'istanbulescort.blog',
  path: '/amp',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    fs.writeFileSync('scratch/external_amp.html', data, 'utf8');
    console.log('Saved external response to scratch/external_amp.html');
  });
});

req.on('error', (e) => {
  console.error('Error fetching external page:', e);
});

req.end();
