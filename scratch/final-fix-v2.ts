import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const ssh = new NodeSSH();

async function finalPush() {
  console.log('⚡ [FINAL-PUSH] Syncing fixed files and building...');

  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    const filesToSync = [
      { local: './lib/store.ts', remote: '/root/hydra/lib/store.ts' },
      { local: './components/Admin/RankTrackerTable.tsx', remote: '/root/hydra/components/Admin/RankTrackerTable.tsx' }
    ];

    for (const f of filesToSync) {
      console.log(`📄 Writing ${f.local}...`);
      const content = fs.readFileSync(f.local, 'utf8');
      await ssh.execCommand(`cat > ${f.remote} << 'EOF'\n${content}\nEOF`);
    }

    console.log('🏗️ Attempting Build...');
    const buildRes = await ssh.execCommand('cd /root/hydra && npm run build');
    console.log(buildRes.stdout);
    if (buildRes.stderr) console.error(buildRes.stderr);

    if (buildRes.code === 0) {
      console.log('✅ Build Success! Starting App...');
      await ssh.execCommand('pm2 delete all || true');
      await ssh.execCommand('cd /root/hydra && PORT=3001 pm2 start npm --name "hydra-web" -- start');
      console.log('🚀 Hydra is ONLINE.');
    }

  } catch (err: any) {
    console.error('💥 FAILURE:', err.message);
  } finally {
    ssh.dispose();
  }
}

finalPush();
