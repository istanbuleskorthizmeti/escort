const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Finding files in /root/esc modified in the last 7 days ===');
  // Find files in /root/esc modified in the last 7 days, excluding .next and node_modules
  const cmd = `find /root/esc -type f -mtime -7 ! -path '*/node_modules/*' ! -path '*/.next/*' ! -path '*/.git/*' ! -path '*/data/hydra_chrome/*' -ls | head -n 100`;
  const res = await ssh.execCommand(cmd);
  console.log(res.stdout);

  ssh.dispose();
}

main().catch(console.error);
