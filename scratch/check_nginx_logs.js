const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Grepping Nginx Access Logs for Webhook or POST requests ===');
  // Check logs around 17:30 to 17:40
  const cmd = `grep -i "webhook" /var/log/nginx/access.log | tail -n 50`;
  const res1 = await ssh.execCommand(cmd);
  console.log('Webhook requests:\n', res1.stdout || 'None');

  const cmd2 = `grep -i "POST /api" /var/log/nginx/access.log | tail -n 50`;
  const res2 = await ssh.execCommand(cmd2);
  console.log('POST api requests:\n', res2.stdout || 'None');

  ssh.dispose();
}

main().catch(console.error);
