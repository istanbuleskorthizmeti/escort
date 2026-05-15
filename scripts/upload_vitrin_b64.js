const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();

async function uploadViaBase64() {
  const filePath = 'C:/Users/onurk/Desktop/vitrin.zip';
  const stats = fs.statSync(filePath);
  const fileSize = stats.size;
  const chunkSize = 16 * 1024; // 16KB chunks
  
  try {
    console.log('🚀 Connecting...');
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!',
      readyTimeout: 60000
    });

    console.log('🧹 Clearing old fragments...');
    await ssh.execCommand('rm -f /tmp/vitrin.b64 && touch /tmp/vitrin.b64');

    const buffer = fs.readFileSync(filePath);
    let offset = 0;
    let chunkIndex = 0;
    const totalChunks = Math.ceil(fileSize / chunkSize);

    console.log(`📤 Sending ${totalChunks} chunks via Base64...`);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = buffer.slice(offset, offset + chunkSize);
      const b64 = chunk.toString('base64');
      
      const result = await ssh.execCommand(`printf "${b64}" >> /tmp/vitrin.b64`);
      if (result.code !== 0) throw new Error(`Chunk ${i} failed: ${result.stderr}`);
      
      offset += chunkSize;
      if (i % 20 === 0) {
        console.log(`  [${i}/${totalChunks}] ${Math.round((offset/fileSize)*100)}% complete...`);
      }
      // Small breather
      await new Promise(r => setTimeout(r, 50));
    }

    console.log('📦 Decoding and Unzipping on server...');
    await ssh.execCommand('base64 -d /tmp/vitrin.b64 > /root/esc/public/vitrin.zip');
    await ssh.execCommand('mkdir -p /root/esc/public/cdn/vitrin_raw && unzip -o /root/esc/public/vitrin.zip -d /root/esc/public/cdn/vitrin_raw');
    await ssh.execCommand('rm /tmp/vitrin.b64');

    console.log('✅ GOD MODE: Vitrin images synchronized successfully!');
  } catch (err) {
    console.error('❌ Upload Failed:', err);
  } finally {
    ssh.dispose();
  }
}

uploadViaBase64();
