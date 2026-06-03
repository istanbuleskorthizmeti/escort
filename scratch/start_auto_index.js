const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Starting Auto-Index process in PM2 ===');
  const res1 = await ssh.execCommand('pm2 start 2');
  console.log(res1.stdout);

  ssh.dispose();
}

main().catch(console.error);
