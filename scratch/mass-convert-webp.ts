import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function massConvertWebp() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Starting Universal WebP Conversion (Recursive & Robust)...');
    
    const script = `
      find /root/hydra/public/_media/vitrin -type f \\( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \\) | while read f; do
        echo "Processing: $f"
        cwebp -q 80 "$f" -o "\${f%.*}.webp" && rm "$f"
      done
    `;

    const res = await ssh.execCommand(script);
    console.log(res.stdout);
    console.log('✅ Universal conversion complete.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

massConvertWebp();
