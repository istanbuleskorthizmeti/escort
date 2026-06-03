const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });
  
  console.log('=== Checking files modified in the last 60 minutes ===');
  const cmd = "find /etc /root /tmp /var/tmp /usr/bin /usr/sbin /bin /sbin / -maxdepth 2 -mmin -60 -type f 2>/dev/null | grep -v -E '^/proc|^/sys|^/dev|^/run|^/var/log|^/var/lib/postgresql|^/root/esc/\\.next|^/root/\\.pm2|^/root/\\.npm|^/root/esc/node_modules'";
  const res = await ssh.execCommand(cmd);
  console.log(res.stdout || 'None found');
  
  ssh.dispose();
}

main().catch(console.error);
