import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  port: 22,
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

const scriptCode = `
const http = require('http');

function checkRoute(host, path, label) {
  return new Promise((resolve) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3001,
      path: path,
      method: 'GET',
      headers: {
        'Host': host,
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        console.log('--- [' + label + '] HOST: ' + host + ' | PATH: ' + path + ' ---');
        console.log('STATUS:', res.statusCode);
        if (res.headers.location) {
          console.log('REDIRECT LOCATION:', res.headers.location);
        }
        console.log('AMP Link:', body.includes('rel="amphtml"') ? '✅ Present' : '❌ Missing');
        console.log('JSON-LD Schema:', body.includes('application/ld+json') ? '✅ Present' : '❌ Missing');
        console.log('User Reviews:', body.includes('Müşteri Değerlendirmeleri') || body.includes('Yorum') || body.includes('UserReviews') || body.includes('reviewCount') ? '✅ Present' : '❌ Missing');
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error('ERROR [' + label + ']:', e.message);
      resolve();
    });

    req.end();
  });
}

async function runAll() {
  await checkRoute('istanbulescort.blog', '/istanbul', 'City Page (istanbulescort.blog)');
  await checkRoute('escortvip.net', '/istanbul', 'City Page (escortvip.net)');
  await checkRoute('istanbulescort.blog', '/istanbul', 'City Page (istanbulescort.blog)');
  await checkRoute('escortvip.net', '/amp?loc=istanbul', 'AMP Page (escortvip.net)');
  await checkRoute('istanbulescort.blog', '/amp?loc=istanbul', 'AMP Page (istanbulescort.blog)');
}

runAll();
`;

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to VPS.');
    await ssh.execCommand(`cat << 'EOF' > /tmp/verify_amp_reviews.js\n${scriptCode}\nEOF`);
    const runRes = await ssh.execCommand('node /tmp/verify_amp_reviews.js');
    console.log(runRes.stdout || runRes.stderr);
    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
