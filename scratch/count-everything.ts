import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function countEverything(path: string) {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log(`🕵️ Counting images in ${path} ...`);
    
    const res = await ssh.execCommand(`find ${path} -type f \\( -iname "*.jpg" -o -iname "*.png" -o -iname "*.webp" \\) | wc -l`);
    console.log(`Total images: ${res.stdout.trim()}`);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

const target = process.argv[2] || '/var/www';
countEverything(target);
