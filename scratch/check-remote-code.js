const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkRemoteCodebase() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    
    console.log('✅ Connected to Attack Server');
    
    const lsResult = await ssh.execCommand('ls -la /root/esc');
    console.log('📁 /root/esc contents:');
    console.log(lsResult.stdout || 'Directory not found or empty');
    
    const envResult = await ssh.execCommand('cat /root/esc/.env');
    console.log('📄 .env contents (Partial):');
    console.log(envResult.stdout.substring(0, 500));

    ssh.dispose();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkRemoteCodebase();
