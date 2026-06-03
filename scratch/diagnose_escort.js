const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Connecting to Escort (213.232.235.181:2222)...');
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });
    console.log('Connected!');

    console.log('--- 1. PM2 Process List ---');
    const pm2Res = await ssh.execCommand('pm2 list');
    console.log(pm2Res.stdout || pm2Res.stderr);

    console.log('--- 2. Top CPU-consuming Processes ---');
    const psRes = await ssh.execCommand('ps aux --sort=-%cpu | head -n 25');
    console.log(psRes.stdout || psRes.stderr);

    console.log('--- 3. Checking for gs-dbus malware ---');
    const dbusStatus = await ssh.execCommand('systemctl status gs-dbus.service');
    console.log('gs-dbus systemd status:\n', dbusStatus.stdout || dbusStatus.stderr);

    const fileCheck = await ssh.execCommand('ls -la /usr/bin/gs-dbus /lib/systemd/system/gs-dbus.service /var/tmp/ /tmp/');
    console.log('File check output:\n', fileCheck.stdout || fileCheck.stderr);

    console.log('--- 4. Checking Root Crontab ---');
    const cronRes = await ssh.execCommand('crontab -l');
    console.log('Crontab:\n', cronRes.stdout || cronRes.stderr);

    console.log('--- 5. Checking Netstat Open Ports (Local) ---');
    const netstatRes = await ssh.execCommand('ss -tulpn');
    console.log(netstatRes.stdout || netstatRes.stderr);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

run();
