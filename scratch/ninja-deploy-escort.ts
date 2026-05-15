import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const remoteZipB64 = '/root/hydra/deploy.zip.b64';
const remoteZip = '/root/hydra/deploy.zip';

async function ninjaDeploy() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🥷 Starting Ninja Injection (Chunked Base64) to Escort Server...');

    // 1. Clean old files
    await ssh.execCommand(`rm -f ${remoteZipB64} ${remoteZip}`);

    // 2. Read and encode
    const fullContent = fs.readFileSync('./deploy.zip').toString('base64');
    const chunkSize = 500000; // ~500KB chunks for stability
    const totalChunks = Math.ceil(fullContent.length / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = fullContent.substring(i * chunkSize, (i + 1) * chunkSize);
      console.log(`📦 Injecting chunk ${i + 1}/${totalChunks}...`);
      await ssh.execCommand(`cat >> ${remoteZipB64} << 'EOF'\n${chunk}\nEOF`);
    }

    console.log('✅ All chunks injected. Decoding...');
    await ssh.execCommand(`base64 -d ${remoteZipB64} > ${remoteZip}`);
    await ssh.execCommand(`rm ${remoteZipB64}`);

    console.log('📦 Unzipping...');
    await ssh.execCommand('cd /root/hydra && unzip -o deploy.zip && rm deploy.zip');
    console.log('✅ Unzipped.');

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
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

ninjaDeploy();
