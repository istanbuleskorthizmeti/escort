import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function deepDeepSearch() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Deep Deep Search: Looking for ANY large media collection...');
    
    // 1. Count all media files in common areas
    const countAll = await ssh.execCommand('find /var/www /root -type f -regex ".*\\.\\(jpg\\|jpeg\\|png\\|webp\\|gif\\|mp4\\|mov\\|avi\\|webm\\)" -not -path "*/node_modules/*" | wc -l');
    console.log(`Total media files found (deep): ${countAll.stdout.trim()}`);

    // 2. Find folders by size (top 20)
    console.log('\n--- LARGEST FOLDERS ---');
    const disk = await ssh.execCommand('du -ah /var/www /root 2>/dev/null | sort -rh | head -n 30');
    console.log(disk.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

deepDeepSearch();
