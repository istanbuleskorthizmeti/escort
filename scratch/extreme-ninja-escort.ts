import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const remoteZipB64 = '/root/hydra/deploy.zip.b64';

async function extremeNinja() {
  let ssh = new NodeSSH();
  const fullContent = fs.readFileSync('./deploy.zip').toString('base64');
  const chunkSize = 100000; // 100KB
  const totalChunks = Math.ceil(fullContent.length / chunkSize);
  
  let currentChunk = 0;

  while (currentChunk < totalChunks) {
    try {
      if (!ssh.isConnected()) {
        console.log('🔄 Reconnecting...');
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

  console.log('✅ Injection complete. Decoding and Building...');
  // ... rest of the logic ...
}

extremeNinja();
