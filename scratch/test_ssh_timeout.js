const { Client } = require('ssh2');

const conn = new Client();
console.log('Starting long-wait SSH test...');
const startTime = Date.now();

conn.on('ready', () => {
  console.log(`[${(Date.now() - startTime)/1000}s] Client :: ready`);
  conn.exec('echo "hello from debug"', (err, stream) => {
    if (err) {
      console.error('Exec error:', err);
      conn.end();
      return;
    }
    console.log(`[${(Date.now() - startTime)/1000}s] Stream opened`);
    stream.on('close', (code, signal) => {
      console.log(`[${(Date.now() - startTime)/1000}s] Stream :: close :: code: ${code}, signal: ${signal}`);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).on('error', (err) => {
  console.error(`[${(Date.now() - startTime)/1000}s] Connection error:`, err);
}).on('connect', () => {
  console.log(`[${(Date.now() - startTime)/1000}s] Connecting...`);
}).on('handshake', (negotiated) => {
  console.log(`[${(Date.now() - startTime)/1000}s] Handshake completed`);
}).connect({
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!',
  readyTimeout: 300000, // 5 minutes
  debug: (msg) => console.log(`[${(Date.now() - startTime)/1000}s] DEBUG:`, msg)
});
