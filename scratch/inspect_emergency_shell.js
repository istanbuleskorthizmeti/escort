const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });
  
  console.log('=== Checking environment and parent/child of PID 3644027 ===');
  const res1 = await ssh.execCommand('ps -ef --forest | grep -A 10 3644027');
  console.log(res1.stdout || 'None');
  
  console.log('\n=== Checking command of PID 3644027 ===');
  const res2 = await ssh.execCommand('cat /proc/3644027/cmdline');
  console.log(res2.stdout || '[Empty]');
  
  ssh.dispose();
}

main().catch(console.error);
