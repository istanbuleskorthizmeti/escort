import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const ssh = new NodeSSH();

async function catFix() {
  console.log('⚡ [CAT-FIX] Writing files via CAT (Bypassing SFTP)...');

  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    const components = [
      'UI/ConciergeSuite.tsx',
      'UI/LongFormContent.tsx',
      'UI/Navbar.tsx'
    ];

    for (const comp of components) {
      console.log(`📄 Writing ${comp}...`);
      const content = fs.readFileSync(`./components/${comp}`, 'utf8');
      // Escape single quotes for the shell
      const escapedContent = content.replace(/'/g, "'\\''");
      await ssh.execCommand(`mkdir -p /root/hydra/components/UI && cat > /root/hydra/components/${comp} << 'EOF'\n${content}\nEOF`);
    }

    console.log('🏗️ Attempting Build again...');
    const buildRes = await ssh.execCommand('cd /root/hydra && npm run build');
    console.log(buildRes.stdout);
    console.error(buildRes.stderr);

    if (buildRes.code === 0) {
      console.log('✅ Build Success! Restarting...');
      await ssh.execCommand('cd /root/hydra && PORT=3001 pm2 restart hydra-web || PORT=3001 pm2 start npm --name "hydra-web" -- start');
    }

  } catch (err: any) {
    console.error('💥 FAILURE:', err.message);
  } finally {
    ssh.dispose();
  }
}

catFix();
