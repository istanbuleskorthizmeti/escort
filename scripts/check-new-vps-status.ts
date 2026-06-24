import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function main() {
  console.log('🩺 [VPS DIAGNOSTIC] Running status check on the new VPS (31.97.79.34)...');
  console.log('--------------------------------------------------------------------');

  try {
    await ssh.connect(config);
    console.log('✅ SSH Connected successfully.');

    console.log('\n--- 🟢 PM2 PROCESS STATUS ---');
    const pm2Status = await ssh.execCommand('pm2 status || pm2 list');
    console.log(pm2Status.stdout || pm2Status.stderr);

    console.log('\n--- 🟢 LISTENED PORTS ---');
    const ports = await ssh.execCommand('netstat -tuln || ss -tuln');
    console.log(ports.stdout || ports.stderr);

    console.log('\n--- 🟢 POSTGRESQL STATUS ---');
    const pgStatus = await ssh.execCommand('systemctl status postgresql | grep Active');
    console.log(pgStatus.stdout.trim() || pgStatus.stderr);

    console.log('\n--- 🟢 NGINX STATUS ---');
    const nginxStatus = await ssh.execCommand('systemctl status nginx | grep Active');
    console.log(nginxStatus.stdout.trim() || nginxStatus.stderr);

    console.log('\n--- 🟢 DOCKER CONTAINERS STATUS ---');
    const dockerStatus = await ssh.execCommand('docker ps -a');
    console.log(dockerStatus.stdout || dockerStatus.stderr);

  } catch (err: any) {
    console.error('❌ Diagnostic failed:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
