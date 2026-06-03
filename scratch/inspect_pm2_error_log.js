const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });
  
  console.log('=== Tail of drkcnay-web-cluster-error-0.log ===');
  const res1 = await ssh.execCommand('tail -n 100 /root/.pm2/logs/drkcnay-web-cluster-error-0.log');
  console.log(res1.stdout);
  
  ssh.dispose();
}

main().catch(console.error);
