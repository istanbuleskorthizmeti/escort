const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });
  
  console.log('=== Checking network connections of miners ===');
  const res1 = await ssh.execCommand('ss -apn | grep -E "y28m6fTRx|8hPAgpA|gWDE"');
  console.log(res1.stdout || 'None');
  
  console.log('\n=== Checking if files are deleted after run (deleted descriptors) ===');
  const res2 = await ssh.execCommand('ls -la /proc/*/exe 2>/dev/null | grep -E "y28m6fTRx|8hPAgpA"');
  console.log(res2.stdout || 'None');
  
  ssh.dispose();
}

main().catch(console.error);
