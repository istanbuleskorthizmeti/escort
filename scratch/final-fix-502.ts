import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function finalFix() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🛠️ [ESCORT] Rebuilding Hydra from sovereign.zip...');

    const commands = [
      'npm install --force',
      'npx prisma generate',
      'npm run build',
      'pm2 delete hydra-web || true',
      'pm2 start npm --name "hydra-web" -- run start -- -p 3001'
    ];

    for (const cmd of commands) {
      console.log(`🏃 Running: ${cmd}`);
      const res = await ssh.execCommand(cmd, { cwd: '/root/hydra' });
      console.log(res.stdout || res.stderr);
    }

    console.log('✅ [ESCORT] 502 FIX COMPLETE!');
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

finalFix();
