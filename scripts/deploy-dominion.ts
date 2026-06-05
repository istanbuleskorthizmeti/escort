import { NodeSSH } from 'node-ssh';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  port: 22,
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function deployDominion() {
  try {
    const tarFile = 'dominion_bundle.tar.gz';
    const localDir = process.cwd();

    console.log('⚡ [ULTRA-PACK] Shrinking project bundle (including .next)...');
    
    const tarCmd = `tar.exe -czf ${tarFile} --exclude=.next --exclude=node_modules --exclude=.git --exclude=out --exclude=temp --exclude=*.zip --exclude=*.tar.gz --exclude=artifacts --exclude=.gemini --exclude=scratch --exclude=dominion_bundle.tar.gz --exclude=fast_bundle.zip --exclude=public.tar.gz --exclude=src_bundle.tar.gz --exclude=test_bundle.tar.gz --exclude=mini_src.tar.gz --exclude=hydra_build.tar.gz --exclude=chunk_0.part --exclude=chunk_1.part .`;
    
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

    console.log('🛑 [PM2 STOP] Stopping PM2 to free up memory for build...');
    await ssh.execCommand('pm2 stop all', { cwd: '/root/esc' });

    console.log('⚙️ [BUILD] Building Next.js production bundle...');
    const buildResult = await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    console.log(buildResult.stdout);
    if(buildResult.stderr) console.warn(buildResult.stderr);

    console.log('🔗 [PRISMA GENERATE] Generating Prisma Client...');
    await ssh.execCommand('npx prisma generate', { cwd: '/root/esc' });

    console.log('🚀 [LAUNCH] Restarting PM2 Cluster...');
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
