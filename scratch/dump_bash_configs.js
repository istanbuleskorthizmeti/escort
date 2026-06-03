const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });
  
  console.log('=== FULL CONTENT OF /etc/profile ===');
  const res1 = await ssh.execCommand('cat /etc/profile');
  console.log(res1.stdout);
  
  console.log('\n=== FULL CONTENT OF /etc/bash.bashrc ===');
  const res2 = await ssh.execCommand('cat /etc/bash.bashrc');
  console.log(res2.stdout);
  
  ssh.dispose();
}

main().catch(console.error);
