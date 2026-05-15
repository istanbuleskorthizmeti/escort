const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');
const ssh = new NodeSSH();

async function run() {
  const filePath = path.join(process.cwd(), 'dominion_bundle.tar.gz');
  if (!fs.existsSync(filePath)) {
    console.error('File not found!');
    return;
  }
  
  console.log('Connecting...');
  await ssh.connect({host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!', readyTimeout: 20000});
  console.log('Connected!');
  
  await ssh.execCommand('rm -f /root/dominion_bundle.tar.gz.b64');
  
  const CHUNK_SIZE = 1 * 1024 * 1024; // 1 MB to avoid command line limits
  const stats = fs.statSync(filePath);
  const totalChunks = Math.ceil(stats.size / CHUNK_SIZE);
  
  const fd = fs.openSync(filePath, 'r');
  
  for (let i = 0; i < totalChunks; i++) {
    const buffer = Buffer.alloc(CHUNK_SIZE);
    const bytesRead = fs.readSync(fd, buffer, 0, CHUNK_SIZE, i * CHUNK_SIZE);
    const b64 = buffer.slice(0, bytesRead).toString('base64');
    
    process.stdout.write(`Uploading chunk ${i+1}/${totalChunks}...`);
    const res = await ssh.execCommand(`echo "${b64}" >> /root/dominion_bundle.tar.gz.b64`);
    if (res.stderr) {
       console.log('Error:', res.stderr);
    } else {
       console.log(' Done.');
    }
  }
  fs.closeSync(fd);
  
  console.log('Decoding on server...');
  await ssh.execCommand('base64 -d /root/dominion_bundle.tar.gz.b64 > /root/dominion_bundle.tar.gz');
  
  console.log('Extracting on server...');
  await ssh.execCommand('mkdir -p /root/esc');
  await ssh.execCommand('tar -xzf /root/dominion_bundle.tar.gz -C /root/esc');

  console.log('Installing Dependencies...');
  await ssh.execCommand('npm install --force', {cwd: '/root/esc'});

  console.log('Building Next.js...');
  const buildRes = await ssh.execCommand('npx next build', {cwd: '/root/esc'});
  console.log(buildRes.stdout);
  if (buildRes.stderr) console.error(buildRes.stderr);

  console.log('Starting PM2...');
  await ssh.execCommand('npx prisma generate', {cwd: '/root/esc'});
  await ssh.execCommand('pm2 restart all || pm2 start ecosystem.config.js', {cwd: '/root/esc'});
  
  console.log('Restarting Nginx...');
  await ssh.execCommand('systemctl restart nginx');
  
  console.log('DONE!');
  ssh.dispose();
}

run().catch(e => { console.error(e); ssh.dispose(); });
