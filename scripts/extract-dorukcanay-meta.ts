import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

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
  let body = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    const titleMatch = body.match(/<title>([^<]+)<\\/title>/i);
    const descMatch = body.match(/<meta\\s+name="description"\\s+content="([^"]+)"/i);
    const canonicalMatch = body.match(/<link\\s+rel="canonical"\\s+href="([^"]+)"/i);
    const ampMatch = body.match(/<link\\s+rel="amphtml"\\s+href="([^"]+)"/i);

    console.log('Title:', titleMatch ? titleMatch[1] : 'Not Found');
    console.log('Description:', descMatch ? descMatch[1] : 'Not Found');
    console.log('Canonical:', canonicalMatch ? canonicalMatch[1] : 'Not Found');
    console.log('AMP Link:', ampMatch ? ampMatch[1] : 'Not Found');
  });
});

req.on('error', (e) => {
  console.error('ERROR:', e.message);
});

req.end();
`;

    await ssh.execCommand(`cat << 'EOF' > /tmp/extract_dorukcanay_meta.js\n${scriptCode}\nEOF`);
    const runRes = await ssh.execCommand('node /tmp/extract_dorukcanay_meta.js');
    console.log(runRes.stdout || runRes.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
