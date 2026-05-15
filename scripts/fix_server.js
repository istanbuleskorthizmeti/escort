const { NodeSSH } = require('node-ssh');
const path = require('path');
const ssh = new NodeSSH();

async function run() {
  console.log('Connecting...');
  await ssh.connect({host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!', readyTimeout: 20000});
  
  console.log('Uploading .env and ecosystem.config.js...');
  await ssh.putFile(path.join(process.cwd(), '.env'), '/root/esc/.env');
  await ssh.putFile(path.join(process.cwd(), 'ecosystem.config.js'), '/root/esc/ecosystem.config.js');
  
  console.log('Running prisma generate...');
  console.log((await ssh.execCommand('npx prisma generate', {cwd: '/root/esc'})).stdout);
  
  console.log('Building Next.js...');
  const build = await ssh.execCommand('npm run build', {cwd: '/root/esc'});
  console.log(build.stdout);
  if(build.stderr) console.log(build.stderr);
  
  console.log('Restarting PM2...');
  const pm2 = await ssh.execCommand('pm2 restart drkcnay-web-cluster || pm2 start ecosystem.config.js --env production', {cwd: '/root/esc'});
  console.log(pm2.stdout);
  if(pm2.stderr) console.log(pm2.stderr);
  
  console.log('Saving PM2...');
  await ssh.execCommand('pm2 save', {cwd: '/root/esc'});
  
  console.log('Done!');
  ssh.dispose();
}
run().catch(console.error);
