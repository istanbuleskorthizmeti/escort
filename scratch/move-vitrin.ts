import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function moveVitrin() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚚 Moving Vitrin images to the correct deployment path...');
    
    // 1. Create target directory
    await ssh.execCommand('mkdir -p /root/hydra/public/_media/vitrin');
    
    // 2. Copy images
    await ssh.execCommand('cp -r /var/www/escortvip/public/vitrin/* /root/hydra/public/_media/vitrin/');
    console.log('✅ Vitrin images deployed.');

    // 3. Fix permissions
    await ssh.execCommand('chown -R root:root /root/hydra/public/_media');
    
    console.log('🚀 SHOWCASE RECOVERY COMPLETE.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

moveVitrin();
