import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function countImagesFinal() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ FINAL COUNT in /root/temp_giant_backup/root/esc/public/images/ ...');
    
    const res = await ssh.execCommand('find /root/temp_giant_backup/root/esc/public/images -type f | wc -l');
    console.log(`Total images found: ${res.stdout.trim()}`);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

countImagesFinal();
