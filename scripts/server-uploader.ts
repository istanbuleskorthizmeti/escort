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

async function uploadProject() {
  try {
    const zipFile = 'project_bundle.zip';
    const localDir = process.cwd();

    console.log('📦 [PACKAGING] Creating project bundle (robust exclusion)...');
    const zipCmd = `powershell "$files = Get-ChildItem -Path . -Exclude node_modules, .next, .git, out, *.zip; Compress-Archive -Path $files -DestinationPath ${zipFile} -Update"`;
    execSync(zipCmd);
    
    console.log('🔐 [CONNECTING] Connecting to server...');
    await ssh.connect(config);

    console.log('🛰️ [UPLOADING] Sending bundle to server...');
    await ssh.putFile(path.join(localDir, zipFile), `/root/${zipFile}`);

    console.log('🏗️ [UNPACKING] Extracting bundle on server...');
    await ssh.execCommand(`unzip -o /root/${zipFile} -d /root/esc`);
    await ssh.execCommand(`rm /root/${zipFile}`);

    console.log('🏁 [UPLOAD COMPLETE] Source code is synced and unpacked.');
    
    // Clean up local zip
    if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);
    
    ssh.dispose();
  } catch (e) {
    console.error('💥 [UPLOAD FAILED]', e);
    ssh.dispose();
  }
}

uploadProject();
