const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });
  
  console.log('=== Status of emergency.service ===');
  const res1 = await ssh.execCommand('systemctl status emergency.service');
  console.log(res1.stdout || res1.stderr);
  
  console.log('\n=== User units ===');
  const res2 = await ssh.execCommand('systemctl --machine=root@.host --user list-units --no-pager 2>&1');
  console.log(res2.stdout || res2.stderr);
  
  console.log('\n=== User units files ===');
  const res3 = await ssh.execCommand('find /root/.config/systemd/ /etc/systemd/user/ /usr/lib/systemd/user/ -type f 2>/dev/null');
  console.log(res3.stdout || 'None found');
  
  ssh.dispose();
}

main().catch(console.error);
