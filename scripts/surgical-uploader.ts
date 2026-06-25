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

async function surgicalUpload() {
  try {
    const zipFile = 'surgical_bundle.zip';
    const localDir = process.cwd();

    console.log('🏗️ [SURGICAL] Preparing clean bundle...');
    const foldersToCopy = ['app', 'components', 'config', 'lib', 'prisma', 'scripts'];
    const filesToCopy = [
      'package.json', 'package-lock.json', 'tsconfig.json', 
      'next.config.ts', 'middleware.ts', 'ecosystem.config.js', 
      'tailwind.config.ts', 'postcss.config.js', 'google-key.json'
    ];

    const items = [...foldersToCopy, ...filesToCopy].filter(i => fs.existsSync(i));
    console.log(`📦 Items to zip: ${items.join(', ')}`);

    console.log('📦 [PACKAGING] Zipping...');
    const itemsStr = items.join(', ');
    execSync(`powershell "Compress-Archive -Path ${itemsStr} -DestinationPath ${zipFile} -Force"`);
    
    const size = fs.statSync(zipFile).size / (1024 * 1024);
    console.log(`📏 [SIZE] Bundle is ${size.toFixed(2)} MB.`);

    console.log('🔐 [CONNECTING] Connecting to server...');
    await ssh.connect(config);

    console.log('🚀 [UPLOADING] Sending to server...');
    await ssh.putFile(path.join(localDir, zipFile), `/root/${zipFile}`);

    console.log('🏗️ [UNPACKING] Extracting...');
    await ssh.execCommand('rm -rf /root/esc && mkdir -p /root/esc');
    await ssh.execCommand(`unzip -o /root/${zipFile} -d /root/esc`);
    await ssh.execCommand(`rm /root/${zipFile}`);

    console.log('🏁 [SUCCESS] Code synced.');
    
    if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);
    ssh.dispose();
  } catch (e) {
    console.error('💥 [UPLOAD FAILED]', e);
    ssh.dispose();
  }
}

surgicalUpload();
