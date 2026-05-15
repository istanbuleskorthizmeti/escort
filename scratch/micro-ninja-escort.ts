import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const remoteZipB64 = '/root/hydra/deploy.zip.b64';

async function microNinja() {
  let ssh = new NodeSSH();
  const fullContent = fs.readFileSync('./deploy.zip').toString('base64');
  const chunkSize = 50000; // 50KB
  const totalChunks = Math.ceil(fullContent.length / chunkSize);
  
  let currentChunk = 0;

  console.log(`🥷 Micro-Ninja Injection (50KB chunks) - Total: ${totalChunks}`);

  while (currentChunk < totalChunks) {
    try {
      if (!ssh.isConnected()) {
        await ssh.connect(server);
      }

      const chunk = fullContent.substring(currentChunk * chunkSize, (currentChunk + 1) * chunkSize);
      if (currentChunk % 10 === 0) console.log(`📦 Chunk ${currentChunk + 1}/${totalChunks}...`);
      
      const res = await ssh.execCommand(`cat >> ${remoteZipB64} << 'EOF'\n${chunk}\nEOF`);
      
      if (res.code === 0) {
        currentChunk++;
        await new Promise(r => setTimeout(r, 100)); // Stealth delay
      } else {
        await new Promise(r => setTimeout(r, 2000));
      }

    } catch (err: any) {
      ssh.dispose();
      ssh = new NodeSSH();
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  console.log('✅ Micro-Injection complete. Decoding and Building...');
  // ... build logic ...
}

microNinja();
