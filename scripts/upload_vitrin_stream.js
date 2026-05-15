const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();

async function uploadVitrinStream() {
  const filePath = 'C:/Users/onurk/Desktop/vitrin.zip';
  
  try {
    console.log('🚀 [GOD MODE] Streaming vitrin.zip directly to server...');
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    // Use raw ssh2 connection to bypass SFTP
    const conn = ssh.connection;

    await new Promise((resolve, reject) => {
      conn.exec('cat > /root/esc/public/vitrin.zip', (err, stream) => {
        if (err) return reject(err);
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(stream);
        
        stream.on('close', (code, signal) => {
          if (code === 0) resolve();
          else reject(new Error(`Exit code ${code}`));
        });
        
        stream.stderr.on('data', (data) => console.log('STDERR: ' + data));
        
        // Progress tracking
        let uploaded = 0;
        const total = fs.statSync(filePath).size;
        fileStream.on('data', (chunk) => {
          uploaded += chunk.length;
          if (uploaded % (5 * 1024 * 1024) < chunk.length) {
            console.log(`  Progress: ${Math.round((uploaded / total) * 100)}% (${(uploaded / 1024 / 1024).toFixed(1)}MB)`);
          }
        });
      });
    });

    console.log('📦 Unzipping on server...');
    await ssh.execCommand('mkdir -p /root/esc/public/cdn/vitrin_raw && unzip -o /root/esc/public/vitrin.zip -d /root/esc/public/cdn/vitrin_raw');
    
    console.log('✅ Stream successful!');
  } catch (err) {
    console.error('❌ Stream Failed:', err);
  } finally {
    ssh.dispose();
  }
}

uploadVitrinStream();
