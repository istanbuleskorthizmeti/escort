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
    console.log('✅ Connected.');

    console.log('🔍 Locating indexing-sniper.js file in VPS /root/ directory...');
    const locateRes = await ssh.execCommand('find /root -name "*sniper*.js" -o -name "*index*.js"');
    console.log(locateRes.stdout || 'None found');

    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

run();
