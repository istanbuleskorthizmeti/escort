import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function findEscortVip() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🔍 Locating "escortvip" directory on Escort Server...');
    
    const find = await ssh.execCommand('find / -maxdepth 3 -name "escortvip" -type d 2>/dev/null');
    console.log('Found:', find.stdout || 'NOT FOUND IN ROOT/VAR/ETC');
    
    const lsRoot = await ssh.execCommand('ls -F /root');
    console.log('Contents of /root:', lsRoot.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

findEscortVip();
