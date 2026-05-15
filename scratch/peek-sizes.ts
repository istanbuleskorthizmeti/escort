import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function peekSizes() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Checking sizes inside /root/temp_giant_backup/root/ ...');
    
    const res = await ssh.execCommand('du -sh /root/temp_giant_backup/root/*');
    console.log(res.stdout);

    const deeper = await ssh.execCommand('du -sh /root/temp_giant_backup/root/esc/*');
    console.log('\n--- DEEPER INSIDE esc/ ---');
    console.log(deeper.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

peekSizes();
