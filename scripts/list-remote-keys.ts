import { connectSSH } from './lib/ssh-helper';

async function listKeys() {
  try {
    const ssh = await connectSSH();
    console.log('CONNECTED TO VPS.');
    
    const res = await ssh.execCommand('ls -la /root/esc/*.json');
    console.log('JSON FILES:\n', res.stdout || res.stderr);
    
    ssh.dispose();
  } catch (err: any) {
    console.error('ERROR:', err.message);
  }
}

listKeys();
