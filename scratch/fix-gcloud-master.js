const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');

async function fixGCloud() {
  const ssh = new NodeSSH();
  const keyPath = path.join(process.env.USERPROFILE, '.ssh', 'google_compute_engine');
  const privateKey = fs.readFileSync(keyPath, 'utf8');

  // Try common usernames
  const usernames = ['onurk', 'onur', 'root'];
  
  for (const username of usernames) {
    try {
      console.log(`🚀 [GCLOUD] Trying ${username}@34.40.30.140...`);
      await ssh.connect({
        host: '34.40.30.140',
        username: username,
        privateKey: privateKey,
        readyTimeout: 30000
      });
      
      console.log(`✅ [GCLOUD] Connected as ${username}.`);

      // If not root, try to become root or use sudo
      const cmdPrefix = username === 'root' ? '' : 'sudo ';

      console.log('💀 [GCLOUD] Killing processes...');
      await ssh.execCommand(`${cmdPrefix}pm2 kill`);
      await ssh.execCommand(`${cmdPrefix}pkill -9 node`);
      
      console.log('📂 [GCLOUD] Checking /root/esc or /var/www/esc...');
      const checkDir = await ssh.execCommand('ls -d /root/esc /var/www/esc');
      console.log(checkDir.stdout);

      // We assume /root/esc based on Alexhost
      console.log('🚀 [GCLOUD] Restarting stack...');
      await ssh.execCommand(`${cmdPrefix}pm2 start ecosystem.config.js`, { cwd: '/root/esc' });
      await ssh.execCommand(`${cmdPrefix}systemctl restart nginx`);

      console.log('✅ [GCLOUD] Master Node Recovered.');
      return;
    } catch(e) {
      console.warn(`⚠️ [GCLOUD] Failed as ${username}:`, e.message);
    }
  }
  console.error('❌ [GCLOUD] Could not connect with any known username.');
}

fixGCloud();
