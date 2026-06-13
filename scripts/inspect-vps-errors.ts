import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    console.log('🚀 [RECON] Connecting to VPS 187.77.111.203...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('\n🔍 [NGINX ERROR LOGS - Last 100 lines]');
    const nginxErr = await ssh.execCommand('tail -n 100 /var/log/nginx/error.log');
    console.log(nginxErr.stdout || nginxErr.stderr || 'NO NGINX ERROR LOGS');

    console.log('\n🔍 [NGINX ACCESS LOGS - Grep 500/502/503/504]');
    const nginx5xx = await ssh.execCommand('grep -E " 50[0-9] " /var/log/nginx/access.log | tail -n 100');
    console.log(nginx5xx.stdout || nginx5xx.stderr || 'NO 5xx ERRORS FOUND IN NGINX ACCESS LOG');

    ssh.dispose();
    console.log('🏁 [FINISHED]');
  } catch (err: any) {
    console.error('💥 Recon failed:', err.message);
    ssh.dispose();
  }
}

run();
