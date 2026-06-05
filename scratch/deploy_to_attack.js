const { NodeSSH } = require('node-ssh');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    const zipFile = 'attack_web_bundle.zip';
    const localDir = process.cwd();

    console.log('🏗️ [DEPOSIT] Packaging local updates for Attack Server Web Portal...');
    const foldersToCopy = ['app', 'components', 'config', 'lib', 'prisma', 'scripts'];
    const filesToCopy = [
      'package.json', 'package-lock.json', 'tsconfig.json', 
      'next.config.ts', 'middleware.ts', 'postcss.config.js', 'google-key.json'
    ];

    const items = [...foldersToCopy, ...filesToCopy].filter(i => fs.existsSync(i));
    console.log(`📦 Items to bundle: ${items.join(', ')}`);

    console.log('📦 [COMPRESSING] Creating archive...');
    const itemsStr = items.join(' ');
    execSync(`tar -czf ${zipFile} ${itemsStr}`);
    
    const size = fs.statSync(zipFile).size / (1024 * 1024);
    console.log(`📏 [SIZE] Payload size: ${size.toFixed(2)} MB.`);

    console.log('🔐 [CONNECTING] Connecting to root@187.77.111.203...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('🚀 [UPLOADING] Transporting payload to server...');
    await ssh.putFile(path.join(localDir, zipFile), `/var/www/${zipFile}`);

    console.log('🏗️ [UNPACKING] Extracting payload into /var/www/escortvip...');
    // We unpack directly into /var/www/escortvip, overwrite existing files
    await ssh.execCommand(`tar -xzf /var/www/${zipFile} -C /var/www/escortvip`);
    await ssh.execCommand(`rm /var/www/${zipFile}`);
    console.log('✅ Extraction complete.');

    console.log('🔗 [PRISMA] Regenerating client on Attack Server...');
    const prismaRes = await ssh.execCommand('npx prisma generate', { cwd: '/var/www/escortvip' });
    console.log(prismaRes.stdout || prismaRes.stderr);

    console.log('🏁 [SUCCESS] Code synchronized to Attack Server. Cleaning up local archive...');
    if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);
    
    ssh.dispose();
  } catch (e) {
    console.error('💥 [DEPLOYMENT TO ATTACK SERVER FAILED]', e);
    ssh.dispose();
  }
}

run();
