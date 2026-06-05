const http = require('http');

const start = Date.now();
const req = http.get('http://127.0.0.1:3000/', (res) => {
  res.on('data', () => {});
  res.on('end', () => {
    console.log(`[LOCAL SPEED] Status: ${res.statusCode} | Time: ${Date.now() - start}ms`);
  });
});

req.on('error', (e) => {
  console.error(`[LOCAL SPEED] Connection error: ${e.message}`);
});
