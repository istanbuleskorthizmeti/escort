import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function peekEsc() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Peeking into esc/ ...');
    
    const res = await ssh.execCommand('ls -F /root/temp_giant_backup/root/esc/');
    console.log(res.stdout);

    const media = await ssh.execCommand('ls -F /root/temp_giant_backup/root/esc/public/ || ls -F /root/temp_giant_backup/root/esc/_media/');
    console.log('Potential Media path:', media.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

peekEsc();
