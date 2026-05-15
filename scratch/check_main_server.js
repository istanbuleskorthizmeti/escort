const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkServer() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('✅ Connected to Main Server (213.232.235.181)');
    
    console.log('--- PM2 STATUS ---');
    const pm2List = await ssh.execCommand('pm2 list');
    console.log(pm2List.stdout);

    console.log('--- SYSTEM RESOURCE CHECK ---');
    const free = await ssh.execCommand('free -h');
    console.log(free.stdout);
    const df = await ssh.execCommand('df -h /');
    console.log(df.stdout);

    console.log('--- ERROR LOGS (Tail) ---');
    const logs = await ssh.execCommand('pm2 logs drkcnay-web-cluster --lines 100 --err --out --no-colors');
    console.log(logs.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('❌ SSH Error:', err);
    ssh.dispose();
  }
}

checkServer();
