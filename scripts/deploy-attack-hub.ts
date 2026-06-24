
import { NodeSSH } from 'node-ssh';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function deployAttackHub() {
  try {
    const tarFile = 'attack_hub_payload.tar.gz';
    const localDir = process.cwd();

    console.log('⚔️ [ATTACK-HUB] Preparing Warfare Payload...');
    
    // Bundle essential warfare directories
    const tarCmd = `tar.exe -czf ${tarFile} --exclude=.next --exclude=node_modules --exclude=.git --exclude=out --exclude=temp --exclude=*.zip --exclude=*.tar.gz --exclude=artifacts --exclude=.gemini .`;
    execSync(tarCmd, { stdio: 'inherit' });
    
    console.log('🔐 [CONNECTING] Accessing Attack Hub...');
    await ssh.connect(config);

    console.log('🚀 [UPLOADING] Deploying Hydra Arsenal...');
    await ssh.putFile(path.join(localDir, tarFile), `/root/${tarFile}`);

    console.log('🏗️ [UNPACKING] Expanding Hydra Network...');
    await ssh.execCommand('mkdir -p /root/hydra');
    await ssh.execCommand(`tar -xzf /root/${tarFile} -C /root/hydra`);
    await ssh.execCommand(`rm /root/${tarFile}`);

    console.log('📦 [NPM] Installing Offensive Tools...');
    await ssh.execCommand('npm install --force', { cwd: '/root/hydra' });

    console.log('🔗 [PRISMA] Synchronizing Intelligence DB...');
    await ssh.execCommand('npx prisma generate', { cwd: '/root/hydra' });

    console.log('🔥 [WARFARE] Starting All-Out War script in background...');
    await ssh.execCommand('pm2 stop hydra-war || true', { cwd: '/root/hydra' });
    await ssh.execCommand('pm2 start npx --name "hydra-war" -- tsx scripts/hydra-all-out-war.ts', { cwd: '/root/hydra' });

    console.log('🏁 [SUCCESS] ATTACK HUB IS NOW OPERATIONAL. BACKLINK BOMBING STARTED.');
    
    if (fs.existsSync(tarFile)) fs.unlinkSync(tarFile);
    ssh.dispose();
  } catch (e) {
    console.error('💥 [ATTACK-HUB FAILED]', e);
    ssh.dispose();
  }
}

deployAttackHub();
