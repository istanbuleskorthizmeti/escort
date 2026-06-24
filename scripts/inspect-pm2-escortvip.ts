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

    console.log('\n🔍 --- PM2 configuration details ---');
    const pRes = await ssh.execCommand('pm2 show escortvip');
    console.log(pRes.stdout || pRes.stderr);

    console.log('\n🔍 --- Listing config files in /root/esc ---');
    const files = await ssh.execCommand('ls -la /root/esc/');
    console.log(files.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

run();
