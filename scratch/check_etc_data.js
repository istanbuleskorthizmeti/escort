const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });
  
  const cmd = "ls -la /etc/data && lsattr /etc/data/* 2>/dev/null";
  const res = await ssh.execCommand(cmd);
  console.log(res.stdout || res.stderr);
  
  ssh.dispose();
}

main().catch(console.error);
