import { NodeSSH } from 'node-ssh';
import path from 'path';
import fs from 'fs';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function uploadAllKeys() {
  try {
    console.log('🚀 [UPLOAD KEYS] Connecting to VPS...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    const localFiles = fs.readdirSync(process.cwd());
    const keyFiles = localFiles.filter(f => 
      f.endsWith('.json') && 
      (f.startsWith('google-key') || f.startsWith('hydra-gcp') || f.startsWith('sovereign-spyy'))
    );

    console.log(`🔍 Found ${keyFiles.length} local key files:`, keyFiles);

    for (const keyFile of keyFiles) {
      const localPath = path.join(process.cwd(), keyFile);
      const remotePath = `/root/esc/${keyFile}`;
      
      console.log(`📤 Uploading ${keyFile} -> ${remotePath}...`);
      await ssh.putFile(localPath, remotePath);
      console.log(`✅ Uploaded ${keyFile} successfully.`);
    }

    ssh.dispose();
    console.log('🏁 [COMPLETED] All Google service account keys deployed to VPS.');
  } catch (err: any) {
    console.error('💥 Error uploading keys:', err.message);
    ssh.dispose();
  }
}

uploadAllKeys();
