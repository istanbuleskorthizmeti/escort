import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

const scriptCode = `
const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 3001,
  path: '/',
  method: 'GET',
  headers: {
    'Host': 'vipescorthizmeti.com',
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  }
};

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (c) => body += c);
  res.on('end', () => {
    console.log('BODY LENGTH:', body.length);
    const hasSvetlana = body.includes('Svetlana') || body.includes('svetlana');
    const hasCeren = body.includes('Ceren') || body.includes('ceren');
    console.log('✨ Svetlana in HTML?', hasSvetlana ? '✅ YES!' : '❌ NO');
    console.log('✨ Ceren in HTML?', hasCeren ? '✅ YES!' : '❌ NO');
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});

req.end();
`;

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    await ssh.execCommand(`cat << 'EOF' > /tmp/test_vitrin.js\n${scriptCode}\nEOF`);
    const runRes = await ssh.execCommand('node /tmp/test_vitrin.js');
    console.log(runRes.stdout || runRes.stderr);
    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
