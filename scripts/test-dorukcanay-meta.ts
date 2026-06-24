import http from 'http';

const options = {
  hostname: '31.97.79.34',
  port: 3001,
  path: '/',
  method: 'GET',
  headers: {
    'Host': 'dorukcanay.digital',
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  }
};

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', JSON.stringify(res.headers, null, 2));
  let body = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('--- Body Preview ---');
    console.log(body.substring(0, 1000));
  });
});

req.on('error', (e) => {
  console.error('ERROR:', e.message);
});

req.end();
