import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };
const remoteZipB64 = '/var/www/escortvip/deploy.zip.b64';
const remoteZip = '/var/www/escortvip/deploy.zip';

async function diziNinja() {
  let ssh = new NodeSSH();
  const fullContent = fs.readFileSync('./deploy.zip').toString('base64');
  const chunkSize = 1000000; // 1MB
  const totalChunks = Math.ceil(fullContent.length / chunkSize);
  
  let currentChunk = 0;

  console.log(`🥷 Starting Ninja Injection to Dizi Server - Total: ${totalChunks}`);

  while (currentChunk < totalChunks) {
    try {
      if (!ssh.isConnected()) {
        await ssh.connect(server);
      }

      const chunk = fullContent.substring(currentChunk * chunkSize, (currentChunk + 1) * chunkSize);
      console.log(`📦 Dizi Chunk ${currentChunk + 1}/${totalChunks}...`);
      
      const res = await ssh.execCommand(`cat >> ${remoteZipB64} << 'EOF'\n${chunk}\nEOF`);
      
      if (res.code === 0) {
        currentChunk++;
      } else {
        await new Promise(r => setTimeout(r, 2000));
      }

    } catch (err: any) {
      ssh.dispose();
      ssh = new NodeSSH();
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  console.log('✅ Dizi Injection complete. Decoding...');
  await ssh.connect(server);
  await ssh.execCommand(`base64 -d ${remoteZipB64} > ${remoteZip}`);
  await ssh.execCommand(`rm ${remoteZipB64}`);

  // Resolve conflicts before building
  console.log('🧹 Clearing route conflicts...');
  await ssh.execCommand('rm -rf /var/www/escortvip/app/sitemap.xml/route.ts || true');
  await ssh.execCommand('rm -rf /var/www/escortvip/app/amp/route.ts || true');

  console.log('📦 Unzipping...');
  await ssh.execCommand('cd /var/www/escortvip && unzip -o deploy.zip && rm deploy.zip');
  
  console.log('🏗️ Building...');
  const buildRes = await ssh.execCommand('cd /var/www/escortvip && npm run build');
  console.log(buildRes.stdout);
  
  if (buildRes.code === 0) {
     console.log('🚀 Dizi SUCCESS! Restarting...');
     await ssh.execCommand('pm2 delete dizicehennemi-web || true');
     await ssh.execCommand('cd /var/www/escortvip && pm2 start npm --name "dizicehennemi-web" -- start');
  }

  ssh.dispose();
}

diziNinja();
