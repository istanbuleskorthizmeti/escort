const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function createSeoSymlinks() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('🔗 [SYMLINK] Creating all keyword-rich symlinks...');
    
    const script = `
    cd /var/www/cdn/vitrin/
    for f in seo_*.webp; do
      id=$(echo $f | cut -d'_' -f2)
      ln -sf "$f" "istanbul-vip-escort-bayan-$id.webp"
      ln -sf "$f" "kaporasiz-escort-resimleri-$id.webp"
      ln -sf "$f" "en-iyi-escort-profilleri-$id.webp"
      ln -sf "$f" "vip-escort-ilan-$id.webp"
    done
    `;

    await ssh.execCommand(script, { shell: '/bin/bash' });
    ssh.dispose();
    console.log('✅ [DONE] All SEO Symlinks created.');
  } catch (err) {
    console.error('❌ [ERROR]', err);
    ssh.dispose();
  }
}

createSeoSymlinks();
