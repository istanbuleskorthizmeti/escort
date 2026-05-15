const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Connecting to Server...');
    await ssh.connect({host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!', readyTimeout: 20000});
    
    console.log('Uploading .env and ecosystem...');
    await ssh.putFile(path.join(process.cwd(), '.env'), '/root/esc/.env');
    await ssh.putFile(path.join(process.cwd(), 'ecosystem.config.js'), '/root/esc/ecosystem.config.js');
    
    async function uploadChunked(localFile, remoteFile) {
      const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB chunks
      const stats = fs.statSync(localFile);
      const totalChunks = Math.ceil(stats.size / CHUNK_SIZE);
      const fd = fs.openSync(localFile, 'r');
      const chunks = [];
      for (let i = 0; i < totalChunks; i++) {
        const buffer = Buffer.alloc(CHUNK_SIZE);
        const bytesRead = fs.readSync(fd, buffer, 0, CHUNK_SIZE, i * CHUNK_SIZE);
        const chunkName = `${path.basename(localFile)}_chunk_${i}.part`;
        const chunkPath = path.join(process.cwd(), chunkName);
        fs.writeFileSync(chunkPath, buffer.slice(0, bytesRead));
        
        console.log(`📤 Uploading ${chunkName} (${(bytesRead/1024/1024).toFixed(2)} MB)...`);
        await ssh.putFile(chunkPath, `/root/${chunkName}`);
        chunks.push(chunkName);
        fs.unlinkSync(chunkPath);
      }
      fs.closeSync(fd);
      
      console.log(`Reassembling ${remoteFile}...`);
      const catCmd = `cat ${chunks.map(c => `/root/${c}`).join(' ')} > ${remoteFile}`;
      await ssh.execCommand(catCmd);
      await ssh.execCommand(`rm /root/*.part`);
    }

    console.log('Uploading vitrin_cdn.zip in chunks...');
    await uploadChunked('C:\\Users\\onurk\\Desktop\\vitrin_cdn.zip', '/root/vitrin_cdn.zip');
    
    console.log('Extracting CDN...');
    await ssh.execCommand('mkdir -p /var/www/cdn/vitrin');
    await ssh.execCommand('unzip -o /root/vitrin_cdn.zip -d /var/www/cdn/vitrin/');
    await ssh.execCommand('rm /root/vitrin_cdn.zip');
    await ssh.execCommand('chown -R www-data:www-data /var/www/cdn/vitrin');
    await ssh.execCommand('chmod -R 755 /var/www/cdn/vitrin');

    console.log('Uploading mini_src.tar.gz in chunks...');
    await uploadChunked(path.join(process.cwd(), 'mini_src.tar.gz'), '/root/mini_src.tar.gz');
    
    console.log('Extracting Source...');
    await ssh.execCommand('mkdir -p /root/esc');
    await ssh.execCommand('tar -xzf /root/mini_src.tar.gz -C /root/esc');
    await ssh.execCommand('rm /root/mini_src.tar.gz');

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
