const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function uploadVitrin() {
  try {
    console.log('🚀 Connecting to server...');
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!',
      readyTimeout: 60000
    });

    console.log('📤 Uploading vitrin.zip (91MB)...');
    await ssh.putFile('C:/Users/onurk/Desktop/vitrin.zip', '/root/esc/public/vitrin.zip');

    console.log('📦 Unzipping...');
    await ssh.execCommand('mkdir -p /root/esc/public/cdn/vitrin_raw && unzip -o /root/esc/public/vitrin.zip -d /root/esc/public/cdn/vitrin_raw');

    console.log('✅ Upload and Unzip successful!');
  } catch (err) {
    console.error('❌ Upload Failed:', err);
  } finally {
    ssh.dispose();
  }
}

uploadVitrin();
