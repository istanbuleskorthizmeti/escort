import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to VPS.');

    const scriptCode = `
const http = require('http');

const options = {
  hostname: '127.0.0.1',
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
`;

    await ssh.execCommand(`cat << 'EOF' > /tmp/test_dorukcanay_meta.js\n${scriptCode}\nEOF`);
    const runRes = await ssh.execCommand('node /tmp/test_dorukcanay_meta.js');
    console.log(runRes.stdout || runRes.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
