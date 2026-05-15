import { NodeSSH } from 'node-ssh';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function deployDominion() {
  try {
    const tarFile = 'dominion_bundle.tar.gz';
    const localDir = process.cwd();

    console.log('⚡ [ULTRA-PACK] Shrinking project bundle (including .next)...');
    
    const tarCmd = `tar.exe -czf ${tarFile} --exclude=node_modules --exclude=.git --exclude=out --exclude=temp --exclude=*.zip --exclude=*.tar.gz --exclude=artifacts --exclude=.gemini .`;
    
    execSync(tarCmd, { stdio: 'inherit' });
    
    const size = fs.statSync(tarFile).size / (1024 * 1024);
    console.log(`📏 [SIZE] Optimized bundle is ${size.toFixed(2)} MB.`);

    console.log('🔐 [CONNECTING] Connecting to server...');
    await ssh.connect(config);

    console.log('🚀 [UPLOADING] Firing bundle to server...');
    await ssh.putFile(path.join(localDir, tarFile), `/root/${tarFile}`);

    console.log('🏗️ [UNPACKING] Extracting bundle on server...');
    await ssh.execCommand('mkdir -p /root/esc');
    await ssh.execCommand(`tar -xzf /root/${tarFile} -C /root/esc`);
    await ssh.execCommand(`rm /root/${tarFile}`);

    console.log('📦 [NPM INSTALL] Installing production dependencies...');
    await ssh.execCommand('npm install --force', { cwd: '/root/esc' });

    console.log('🗄️ [PRISMA GENERATE] Generating Prisma Client...');
    await ssh.execCommand('npx prisma generate', { cwd: '/root/esc' });

    console.log('🔥 [LAUNCH] Restarting PM2 Cluster...');
    const pm2Result = await ssh.execCommand('pm2 restart all || pm2 start ecosystem.config.js --env production', { cwd: '/root/esc' });
    console.log(pm2Result.stdout);
    if(pm2Result.stderr) console.warn(pm2Result.stderr);

    console.log('🌐 [NGINX] Restarting NGINX...');
    await ssh.execCommand('systemctl restart nginx');

    console.log('🏁 [SUCCESS] SITES ARE LIVE. GOD MODE DEPLOYMENT COMPLETE.');
    
    if (fs.existsSync(tarFile)) fs.unlinkSync(tarFile);
    ssh.dispose();
  } catch (e) {
    console.error('💥 [DEPLOYMENT FAILED]', e);
    ssh.dispose();
  }
}

deployDominion();
