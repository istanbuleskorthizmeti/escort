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
    const disableRes = await ssh.execCommand('ufw disable');
    console.log(disableRes.stdout || disableRes.stderr);

    console.log('=== WAITING 3 SECONDS FOR PROPAGATION ===');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('=== CURLING SITE FROM LOCAL MACHINE ===');
    try {
      const res = await axios.get('https://istanbulescdrkcn.com/', {
        timeout: 8000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      console.log(`✅ Success! Status code: ${res.status}`);
      console.log(`Headers:`, res.headers);
    } catch (e) {
      console.error(`❌ Failed: ${e.message}`);
      if (e.response) {
        console.error(`Status: ${e.response.status}`);
        console.error(`Body sample:`, String(e.response.data).substring(0, 500));
      }
    }

    console.log('=== ENABLING UFW BACK ===');
    const enableRes = await ssh.execCommand('ufw --force enable');
    console.log(enableRes.stdout || enableRes.stderr);

  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
