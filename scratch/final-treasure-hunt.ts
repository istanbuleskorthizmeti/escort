import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function finalTreasureHunt() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Final Treasure Hunt: Searching for ANY large image collection...');
    
    // 1. Check /media and /mnt
    const external = await ssh.execCommand('ls -R /media /mnt 2>/dev/null');
    console.log('External Mounts:', external.stdout || 'None found.');

    // 2. Search for any directory with more than 500 files
    console.log('\n--- Searching for High Density Directories (> 500 files) ---');
    const density = await ssh.execCommand('find / -maxdepth 6 -type d -not -path "*/node_modules/*" -not -path "*/.git/*" | while read d; do count=$(ls -1 "$d" 2>/dev/null | wc -l); if [ "$count" -gt 500 ]; then echo "$count $d"; fi; done');
    console.log(density.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

finalTreasureHunt();
