import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function scanDirs() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('📂 Scanning for escortvip folder...');
    
    const dirs = await ssh.execCommand('ls -d /root/*/ /var/www/*/ 2>/dev/null');
    console.log(dirs.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

scanDirs();
