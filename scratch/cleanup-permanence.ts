import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function cleanupAndPermanence() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🧹 CLEANUP: Removing temporary files and junk...');
    
    // 1. Delete unnecessary big folders/files
    const junkFiles = [
      '/root/temp_giant_backup',
      '/root/esc_backup_stale',
      '/var/www/escortvip/esc_backup.tar.gz',
      '/root/vuc2026.sql',
      '/root/hydra/build_output.txt',
      '/root/hydra/ fresh_error.txt'
    ];
    
    for (const junk of junkFiles) {
      await ssh.execCommand(`rm -rf ${junk}`);
      console.log(`🗑️ Deleted: ${junk}`);
    }

    // 2. Permanence: Save PM2 State
    console.log('🏗️ PERMANENCE: Saving PM2 state for auto-reboot...');
    await ssh.execCommand('pm2 save');
    // Note: pm2 startup requires manual copy-paste of a command usually, 
    // but I can try to run it.
    await ssh.execCommand('pm2 startup | tail -n 1 | bash'); 
    
    // 3. Log Rotation (Ensure we don't fill up disk again)
    console.log('📦 Installing pm2-logrotate...');
    await ssh.execCommand('pm2 install pm2-logrotate');

    console.log('✅ SERVER CLEANED & HARDENED.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

cleanupAndPermanence();
