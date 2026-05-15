import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

async function surgicalFix() {
  console.log('⚡ [SURGICAL-FIX] Syncing missing components...');

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
      console.log(`📄 Syncing ${comp}...`);
      await ssh.putFile(
        path.resolve(process.cwd(), 'components', comp),
        `/root/hydra/components/${comp}`
      );
    }

    console.log('🏗️ Attempting Build again...');
    const buildRes = await ssh.execCommand('cd /root/hydra && npm run build');
    console.log(buildRes.stdout || buildRes.stderr);

    if (buildRes.code === 0) {
      console.log('✅ Build Success! Restarting...');
      await ssh.execCommand('cd /root/hydra && PORT=3001 pm2 restart hydra-web || PORT=3001 pm2 start npm --name "hydra-web" -- start');
    } else {
      console.error('❌ Build still failing.');
    }

  } catch (err: any) {
    console.error('💥 FAILURE:', err.message);
  } finally {
    ssh.dispose();
  }
}

surgicalFix();
