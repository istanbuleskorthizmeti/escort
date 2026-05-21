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

async function runDiagnostics() {
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
      console.log('✅ Connected successfully.');

      console.log('\n🔹 [PM2 PROCESSES]');
      const pm2List = await ssh.execCommand('pm2 list || pm2 status');
      console.log(pm2List.stdout || pm2List.stderr || 'No PM2 output');

      console.log('\n🔹 [NGINX HEALTH & SYSTEMD]');
      const nginx = await ssh.execCommand('systemctl status nginx --no-pager || service nginx status');
      console.log(nginx.stdout || nginx.stderr || 'No Nginx status');

      console.log('\n🔹 [PORT BINDINGS (80, 443, 3000, 8080)]');
      const netstat = await ssh.execCommand('netstat -tulpn | grep -E "80|443|3000|8080" || ss -tulpn | grep -E "80|443|3000|8080"');
      console.log(netstat.stdout || netstat.stderr || 'No port binding output');

      console.log('\n🔹 [SYSTEM MEMORY & LOAD]');
      const free = await ssh.execCommand('free -m && uptime');
      console.log(free.stdout || free.stderr || 'No memory info');

      if (s.host === '187.77.111.203') {
        console.log('\n🔹 [ATTACK VPS ACTIVE BACKLINK SCRIPTS]');
        const scripts = await ssh.execCommand('ps aux | grep -iE "tsx|ts|js|monster|parasite|bomb|siege" | grep -v grep');
        console.log(scripts.stdout || scripts.stderr || 'No backlink scripts running');

        console.log('\n🔹 [BACKLINK SCRIPTS LOGS TAIL]');
        const logs = await ssh.execCommand('tail -n 25 /root/warrior/monster.log /root/hydra-attack/parasite.log 2>/dev/null');
        console.log(logs.stdout || logs.stderr || 'No log files found or empty');
      }

      if (s.host === '213.232.235.181') {
        console.log('\n🔹 [WEB VPS NGINX ERROR LOG TAIL]');
        const errLog = await ssh.execCommand('tail -n 20 /var/log/nginx/error.log');
        console.log(errLog.stdout || errLog.stderr || 'No Nginx error logs');
      }

    } catch (err) {
      console.error(`❌ Connection failed for ${s.name}:`, err.message);
    } finally {
      ssh.dispose();
    }
  }
}

runDiagnostics();
