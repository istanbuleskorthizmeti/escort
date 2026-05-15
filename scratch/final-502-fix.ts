import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const ssh = new NodeSSH();

async function fixPathsAndBuild() {
  console.log('⚡ [PATH-FIX] Correcting tsconfig and syncing lib files...');

  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    // 1. Update tsconfig.json
    console.log('📄 Syncing tsconfig.json...');
    const tsconfig = fs.readFileSync('./tsconfig.json', 'utf8');
    await ssh.execCommand(`cat > /root/hydra/tsconfig.json << 'EOF'\n${tsconfig}\nEOF`);

    // 2. Sync missing lib files
    const libFiles = [
      'locations.ts',
      'content-data.ts'
    ];

    for (const file of libFiles) {
      console.log(`📄 Writing lib/${file}...`);
      const content = fs.readFileSync(`./lib/${file}`, 'utf8');
      await ssh.execCommand(`mkdir -p /root/hydra/lib && cat > /root/hydra/lib/${file} << 'EOF'\n${content}\nEOF`);
    }

    // 3. Final Build Attempt
    console.log('🏗️ Attempting Final Build...');
    const buildRes = await ssh.execCommand('cd /root/hydra && npm run build');
    console.log(buildRes.stdout);
    if (buildRes.stderr) console.error(buildRes.stderr);

    if (buildRes.code === 0) {
      console.log('✅ Build Success! Rebooting Hydra...');
      await ssh.execCommand('pm2 delete hydra-web || true');
      await ssh.execCommand('cd /root/hydra && PORT=3001 pm2 start npm --name "hydra-web" -- start');
      console.log('🚀 Hydra is ONLINE on port 3001.');
    }

  } catch (err: any) {
    console.error('💥 FAILURE:', err.message);
  } finally {
    ssh.dispose();
  }
}

fixPathsAndBuild();
