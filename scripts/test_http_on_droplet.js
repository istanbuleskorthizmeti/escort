const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 3001,
  path: '/sitemap.xml',
  method: 'GET',
  headers: {
    'Host': 'vipescorthizmeti.com',
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  }
};

console.log('📡 SENDING REQUEST TO PORT 3001...');
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:', JSON.stringify(res.headers, null, 2));
  
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log(`BODY LENGTH: ${body.length}`);
    console.log('BODY (FIRST 500 CHARS):');
    console.log(body.slice(0, 500));
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`💥 REQUEST ERROR: ${e.message}`);
  process.exit(1);
});

req.end();
