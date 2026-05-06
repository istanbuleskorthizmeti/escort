import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const SERVERS = [
  { host: '213.232.235.181', user: 'root', pass: '4TVuj7qiHMfh7CxH6K!', role: 'MAIN' },
  { host: '187.77.111.203', user: 'root', pass: 'Z4-nN8JfiUIh5,;g', role: 'ATTACK_1' },
  { host: '45.93.137.164', user: 'root', pass: 'Z4-nN8JfiUIh5,;g', role: 'ATTACK_2' }
];

async function deployAndRun(server: typeof SERVERS[0]) {
  console.log(`\n🚀 [CLUSTER] Deploying to ${server.host} (${server.role})...`);
  
  try {
    await ssh.connect({
      host: server.host,
      username: server.user,
      password: server.pass
    });

    console.log(`✅ [${server.host}] Connected.`);

    // 1. Determine base path
    const remoteDir = server.role === 'MAIN' ? '/root/hydra' : '/var/www/escortvip';

    // 2. Create directory
    await ssh.execCommand(`mkdir -p ${remoteDir}`);

    // 3. Sync files (Simplified: sending critical scripts and .env)
    console.log(`📦 [${server.host}] Syncing critical assets...`);
    await ssh.putFile('c:/Users/onurk/esc/.env', `${remoteDir}/.env`);
    await ssh.putDirectory('c:/Users/onurk/esc/scripts', `${remoteDir}/scripts`, {
        recursive: true,
        concurrency: 10
    });
    await ssh.putDirectory('c:/Users/onurk/esc/lib', `${remoteDir}/lib`, {
        recursive: true,
        concurrency: 10
    });

    // 4. Install Dependencies & Run
    console.log(`🔥 [${server.host}] Triggering Attack...`);
    if (server.role === 'MAIN') {
        // Ana sunucuda build ve otonom hydra
        await ssh.execCommand(`cd ${remoteDir} && npm ci && npx prisma generate && npm run build && pm2 restart all`, { cwd: remoteDir });
        await ssh.execCommand(`cd ${remoteDir} && npx tsx scripts/hydra-conqueror.ts`, { cwd: remoteDir });
    } else {
        // Saldırı sunucularında swarm ateşle
        await ssh.execCommand(`cd ${remoteDir} && npx tsx scripts/god-mode-swarm.ts`, { cwd: remoteDir });
    }

    console.log(`🏁 [${server.host}] Deployment & Attack Initiated.`);
    ssh.dispose();
  } catch (err: any) {
    console.error(`❌ [${server.host}] Error:`, err.message);
  }
}

async function startGlobalSiege() {
  for (const server of SERVERS) {
    await deployAndRun(server);
  }
}

startGlobalSiege();
