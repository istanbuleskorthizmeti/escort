const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');
const ssh = new NodeSSH();

async function run() {
  const filePath = path.join(process.cwd(), 'dominion_bundle.tar.gz');
  if (!fs.existsSync(filePath)) {
    console.error('dominion_bundle.tar.gz not found!');
    return;
  }
  
  const CHUNK_SIZE = 30 * 1024 * 1024; // 30MB
  const stats = fs.statSync(filePath);
  const totalChunks = Math.ceil(stats.size / CHUNK_SIZE);
  
  console.log(`📦 File size: ${(stats.size/1024/1024).toFixed(2)} MB. Total chunks: ${totalChunks}`);
  
  console.log('🔐 Connecting to server...');
  await ssh.connect({host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!', readyTimeout: 20000});
  console.log('✅ Connected!');
  
  const fd = fs.openSync(filePath, 'r');
  const chunks = [];
  
  for (let i = 0; i < totalChunks; i++) {
    const buffer = Buffer.alloc(CHUNK_SIZE);
    const bytesRead = fs.readSync(fd, buffer, 0, CHUNK_SIZE, i * CHUNK_SIZE);
    const chunkName = `chunk_${i}.part`;
    const chunkPath = path.join(process.cwd(), chunkName);
    fs.writeFileSync(chunkPath, buffer.slice(0, bytesRead));
    
    console.log(`📤 Uploading ${chunkName} (${(bytesRead/1024/1024).toFixed(2)} MB)...`);
    await ssh.putFile(chunkPath, `/root/${chunkName}`);
    chunks.push(chunkName);
    fs.unlinkSync(chunkPath);
  }
  fs.closeSync(fd);
  
  console.log('🧩 Reassembling on server...');
  const catCmd = `cat ${chunks.map(c => `/root/${c}`).join(' ')} > /root/dominion_bundle.tar.gz`;
  await ssh.execCommand(catCmd);
  
  console.log('🏗️ Extracting on server...');
  await ssh.execCommand('mkdir -p /root/esc');
  await ssh.execCommand('tar -xzf /root/dominion_bundle.tar.gz -C /root/esc');
  
  console.log('📦 Installing npm packages on server...');
  await ssh.execCommand('npm install --force', {cwd: '/root/esc'});
  
  console.log('🗄️ Generating Prisma client...');
  await ssh.execCommand('npx prisma generate', {cwd: '/root/esc'});
  
  console.log('🔥 Starting PM2...');
  const pm2Res = await ssh.execCommand('pm2 restart all || pm2 start ecosystem.config.js --env production', {cwd: '/root/esc'});
  console.log(pm2Res.stdout);
  
  console.log('🌐 Restarting Nginx...');
  await ssh.execCommand('systemctl restart nginx');
  
  console.log('🧹 Cleaning up...');
  await ssh.execCommand(`rm /root/chunk_*.part`);
  
  console.log('🏁 GOD MODE DEPLOYMENT COMPLETE! Sites are LIVE!');
  ssh.dispose();
}

run().catch(e => { console.error('💥 ERROR:', e); ssh.dispose(); });
