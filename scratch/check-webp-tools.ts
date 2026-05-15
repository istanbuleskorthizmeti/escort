import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function checkWebpTools() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Checking for WebP conversion tools...');
    
    const webp = await ssh.execCommand('which cwebp').catch(() => ({stdout: ''}));
    if (!webp.stdout) {
       console.log('📦 cwebp missing. Installing webp tools...');
       await ssh.execCommand('apt-get update && apt-get install -y webp');
    } else {
       console.log('✅ cwebp already installed.');
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkWebpTools();
