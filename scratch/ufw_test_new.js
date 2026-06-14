const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const axios = require('axios');

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('=== DISABLING UFW TEMPORARILY ===');
    await ssh.execCommand('ufw disable');

    console.log('=== WAITING 3 SECONDS ===');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('=== CURLING SITE FROM LOCAL MACHINE ===');
    try {
      const res = await axios.get('https://istanbulescort.blog/', {
        timeout: 8000,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      console.log(`✅ Success! Status code: ${res.status}`);
    } catch (e) {
      console.error(`❌ Failed: ${e.message}`);
    }

    console.log('=== ENABLING UFW BACK ===');
    await ssh.execCommand('ufw --force enable');

  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
