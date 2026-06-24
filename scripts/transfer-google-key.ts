import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const oldSsh = new NodeSSH();
const newSsh = new NodeSSH();

async function run() {
  const localTempPath = path.join(process.cwd(), 'google-key.json');
  try {
    // 1. Connect to old server and download the key
    console.log('🔐 Connecting to OLD server...');
    await oldSsh.connect({
      host: '31.97.79.34',
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('📥 Downloading google-key.json from old server...');
    await oldSsh.getFile(localTempPath, '/var/www/escortvip/google-key.json');
    console.log('✅ Downloaded locally.');

    // Verify local file exists
    if (!fs.existsSync(localTempPath)) {
      throw new Error('Key file was not downloaded successfully!');
    }

    // 2. Connect to new server and upload the key
    console.log('🔐 Connecting to NEW server...');
    await newSsh.connect({
      host: '31.97.79.34',
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('📤 Uploading google-key.json to new server...');
    await newSsh.putFile(localTempPath, '/var/www/escortvip/google-key.json');
    console.log('✅ Uploaded to /var/www/escortvip/google-key.json.');

    // Clean up local temp file
    if (fs.existsSync(localTempPath)) {
      fs.unlinkSync(localTempPath);
      console.log('🧹 Cleaned up local temp key.');
    }

    // 3. Rebuild Next.js app to remove build warnings and enable indexing
    console.log('🏗️ Rebuilding Next.js on the new server...');
    const buildRes = await newSsh.execCommand('npm run build', { cwd: '/var/www/escortvip' });
    console.log('=== BUILD CODE ===', buildRes.code);
    console.log(buildRes.stdout || buildRes.stderr);

    // 4. Restart PM2
    console.log('🔄 Restarting esc-live PM2 process...');
    const restartRes = await newSsh.execCommand('pm2 restart esc-live');
    console.log(restartRes.stdout || restartRes.stderr);

  } catch (err: any) {
    console.error('❌ Error during transfer:', err.message);
  } finally {
    oldSsh.dispose();
    newSsh.dispose();
  }
}
run();
