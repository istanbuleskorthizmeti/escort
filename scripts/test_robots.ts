import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

const scriptCode = `
const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 3001,
  path: '/robots.txt',
  method: 'GET',
  headers: {
    'Host': 'istanbulescort.blog',
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  }
};

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', res.headers['content-type']);
  
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (c) => body += c);
  res.on('end', () => {
    console.log('BODY:\\n', body);
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
    await ssh.execCommand(`cat << 'EOF' > /tmp/test_robots.js\n${scriptCode}\nEOF`);
    const runRes = await ssh.execCommand('node /tmp/test_robots.js');
    console.log(runRes.stdout || runRes.stderr);
    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
