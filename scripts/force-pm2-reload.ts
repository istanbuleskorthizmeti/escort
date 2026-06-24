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
    console.log('✅ Connected to VPS.');

    console.log('🔄 Performing pm2 reload all...');
    const reloadAll = await ssh.execCommand('pm2 reload all');
    console.log(reloadAll.stdout || reloadAll.stderr);

    console.log('📊 Checking PM2 active processes list:');
    const listRes = await ssh.execCommand('pm2 list');
    console.log(listRes.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
