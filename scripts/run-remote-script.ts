import { NodeSSH } from 'node-ssh';
import * as path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function main() {
  const localFileName = process.argv[2];
  if (!localFileName) {
    console.error('Usage: npx tsx scripts/run-remote-script.ts <scratch-file-name>');
    process.exit(1);
  }

  const localPath = path.resolve(localFileName);
  const remotePath = `/root/esc/scratch/${path.basename(localFileName)}`;

  try {
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log(`📤 Uploading ${localFileName} to VPS...`);
    await ssh.putFile(localPath, remotePath);
    console.log('✅ Uploaded.');

    console.log(`🚀 Executing script on VPS...`);
    const result = await ssh.execCommand(`npx tsx ${remotePath}`, { cwd: '/root/esc' });
    
    console.log('\n--- OUTPUT ---');
    console.log(result.stdout);
    if (result.stderr) {
      console.error('--- ERROR ---');
      console.error(result.stderr);
    }
  } catch (err) {
    console.error('❌ SSH/Execution error:', err);
  } finally {
    ssh.dispose();
  }
}

main();
