import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function searchBulkImages() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Global Image Audit: Searching for the bulk archive...');
    
    // 1. Search for any folder with many images
    const audit = await ssh.execCommand('find / -type f \\( -name "*.jpg" -o -name "*.png" -o -name "*.webp" \\) 2>/dev/null | cut -d/ -f1-4 | sort | uniq -c | sort -nr | head -n 20');
    console.log('--- FOLDER IMAGE DISTRIBUTION ---');
    console.log(audit.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

searchBulkImages();
