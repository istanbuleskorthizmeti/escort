const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function createSeoSymlinks() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('🔗 [SYMLINK] Creating keyword-rich symlinks for images...');
    
    // Commands to create symlinks based on the ID in the filename
    const script = `
    cd /var/www/cdn/vitrin/
    for f in seo_*.webp; do
      id=$(echo $f | cut -d'_' -f2)
      # Create multiple keyword symlinks for each image to dominate different niches
      ln -sf "$f" "istanbul-vip-escort-bayan-$id.webp"
      ln -sf "$f" "kaporasiz-escort-resimleri-$id.webp"
      ln -sf "$f" "en-iyi-escort-profilleri-$id.webp"
    done
    `;

    const result = await ssh.execCommand(script, { shell: '/bin/bash' });
    console.log(result.stdout || result.stderr);

    ssh.dispose();
    console.log('✅ [DONE] SEO Symlinks created.');
  } catch (err) {
    console.error('❌ [ERROR]', err);
    ssh.dispose();
  }
}

createSeoSymlinks();
