import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function rootFix() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🔍 [ROOT FIX] Analyzing Nginx & Ports...');

    // 1. Check Nginx Config
    const nginxRes = await ssh.execCommand('grep -r "proxy_pass" /etc/nginx/sites-enabled/');
    console.log('--- Nginx Config ---');
    console.log(nginxRes.stdout || 'No proxy_pass found in sites-enabled');

    // 2. Check Listening Ports
    const portsRes = await ssh.execCommand('netstat -tulpn | grep LISTEN');
    console.log('\n--- Listening Ports ---');
    console.log(portsRes.stdout);

    // 3. Check PM2 status one more time
    const pm2Res = await ssh.execCommand('pm2 status');
    console.log('\n--- PM2 Status ---');
    console.log(pm2Res.stdout);

    // 4. Try to find where Next.js is actually running (if at all)
    const nextProc = await ssh.execCommand('ps aux | grep next');
    console.log('\n--- Next.js Processes ---');
    console.log(nextProc.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

rootFix();
