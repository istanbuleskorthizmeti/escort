const { NodeSSH } = require('node-ssh');
require('dotenv').config();

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
  for (const s of servers) {
    const ssh = new NodeSSH();
    console.log(`\n==================================================`);
    console.log(`📡 CONNECTING TO: ${s.name} (${s.host})`);
    console.log(`==================================================`);
    try {
      await ssh.connect({
        host: s.host,
        username: s.user,
        password: s.pass
      });
      console.log('✅ Connected.');

      console.log('\n🔹 [PM2 STATUS]');
      const pm2 = await ssh.execCommand('pm2 list || pm2 status');
      console.log(pm2.stdout || pm2.stderr || 'No PM2 active');

      console.log('\n🔹 [NGINX STATUS]');
      const nginx = await ssh.execCommand('systemctl status nginx --no-pager || service nginx status');
      console.log(nginx.stdout || nginx.stderr || 'No Nginx active');

      console.log('\n🔹 [PORT 80/443/3000/3001/8080 LISTENING]');
      const ports = await ssh.execCommand('ss -tulpn | grep -E "80|443|3000|3001|8080" || netstat -tulpn | grep -E "80|443|3000|3001|8080"');
      console.log(ports.stdout || ports.stderr || 'No matching active ports');

      if (s.host === '213.232.235.181') {
        console.log('\n🔹 [WEB SERVER NGINX ERROR LOG]');
        const logs = await ssh.execCommand('tail -n 25 /var/log/nginx/error.log');
        console.log(logs.stdout || logs.stderr);
        
        console.log('\n🔹 [WEB SERVER PM2 ERROR LOGS (LAST 25 LINES)]');
        const pm2Logs = await ssh.execCommand('pm2 logs --lines 25 --err --nostream');
        console.log(pm2Logs.stdout || pm2Logs.stderr);
      }

      if (s.host === '187.77.111.203') {
        console.log('\n🔹 [ATTACK SERVER RUNNING BACKLINK PROCS]');
        const ps = await ssh.execCommand('ps aux | grep -iE "ts|js|monster|parasite|bomb|siege|cron" | grep -v grep');
        console.log(ps.stdout || ps.stderr || 'No active scripts running');

        console.log('\n🔹 [ATTACK SERVER CRONTAB]');
        const cron = await ssh.execCommand('crontab -l');
        console.log(cron.stdout || cron.stderr || 'No crontab');

        console.log('\n🔹 [BACKLINK LOGS TAIL]');
        const blLogs = await ssh.execCommand('tail -n 25 /root/warrior/monster.log /root/hydra-attack/parasite.log 2>/dev/null');
        console.log(blLogs.stdout || blLogs.stderr || 'No log outputs or files');
      }

      if (s.host === '45.93.137.164') {
        console.log('\n🔹 [SERIES SERVER PM2 LIST]');
        const pm2List = await ssh.execCommand('pm2 list');
        console.log(pm2List.stdout || pm2List.stderr || 'No PM2 on Series server');

        console.log('\n🔹 [SERIES SERVER RUNNING PROCS]');
        const ps = await ssh.execCommand('ps aux | grep -iE "node|pm2|nginx" | grep -v grep');
        console.log(ps.stdout || ps.stderr || 'No active Node/PM2 processes on Series Server');
      }

    } catch (e) {
      console.error(`❌ Connection failed for ${s.name}:`, e.message);
    } finally {
      ssh.dispose();
    }
  }
}

run();
