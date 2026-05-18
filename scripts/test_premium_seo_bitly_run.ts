import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to VPS.');

    const testScript = `
const axios = require('axios');
const token = "dcfb6cbef7b15015d8aa3abc990ed559109de328";

async function test() {
  console.log('📡 Testing direct POST /v4/bitlinks to create standard bit.ly custom keyword link...');
  try {
    const res = await axios.post('https://api-ssl.bitly.com/v4/bitlinks', {
      long_url: 'https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa',
      domain: 'bit.ly',
      keyword: 'sefakoy-vip-escort-2026'
    }, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ SUCCESS! Generated:', res.data.link);
  } catch (err) {
    console.error('❌ FAILED! Error:', err.response ? err.response.data : err.message);
  }
}
test();
`;

    await ssh.execCommand(`echo "${testScript.replace(/"/g, '\\"')}" > /root/esc/scripts/test_premium_seo_bitly.js`);
    
    console.log('🏃‍♂️ Executing the premium test on VPS...');
    const execRes = await ssh.execCommand('node scripts/test_premium_seo_bitly.js', { cwd: '/root/esc' });
    console.log('STDOUT:', execRes.stdout);
    console.log('STDERR:', execRes.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 SSH Error:', err.message);
    ssh.dispose();
  }
}

run();
