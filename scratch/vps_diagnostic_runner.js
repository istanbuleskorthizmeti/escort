const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');

const servers = [
  {
    name: 'Web Server (213.232.235.181)',
    host: '213.232.235.181',
    user: 'root',
    pass: '4TVuj7qiHMfh7CxH6K!'
  },
  {
    name: 'Attack Server (187.77.111.203)',
    host: '187.77.111.203',
    user: 'root',
    pass: 'Z4-nN8JfiUIh5,;g'
  },
  {
    name: 'Series Server (45.93.137.164)',
    host: '45.93.137.164',
    user: 'root',
    pass: 'Z4-nN8JfiUIh5,;g'
  }
];

async function run() {
  let logOutput = `==================================================\n`;
  logOutput += `🖥️  DRKCNAY VPS DIAGNOSTIC REPORT\n`;
  logOutput += `Date: ${new Date().toISOString()}\n`;
  logOutput += `==================================================\n\n`;

  for (const s of servers) {
    logOutput += `\n==================================================\n`;
    logOutput += `📡 SERVER: ${s.name} (${s.host})\n`;
    logOutput += `==================================================\n`;
    
    const ssh = new NodeSSH();
    try {
      await ssh.connect({
        host: s.host,
        username: s.user,
        password: s.pass
      });
      logOutput += `✅ Connected successfully.\n`;

      logOutput += `\n🔹 [PM2 STATUS]\n`;
      const pm2 = await ssh.execCommand('pm2 list || pm2 status');
      logOutput += pm2.stdout || pm2.stderr || 'No PM2 active\n';

      logOutput += `\n🔹 [NGINX STATUS]\n`;
      const nginx = await ssh.execCommand('systemctl status nginx --no-pager || service nginx status');
      logOutput += nginx.stdout || nginx.stderr || 'No Nginx active\n';

      logOutput += `\n🔹 [PORTS (80, 443, 3000, 3001, 8080)]\n`;
      const ports = await ssh.execCommand('ss -tulpn | grep -E "80|443|3000|3001|8080" || netstat -tulpn | grep -E "80|443|3000|3001|8080"');
      logOutput += ports.stdout || ports.stderr || 'No matching active ports\n';

      logOutput += `\n🔹 [MEMORY & LOAD]\n`;
      const free = await ssh.execCommand('free -m && uptime');
      logOutput += free.stdout || free.stderr || 'No memory info\n';

      if (s.host === '213.232.235.181') {
        logOutput += `\n🔹 [WEB VPS NGINX ERROR LOGS (LAST 30)]\n`;
        const logs = await ssh.execCommand('tail -n 30 /var/log/nginx/error.log');
        logOutput += logs.stdout || logs.stderr;
        
        logOutput += `\n🔹 [WEB VPS PM2 ERROR LOGS (LAST 30)]\n`;
        const pm2Logs = await ssh.execCommand('pm2 logs --lines 30 --err --nostream');
        logOutput += pm2Logs.stdout || pm2Logs.stderr;
      }

      if (s.host === '187.77.111.203') {
        logOutput += `\n🔹 [ATTACK VPS ACTIVE BACKLINK SCRIPTS]\n`;
        const ps = await ssh.execCommand('ps aux | grep -iE "ts|js|monster|parasite|bomb|siege|cron" | grep -v grep');
        logOutput += ps.stdout || ps.stderr || 'No active scripts running\n';

        logOutput += `\n🔹 [ATTACK VPS CRONTAB]\n`;
        const cron = await ssh.execCommand('crontab -l');
        logOutput += cron.stdout || cron.stderr || 'No crontab\n';

        logOutput += `\n🔹 [BACKLINK SCRIPTS LOGS TAIL]\n`;
        const blLogs = await ssh.execCommand('tail -n 30 /root/warrior/monster.log /root/hydra-attack/parasite.log /root/warrior/monster.log /root/hydra-attack/parasite.log 2>/dev/null');
        logOutput += blLogs.stdout || blLogs.stderr || 'No logs or log files empty\n';
      }

      if (s.host === '45.93.137.164') {
        logOutput += `\n🔹 [SERIES VPS PROCESSES]\n`;
        const ps = await ssh.execCommand('ps aux | grep -iE "node|pm2|nginx" | grep -v grep');
        logOutput += ps.stdout || ps.stderr || 'No active Node/PM2/Nginx processes\n';
      }

    } catch (e) {
      logOutput += `❌ Connection failed: ${e.message}\n`;
    } finally {
      ssh.dispose();
    }
  }

  // Write directly to local workspace
  const reportPath = path.join(process.cwd(), 'scratch', 'vps_report.txt');
  fs.writeFileSync(reportPath, logOutput);
  console.log(`Diagnostic completed. Report written to: ${reportPath}`);
}

run();
