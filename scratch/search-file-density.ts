import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function searchFileDensity() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Searching for high-density file folders...');
    
    const script = `
      find /var/www /root -maxdepth 4 -type d -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.next/*" | while read dir; do
        count=$(ls -1 "$dir" | wc -l)
        if [ "$count" -gt 100 ]; then
          echo "$count $dir"
        fi
      done | sort -nr | head -n 20
    `;

    const res = await ssh.execCommand(script);
    console.log('--- FOLDERS WITH > 100 FILES ---');
    console.log(res.stdout || 'No high-density folders found.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

searchFileDensity();
