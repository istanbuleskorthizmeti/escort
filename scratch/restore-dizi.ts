import { NodeSSH } from 'node-ssh';

const server = { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function restoreDizi() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ DIZI SERVER: Starting Operation "Phoenix"...');
    
    // 1. Check for malware/miners
    console.log('🛡️ Cleaning Malware...');
    await ssh.execCommand('pkill -f kgBLLdtt || true');
    await ssh.execCommand('pkill -f kdevtmpfsi || true');
    await ssh.execCommand('rm -f /tmp/kgBLLdtt /tmp/kdevtmpfsi /var/tmp/kgBLLdtt || true');
    
    // 2. Fix Build
    console.log('🏗️ Repairing Next.js Build...');
    await ssh.execCommand('npm install', { cwd: '/root/dizicehennemi' });
    const build = await ssh.execCommand('export NODE_OPTIONS="--max-old-space-size=4096" && npm run build', { cwd: '/root/dizicehennemi' });
    console.log(build.stdout);

    // 3. Restart PM2
    console.log('♻️ Restarting Dizi Services...');
    await ssh.execCommand('pm2 restart all');
    
    console.log('🏁 DIZI SERVER RECOVERED.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

restoreDizi();
