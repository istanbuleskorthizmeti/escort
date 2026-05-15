import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function diagnose() {
  try {
    await ssh.connect(config);
    console.log('--- DEEP DIAGNOSIS ---');

    console.log('\n🔥 [PM2 LOGS (Last 20 lines)]');
    const pm2Logs = await ssh.execCommand('pm2 logs drkcnay-web-cluster --lines 20 --nostream');
    console.log(pm2Logs.stdout || pm2Logs.stderr || 'NO LOGS');

    console.log('\n🌐 [NGINX STATUS]');
    const nginxStatus = await ssh.execCommand('systemctl status nginx');
    console.log(nginxStatus.stdout || nginxStatus.stderr);

    console.log('\n🛰️ [PORT LISTENERS]');
    const netstat = await ssh.execCommand('netstat -tulpn');
    console.log(netstat.stdout || 'NO LISTENERS FOUND');

    console.log('\n🛡️ [FIREWALL STATUS]');
    const ufw = await ssh.execCommand('ufw status || iptables -L -n');
    console.log(ufw.stdout || ufw.stderr);

    ssh.dispose();
  } catch (e) {
    console.error('❌ Connection failed:', e);
  }
}

diagnose();
