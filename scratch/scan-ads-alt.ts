import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function scanForAdsAlternative() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Scanning for JSON files or large data files...');
    
    // 1. Search for JSON files
    const jsons = await ssh.execCommand('find /var/www/escortvip -name "*.json" -not -path "*/node_modules/*"');
    console.log('--- JSON FILES ---');
    console.log(jsons.stdout);

    // 2. Search for any file containing "AdProfile" or "phone" (common in ads)
    console.log('\n--- SEARCHING FOR "phone" or "AdProfile" IN ALL FILES ---');
    const grep = await ssh.execCommand('grep -rl "phone" /var/www/escortvip --exclude-dir=node_modules --exclude-dir=.next | head -n 20');
    console.log(grep.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

scanForAdsAlternative();
