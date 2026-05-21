const { NodeSSH } = require('node-ssh');
require('dotenv').config();

const ssh = new NodeSSH();

async function run() {
  const host = process.env.SSH_HOST || '213.232.235.181';
  const username = process.env.SSH_USER || 'root';
  const password = process.env.SSH_PASSWORD || '4TVuj7qiHMfh7CxH6K!';

  console.log(`Connecting to primary VPS: ${host}...`);
  try {
    await ssh.connect({ host, username, password });
    console.log('✅ Connected.');

    console.log('\n--- PM2 STATUS ---');
    const pm2List = await ssh.execCommand('pm2 status');
    console.log(pm2List.stdout || pm2List.stderr);

    console.log('\n--- NGINX STATUS & SYSTEMD ---');
    const nginxStatus = await ssh.execCommand('systemctl status nginx --no-pager');
    console.log(nginxStatus.stdout || nginxStatus.stderr);

    console.log('\n--- PORT 80/443 LISTENERS ---');
    const ports = await ssh.execCommand('netstat -tulpn | grep -E "80|443|3000|8080"');
    console.log(ports.stdout || ports.stderr);

    console.log('\n--- SYSTEM FREE MEMORY ---');
    const freeMem = await ssh.execCommand('free -m');
    console.log(freeMem.stdout || freeMem.stderr);

    console.log('\n--- LAST 20 LINES OF NGINX ERROR LOG ---');
    const nginxError = await ssh.execCommand('tail -n 20 /var/log/nginx/error.log');
    console.log(nginxError.stdout || nginxError.stderr);

  } catch (err) {
    console.error('Error connecting or running diagnostics:', err);
  } finally {
    ssh.dispose();
  }

  // Also check Attack Server
  const attackHost = process.env.ATTACK_SERVER_IP || '187.77.111.203';
  const attackUser = process.env.ATTACK_SERVER_USER || 'root';
  const attackPass = process.env.ATTACK_SERVER_PASS || 'Z4-nN8JfiUIh5,;g';

  console.log(`\nConnecting to Attack VPS: ${attackHost}...`);
  try {
    await ssh.connect({ host: attackHost, username: attackUser, password: attackPass });
    console.log('✅ Connected to Attack VPS.');

    console.log('\n--- PM2 STATUS ON ATTACK VPS ---');
    const pm2List = await ssh.execCommand('pm2 status');
    console.log(pm2List.stdout || pm2List.stderr);

    console.log('\n--- ACTIVE RUNNING BACKLINK SCRIPTS / PROCESSES ---');
    const processes = await ssh.execCommand('ps aux | grep -iE "ts|js|monster|parasite|bomb|siege" | grep -v grep');
    console.log(processes.stdout || processes.stderr);

    console.log('\n--- ATTEMPT TO TAIL SCREEN/LOGS ---');
    const screenLogs = await ssh.execCommand('tail -n 20 /root/warrior/monster.log /root/hydra-attack/parasite.log 2>/dev/null');
    console.log(screenLogs.stdout || screenLogs.stderr);

  } catch (err) {
    console.error('Error connecting to Attack VPS:', err);
  } finally {
    ssh.dispose();
  }
}

run();
