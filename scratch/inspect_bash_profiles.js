const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });
  
  console.log('=== Tail of /etc/profile ===');
  const res1 = await ssh.execCommand('tail -n 30 /etc/profile');
  console.log(res1.stdout);
  
  console.log('\n=== Tail of /etc/bash.bashrc ===');
  const res2 = await ssh.execCommand('tail -n 30 /etc/bash.bashrc');
  console.log(res2.stdout);
  
  ssh.dispose();
}

main().catch(console.error);
