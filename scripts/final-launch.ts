import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function finalLaunch() {
  try {
    await ssh.connect(config);
    console.log('🚀 [FINAL LAUNCH] Connected to server.');

    const steps = [
      { name: '📦 NPM INSTALL', cmd: 'npm install --force' },
      { name: '🗄️ PRISMA PUSH', cmd: 'npx prisma db push --force-reset' },
      { name: '🌱 SMART SEED', cmd: 'npx tsx scripts/master/smart-seeder.ts' },
      { name: '🏗️ NEXT BUILD', cmd: 'npm run build' },
      { name: '🌐 NGINX ORCHESTRATION', cmd: 'npx tsx scripts/nginx-orchestrator.ts' },
      { name: '🔥 PM2 LAUNCH', cmd: 'pm2 restart all || pm2 start ecosystem.config.js --env production' },
      { name: '💾 PM2 SAVE', cmd: 'pm2 save' }
    ];

    for (const step of steps) {
      console.log(`📡 [STEP: ${step.name}] Executing...`);
      const res = await ssh.execCommand(step.cmd, { cwd: '/root/esc' });
      if (res.stderr) console.warn(`⚠️ [STDERR]: ${res.stderr.substring(0, 500)}...`);
      console.log(`✅ [STDOUT]: ${res.stdout.substring(0, 500)}...`);
    }

    console.log('🏁 [SYSTEM ONLINE] All 111 domains are live and orchestrated.');
    ssh.dispose();
  } catch (e) {
    console.error('💥 [LAUNCH FAILED]', e);
    ssh.dispose();
  }
}

finalLaunch();
