import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function listExtracted() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Listing contents of /root/temp_giant_backup ...');
    
    const res = await ssh.execCommand('ls -F /root/temp_giant_backup');
    console.log(res.stdout);

    const size = await ssh.execCommand('du -sh /root/temp_giant_backup');
    console.log('Total Size:', size.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

listExtracted();
