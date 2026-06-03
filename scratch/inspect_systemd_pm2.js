const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });
  
  console.log('=== Checking files in /etc/systemd/system/ ===');
  const res1 = await ssh.execCommand('ls -la /etc/systemd/system/ 2>/dev/null');
  console.log(res1.stdout);
  
  console.log('\n=== Checking /root/.pm2/logs/ ===');
  const res2 = await ssh.execCommand('ls -la /root/.pm2/logs/ 2>/dev/null');
  console.log(res2.stdout || 'None');
  
  ssh.dispose();
}

main().catch(console.error);
