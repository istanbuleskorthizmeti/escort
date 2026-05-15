import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function uploadTarball() {
  try {
    const file = 'test_bundle.tar.gz';
    const localPath = path.join(process.cwd(), file);
    
    console.log('🔐 [CONNECTING] Connecting to server...');
    await ssh.connect(config);

    console.log('🚀 [UPLOADING] Firing 155MB optimized tarball to server...');
    await ssh.putFile(localPath, `/root/${file}`);

    console.log('🏗️ [UNPACKING] Extracting tarball on server...');
    await ssh.execCommand('mkdir -p /root/esc');
    await ssh.execCommand(`tar -xzf /root/${file} -C /root/esc`);
    
    // Clean up server
    await ssh.execCommand(`rm /root/${file}`);

    console.log('🏁 [SUCCESS] Source code is synced. Ready for FINAL LAUNCH.');
    ssh.dispose();
  } catch (e) {
    console.error('💥 [UPLOAD FAILED]', e);
    ssh.dispose();
  }
}

uploadTarball();
