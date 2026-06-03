const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Locating parent process of nc commands (pstree or ps) ===');
  const res1 = await ssh.execCommand('ps -ef --forest | grep -B 3 -A 3 "nc 107" | head -n 40');
  console.log(res1.stdout);

  ssh.dispose();
}

main().catch(console.error);
