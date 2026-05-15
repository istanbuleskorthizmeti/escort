import { NodeSSH } from 'node-ssh';

const server = { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function cleanupDizi() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🧹 DIZI CLEANUP: Clearing logs and saving state...');
    
    // 1. Clear PM2 logs (often huge)
    await ssh.execCommand('pm2 flush');
    
    // 2. Save PM2 state
    await ssh.execCommand('pm2 save');
    await ssh.execCommand('pm2 startup | tail -n 1 | bash');
    
    // 3. Install logrotate
    await ssh.execCommand('pm2 install pm2-logrotate');

    console.log('✅ DIZI SERVER SECURED & PERMANENT.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

cleanupDizi();
