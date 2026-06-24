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

    console.log('🔄 Reloading escortvip PM2 processes...');
    const reloadRes = await ssh.execCommand('pm2 reload escortvip');
    console.log(reloadRes.stdout || reloadRes.stderr);

    console.log('📊 Current PM2 list:');
    const listRes = await ssh.execCommand('pm2 list');
    console.log(listRes.stdout);

    ssh.dispose();
  } catch (err: unknown) {
    console.error('Error:', err instanceof Error ? err.message : String(err));
    ssh.dispose();
  }
}

run();
