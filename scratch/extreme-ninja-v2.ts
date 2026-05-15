import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const remoteZipB64 = '/root/hydra/deploy.zip.b64';
const remoteZip = '/root/hydra/deploy.zip';

async function extremeNinja() {
  let ssh = new NodeSSH();
  const fullContent = fs.readFileSync('./deploy.zip').toString('base64');
  const chunkSize = 1000000; // 1MB
  const totalChunks = Math.ceil(fullContent.length / chunkSize);
  
  let currentChunk = 0;

  console.log(`🥷 Starting Ninja Injection (1MB chunks) - Total: ${totalChunks}`);

  while (currentChunk < totalChunks) {
    try {
      if (!ssh.isConnected()) {
        console.log('🔄 Connecting...');
        await ssh.connect(server);
      }

      const chunk = fullContent.substring(currentChunk * chunkSize, (currentChunk + 1) * chunkSize);
      console.log(`📦 Injecting chunk ${currentChunk + 1}/${totalChunks}...`);
      
      const res = await ssh.execCommand(`cat >> ${remoteZipB64} << 'EOF'\n${chunk}\nEOF`);
      
      if (res.code === 0) {
        currentChunk++;
      } else {
        console.error('⚠️ Chunk failed, retrying in 2s...', res.stderr);
        await new Promise(r => setTimeout(r, 2000));
      }

    } catch (err: any) {
      console.error('💥 Connection lost, retrying in 5s...', err.message);
      ssh.dispose();
      ssh = new NodeSSH();
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  console.log('✅ Injection complete. Decoding...');
  await ssh.connect(server);
  await ssh.execCommand(`base64 -d ${remoteZipB64} > ${remoteZip}`);
  await ssh.execCommand(`rm ${remoteZipB64}`);

  console.log('📦 Unzipping...');
  await ssh.execCommand('cd /root/hydra && unzip -o deploy.zip && rm deploy.zip');
  
  console.log('🏗️ Building...');
  const buildRes = await ssh.execCommand('cd /root/hydra && npm run build');
  console.log(buildRes.stdout);
  
  if (buildRes.code === 0) {
     console.log('🚀 SUCCESS! Restarting...');
     await ssh.execCommand('pm2 delete hydra-web || true');
     await ssh.execCommand('pkill -9 node || true');
     await ssh.execCommand('fuser -k 3001/tcp || true');
     await ssh.execCommand('cd /root/hydra && PORT=3001 pm2 start npm --name "hydra-web" -- start -- -p 3001');
  }

  ssh.dispose();
}

extremeNinja();
