import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

const scriptCode = `
const http = require('http');

const urls = [
  '/sitemap.xml',
  '/sitemap-index.xml',
  '/sitemap-districts.xml',
  '/sitemap-categories.xml',
  '/sitemap-vip.xml'
];

async function test(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3001,
      path: path,
      method: 'GET',
      headers: {
        'Host': 'istanbulescort.blog',
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    };
    const req = http.request(options, (res) => {
      console.log('PATH:', path, 'STATUS:', res.statusCode, 'TYPE:', res.headers['content-type']);
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (c) => body += c);
      res.on('end', () => {
        console.log('BODY LENGTH:', body.length);
        console.log('PREVIEW:', body.substring(0, 150), '\\n---');
        resolve();
      });
    });
    req.on('error', (e) => {
      console.log('PATH:', path, 'ERROR:', e.message);
      resolve();
    });
    req.end();
  });
}

async function run() {
  for (const url of urls) {
    await test(url);
  }
}
run();
`;

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to VPS.');
    await ssh.execCommand(`cat << 'EOF' > /tmp/test_sitemaps.js\n${scriptCode}\nEOF`);
    const runRes = await ssh.execCommand('node /tmp/test_sitemaps.js');
    console.log(runRes.stdout || runRes.stderr);
    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

run();
