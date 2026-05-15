import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function locateVitrinImages() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Searching for Vitrin images on the server...');
    
    // 1. Check current public path
    const checkCurrent = await ssh.execCommand('ls -1 /root/hydra/public/_media/vitrin | head -n 10');
    console.log('--- Current Vitrin Folder ---');
    console.log(checkCurrent.stdout || 'Empty or folder missing.');

    // 2. Search for the source folder
    console.log('\n--- Searching for source Vitrin folders ---');
    const findSource = await ssh.execCommand('find /var/www -type d -name "vitrin" 2>/dev/null');
    console.log(findSource.stdout || 'Source vitrin folder not found in /var/www');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

locateVitrinImages();
