import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

async function totalFix() {
  console.log('⚡ [ULTIMATE-FIX] Initiating Total Synchronization & Build...');

  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('✅ Connected to Server.');

    // 1. Sync critical directories
    const dirs = ['app', 'components', 'lib', 'config', 'scripts'];
    for (const dir of dirs) {
      console.log(`📤 Syncing ${dir}...`);
      await ssh.putDirectory(path.resolve(process.cwd(), dir), `/root/hydra/${dir}`, {
        recursive: true,
        concurrency: 2
      });
    }

    // 2. Sync individual config files
    const files = ['package.json', 'tsconfig.json', 'next.config.ts', '.env'];
    for (const file of files) {
      console.log(`📄 Syncing ${file}...`);
      await ssh.putFile(path.resolve(process.cwd(), file), `/root/hydra/${file}`);
    }

    // 3. Clean and Build
    console.log('🏗️ Running Clean Build (npm install && npm run build)...');
    await ssh.execCommand('cd /root/hydra && rm -rf .next && npm install');
    const buildRes = await ssh.execCommand('cd /root/hydra && npm run build');
    
    if (buildRes.code !== 0) {
      console.error('❌ Build FAILED!');
      console.error(buildRes.stderr);
      return;
    }
    console.log('✅ Build Successful.');

    // 4. Kill everything and restart on 3001
    console.log('🚀 Restarting Application on port 3001...');
    await ssh.execCommand('pm2 delete all || true');
    await ssh.execCommand('pkill -9 node || true');
    await ssh.execCommand('cd /root/hydra && PORT=3001 pm2 start npm --name "hydra-web" -- start');
    
    // 5. Verify Port
    const netstat = await ssh.execCommand('netstat -tulpn | grep 3001');
    console.log('📡 Port Check (3001):', netstat.stdout || 'NOT LISTENING!');

    console.log('🏁 Operation Complete. Check the sites now.');

  } catch (err: any) {
    console.error('💥 FAILURE:', err.message);
  } finally {
    ssh.dispose();
  }
}

totalFix();
