const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  await ssh.connect({ host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' });
  console.log('🚀 Firing up NUCLEAR BACKLINK BOMBER in the background via PM2...');
  const res = await ssh.execCommand('cd /root/hydra && pm2 start npx --name hydra-bomber -- tsx scripts/nuclear-backlink-bomber.ts');
  console.log(res.stdout);
  console.log(res.stderr);
  
  // also save PM2 state
  await ssh.execCommand('pm2 save');
  ssh.dispose();
}
run();
