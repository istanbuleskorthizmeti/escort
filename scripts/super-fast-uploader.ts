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

async function superFastUpload() {
  try {
    const zipFile = 'fast_bundle.zip';
    const localDir = process.cwd();

    console.log('⚡ [ULTRA-PACK] Shrinking project bundle to the bone...');
    
    // Using a more surgical exclusion list
    const excludeList = [
      'node_modules', '.next', '.git', 'out', '.tmp', 'temp',
      '*.exe', '*.dll', '*.node', '*.zip', '*.7z', '*.rar', '*.tar.gz', '*.tar',
      '*.mp4', '*.mov', '*.avi', 'backups', 'gbp_outputs', 'supabase', 'artifacts', '.gemini'
    ];

    const excludeStr = excludeList.map(e => `'${e}'`).join(', ');
    const zipCmd = `powershell "$files = Get-ChildItem -Path . -Exclude ${excludeStr}; Compress-Archive -Path $files -DestinationPath ${zipFile} -Force"`;
    
    execSync(zipCmd);
    
    const size = fs.statSync(zipFile).size / (1024 * 1024);
    console.log(`📏 [SIZE] Optimized bundle is ${size.toFixed(2)} MB.`);

    console.log('🔐 [CONNECTING] Connecting to server...');
    await ssh.connect(config);

    console.log('🚀 [UPLOADING] Firing optimized bundle to server...');
    await ssh.putFile(path.join(localDir, zipFile), `/root/${zipFile}`);

    console.log('🏗️ [UNPACKING] Extracting bundle on server...');
    await ssh.execCommand('mkdir -p /root/esc');
    await ssh.execCommand(`unzip -o /root/${zipFile} -d /root/esc`);
    await ssh.execCommand(`rm /root/${zipFile}`);

    console.log('🏁 [SUCCESS] Source code is synced. Ready for FINAL LAUNCH.');
    
    if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);
    ssh.dispose();
  } catch (e) {
    console.error('💥 [UPLOAD FAILED]', e);
    ssh.dispose();
  }
}

superFastUpload();
