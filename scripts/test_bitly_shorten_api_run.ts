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
    console.log('✅ Connected.');

    console.log('🚀 Writing a direct Bitly standard /v4/shorten API test script on VPS...');
    
    const testScript = `
const axios = require('axios');
const tokens = ["3873adb32db02876aa6c9df98580fc0567e81185", "fc1734c51856b62f2fe9c1cd53c2f283f4ce9cd4"];

async function test() {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    console.log('🔑 Testing Token #' + i + ' with standard /v4/shorten endpoint...');
    try {
      const res = await axios.post('https://api-ssl.bitly.com/v4/shorten', {
        long_url: 'https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa'
      }, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ SUCCESS! Response:', res.data);
    } catch (err) {
      console.error('❌ FAILED! Error:', err.response ? err.response.data : err.message);
    }
  }
}
test();
`;

    await ssh.execCommand(`echo "${testScript.replace(/"/g, '\\"')}" > /root/esc/scripts/test_bitly_shorten_api.js`);
    
    console.log('🏃‍♂️ Executing the test script on VPS...');
    const execRes = await ssh.execCommand('node scripts/test_bitly_shorten_api.js', { cwd: '/root/esc' });
    console.log('STDOUT:', execRes.stdout);
    console.log('STDERR:', execRes.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
