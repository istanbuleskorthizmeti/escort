import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function extractGiantBackup() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('📦 Extracting Giant Backup (437MB) ...');
    
    // 1. Create temp directory
    await ssh.execCommand('mkdir -p /root/temp_giant_backup');
    
    // 2. Extract
    console.log('🏗️ Extracting files...');
    await ssh.execCommand('tar -xzf /var/www/escortvip/esc_backup.tar.gz -C /root/temp_giant_backup');
    
    // 3. Count extracted images
    const count = await ssh.execCommand('find /root/temp_giant_backup -type f -regex ".*\\.\\(jpg\\|jpeg\\|png\\|webp\\|gif\\)" | wc -l');
    console.log(`✅ Extracted media files: ${count.stdout.trim()}`);

    // 4. Locate the vitrin folder inside extraction
    const locate = await ssh.execCommand('find /root/temp_giant_backup -type d -name "vitrin"');
    console.log('Vitrin folder found at:', locate.stdout || 'Not found as "vitrin"');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

extractGiantBackup();
