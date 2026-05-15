const { NodeSSH } = require('node-ssh');
const path = require('path');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Connecting to Server...');
    await ssh.connect({host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!', readyTimeout: 20000});
    
    console.log('Extracting fast_bundle.zip...');
    await ssh.execCommand('mkdir -p /root/esc');
    await ssh.execCommand('unzip -o /root/fast_bundle.zip -d /root/esc');
    
    console.log('Uploading .env and ecosystem...');
    await ssh.putFile(path.join(process.cwd(), '.env'), '/root/esc/.env');
    await ssh.putFile(path.join(process.cwd(), 'ecosystem.config.js'), '/root/esc/ecosystem.config.js');
    
    console.log('NPM Install...');
    await ssh.execCommand('npm install --force', {cwd: '/root/esc'});
    
    console.log('Prisma Generate...');
    await ssh.execCommand('npx prisma generate', {cwd: '/root/esc'});
    
    console.log('Build...');
    const build = await ssh.execCommand('npm run build', {cwd: '/root/esc'});
    console.log(build.stdout);
    if (build.stderr) console.error(build.stderr);
    
    console.log('Restart PM2...');
    await ssh.execCommand('pm2 restart drkcnay-web-cluster || pm2 start ecosystem.config.js --env production', {cwd: '/root/esc'});
    await ssh.execCommand('systemctl restart nginx');
    
    console.log('Done');
  } catch (err) {
    console.error(err);
  } finally {
    ssh.dispose();
  }
}
run();
