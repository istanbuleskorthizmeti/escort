import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function peekDeep() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Deep Peeking into the giant archive...');
    
    const res = await ssh.execCommand('ls -F /root/temp_giant_backup/root/');
    console.log('Contents of /root/temp_giant_backup/root/:', res.stdout);

    const findImages = await ssh.execCommand('find /root/temp_giant_backup -type d -name "vitrin" -o -name "_media"');
    console.log('Media folders found:', findImages.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

peekDeep();
