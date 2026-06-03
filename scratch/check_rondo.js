const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });
  
  console.log('=== Checking /usr/lib/lib ===');
  const res1 = await ssh.execCommand('ls -la /usr/lib/lib/ 2>/dev/null');
  console.log(res1.stdout || res1.stderr || 'Directory not found');
  
  console.log('\n=== Checking attributes of /usr/lib/lib ===');
  const res2 = await ssh.execCommand('lsattr -d /usr/lib/lib/ 2>/dev/null');
  console.log(res2.stdout || res2.stderr);
  
  console.log('\n=== Checking if rondo exists anywhere else ===');
  const res3 = await ssh.execCommand('find / -name "*rondo*" 2>/dev/null');
  console.log(res3.stdout || 'None');
  
  ssh.dispose();
}

main().catch(console.error);
