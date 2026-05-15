import { NodeSSH } from 'node-ssh';
import path from 'path';

/**
 * ☢️ DRKCNAY HYDRA: NUCLEAR REBORN (v2.0)
 * COMPLETE FROM-SCRATCH REMOTE DEPLOYMENT PROTOCOL
 */

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function executeRemote(command: string, cwd = '/root/esc') {
  console.log(`📡 [EXEC] ${command}`);
  const result = await ssh.execCommand(command, { cwd });
  if (result.stdout) console.log(`✅ [STDOUT]: ${result.stdout}`);
  if (result.stderr) console.error(`❌ [STDERR]: ${result.stderr}`);
  return result;
}

async function startNuclearDeployment() {
  try {
    console.log('🚀 [START] Initiating NUCLEAR REBORN from scratch...');
    await ssh.connect(config);
    console.log('🔐 [CONNECTED] Root access secured.');

    // 1. SYSTEM CLEANUP
    console.log('🧹 [CLEANUP] Purging existing processes and artifacts...');
    await executeRemote('pm2 delete all || true', '/');
    await executeRemote('rm -rf /root/esc/.next || true');

    // 2. DEPENDENCY & BUILD
    console.log('📦 [BUILD] Installing dependencies and building Next.js...');
    await executeRemote('npm install --force');
    await executeRemote('npx prisma generate');
    await executeRemote('npm run build');

    // 3. DATABASE SEEDING (FROM SCRATCH)
    console.log('🗄️ [DATABASE] Pushing schema and seeding contents...');
    await executeRemote('npx prisma db push --force-reset');
    await executeRemote('npx tsx scripts/master/smart-seeder.ts');

    // 4. INFRASTRUCTURE ORCHESTRATION
    console.log('🌐 [INFRA] Running Master Orchestrator...');
    await executeRemote('npx tsx scripts/master/nuclear-orchestrator.ts');

    // 5. PM2 FINAL LAUNCH
    console.log('🔥 [LAUNCH] Firing up the cluster...');
    await executeRemote('pm2 start ecosystem.config.js --env production');
    await executeRemote('pm2 save');

    console.log('🏁 [COMPLETED] NUCLEAR REBORN SUCCESSFUL. Network is online.');
    ssh.dispose();
  } catch (e) {
    console.error('💥 [CRITICAL ERROR] Deployment aborted:', e);
    ssh.dispose();
  }
}

startNuclearDeployment().catch(console.error);
