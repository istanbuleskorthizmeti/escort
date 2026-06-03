const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });
  
  const cmd = "find /etc/systemd/ /lib/systemd/ /usr/lib/systemd/ -name '*bot.service*' 2>/dev/null";
  const res = await ssh.execCommand(cmd);
  console.log('Found services:', res.stdout || 'None');
  
  // Let's also check contents if found
  if (res.stdout) {
    const paths = res.stdout.split('\n').filter(Boolean);
    for (const p of paths) {
      console.log(`\n=== File: ${p} ===`);
      const catRes = await ssh.execCommand(`cat "${p}"`);
      console.log(catRes.stdout || catRes.stderr);
      const attrRes = await ssh.execCommand(`lsattr "${p}"`);
      console.log('Attributes:', attrRes.stdout.trim());
    }
  }
  
  ssh.dispose();
}

main().catch(console.error);
