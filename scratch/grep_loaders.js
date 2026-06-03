const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });
  
  console.log('=== Grepping /etc/profile for lrt or let ===');
  const res1 = await ssh.execCommand('grep -n -E "lrt|let|d\\.d|y28m|8hPA" /etc/profile /etc/bash.bashrc ~/.bashrc ~/.profile /etc/crontab 2>/dev/null');
  console.log(res1.stdout || 'None');
  
  ssh.dispose();
}

main().catch(console.error);
