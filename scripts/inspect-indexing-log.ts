import { connectSSH } from './lib/ssh-helper';

async function monitor() {
  try {
    const ssh = await connectSSH();
    console.log('CONNECTED TO VPS FOR MONITORING.');
    
    const res = await ssh.execCommand('tail -n 100 /root/esc/logs/indexing.log');
    console.log('LOG OUTPUT:\n', res.stdout || res.stderr);
    
    ssh.dispose();
  } catch (err: any) {
    console.error('MONITOR ERROR:', err.message);
  }
}

monitor();
