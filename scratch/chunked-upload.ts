import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function chunkedUpload() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Starting Chunked Base64 Upload...');
    
    const filePath = path.join(process.cwd(), 'hydra_code.tar.gz');
    const stats = fs.statSync(filePath);
    const totalSize = stats.size;
    const chunkSize = 1024 * 512; // 512KB chunks for safety
    const fd = fs.openSync(filePath, 'r');
    
    // Clear previous attempt
    await ssh.execCommand('rm -f /root/hydra_code.tar.gz.b64');
    
    let offset = 0;
    let part = 0;
    const totalParts = Math.ceil(totalSize / chunkSize);

    const buffer = Buffer.alloc(chunkSize);
    
    while (offset < totalSize) {
      const bytesRead = fs.readSync(fd, buffer, 0, chunkSize, offset);
      const chunk = buffer.slice(0, bytesRead);
      const b64 = chunk.toString('base64');
      
      process.stdout.write(`\r📤 Uploading part ${part + 1}/${totalParts} (${Math.round((offset / totalSize) * 100)}%)...`);
      
      // Use printf to handle large strings safely
      await ssh.execCommand(`printf "${b64}" >> /root/hydra_code.tar.gz.b64`);
      
      offset += bytesRead;
      part++;
    }
    
    console.log('\n✅ Uploaded all chunks!');
    console.log('🛠️ Decoding base64...');
    await ssh.execCommand('base64 -d /root/hydra_code.tar.gz.b64 > /root/hydra_code.tar.gz');
    console.log('📦 Extracting...');
    await ssh.execCommand('rm -rf /root/hydra_new && mkdir -p /root/hydra_new');
    await ssh.execCommand('tar -xzf /root/hydra_code.tar.gz -C /root/hydra_new');
    
    console.log('✨ Success!');
    fs.closeSync(fd);
    ssh.dispose();
  } catch (err: any) {
    console.error('\n❌ FAILED:', err.message);
  }
}

chunkedUpload();
