import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function countImages() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Definitive Image Count Check...');
    
    const res = await ssh.execCommand('find /root/hydra/public/_media/vitrin -type f | wc -l');
    console.log(`Total files in LIVE vitrin: ${res.stdout.trim()}`);

    const staleRes = await ssh.execCommand('find /root/esc_backup_stale/public/_media/vitrin -type f | wc -l');
    console.log(`Total files in STALE backup: ${staleRes.stdout.trim()}`);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

countImages();
