import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function recoverAndConvert() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚚 Recovering 1000+ images from stale backup...');
    
    // 1. Copy images
    await ssh.execCommand('cp -r /root/esc_backup_stale/public/_media/vitrin/* /root/hydra/public/_media/vitrin/');
    console.log('✅ Images recovered.');

    // 2. Universal WebP Conversion
    console.log('🚀 Starting Universal WebP Conversion (Recursive & Robust)...');
    const script = `
      find /root/hydra/public/_media/vitrin -type f \\( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \\) | while read f; do
        cwebp -q 80 "$f" -o "\${f%.*}.webp" && rm "$f"
      done
    `;
    await ssh.execCommand(script);
    console.log('✅ WebP conversion complete.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

recoverAndConvert();
