const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  const tarFile = 'dominion_bundle.tar.gz';
  const remoteHost = '213.232.235.181';
  const remotePort = 2222;

  try {
    console.log('⚡ [1/7] Creating optimized local bundle...');
    if (fs.existsSync(tarFile)) fs.unlinkSync(tarFile);
    
    // Explicitly exclude .next/cache and other huge build artifacts, and limit size
    const tarCmd = `tar.exe -czf ${tarFile} --exclude=.next --exclude=node_modules --exclude=.git --exclude=out --exclude=temp --exclude=*.zip --exclude=*.tar.gz --exclude=artifacts --exclude=.gemini --exclude=public --exclude=prisma/dev.db .`;
    execSync(tarCmd, { stdio: 'inherit' });

    const size = fs.statSync(tarFile).size / (1024 * 1024);
    console.log(`📏 [SIZE] Bundle size: ${size.toFixed(2)} MB.`);

    console.log('🚀 [2/7] Uploading bundle using SCP...');
    const scpCmd = `scp -P ${remotePort} -o StrictHostKeyChecking=no ${tarFile} root@${remoteHost}:/root/${tarFile}`;
    execSync(scpCmd, { stdio: 'inherit' });

    console.log('🏗️ [3/7] Extracting bundle on remote server...');
    const remoteCmds = [
      'mkdir -p /root/esc',
      `tar -xzf /root/${tarFile} -C /root/esc`,
      `rm -f /root/${tarFile}`,
      'cd /root/esc && npm install --force',
      'pm2 stop all || true',
      'cd /root/esc && npm run build',
      'cd /root/esc && npx prisma generate',
      'pm2 restart all || (cd /root/esc && pm2 start ecosystem.config.js --env production)',
      'systemctl restart nginx'
    ];

    console.log('⚙️ [4/7] Running remote commands (install, build, launch)...');
    for (const cmd of remoteCmds) {
      console.log(`Executing remote: ${cmd}`);
      const sshCmd = `ssh -p ${remotePort} -o StrictHostKeyChecking=no root@${remoteHost} "${cmd.replace(/"/g, '\\"')}"`;
      execSync(sshCmd, { stdio: 'inherit' });
    }

    console.log('🧹 [5/7] Cleaning up local tar file...');
    if (fs.existsSync(tarFile)) fs.unlinkSync(tarFile);

    console.log('🏁 [SUCCESS] DEPLOYMENT COMPLETE. HYDRA RESTORED!');
  } catch (err) {
    console.error('💥 [DEPLOYMENT FAILED]', err);
    if (fs.existsSync(tarFile)) fs.unlinkSync(tarFile);
  }
}

main();
