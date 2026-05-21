import { NodeSSH } from 'node-ssh';

async function run() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('📡 Connected to Production Server.');
    
    const sizeRes = await ssh.execCommand('ls -la /tmp/esc_prod.tar.gz || echo "Not found"');
    console.log('Production tarball size:', sizeRes.stdout.trim());

    const spaceRes = await ssh.execCommand('df -h /tmp');
    console.log('Disk space on /tmp:', spaceRes.stdout.trim());

    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

run();
