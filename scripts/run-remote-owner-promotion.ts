import { NodeSSH } from 'node-ssh';
import { getSSHConfig } from './lib/ssh-helper';
import path from 'path';

const ssh = new NodeSSH();
const config = getSSHConfig();

async function run() {
  try {
    console.log(`🚀 Connecting to VPS at ${config.host} for owner delegation...`);
    await ssh.connect(config);
    console.log('✅ Connected.');

    const localScript = path.join(process.cwd(), 'scripts', 'promote-owners-via-site-verification.ts');
    const remoteScript = '/root/esc/scripts/promote-owners-via-site-verification.ts';

    console.log('📤 Uploading promotion script...');
    await ssh.putFile(localScript, remoteScript);
    await ssh.putFile(localScript, '/root/esc/dist/scripts/promote-owners-via-site-verification.ts');
    console.log('✅ Script uploaded.');

    console.log('⚡ Executing owner promotion script on VPS...');
    const result = await ssh.execCommand('npx tsx scripts/promote-owners-via-site-verification.ts', {
      cwd: '/root/esc'
    });

    console.log('\n--- VPS EXECUTION OUTPUT ---');
    console.log(result.stdout || 'No output.');
    if (result.stderr) {
      console.error('\n--- VPS EXECUTION ERRORS ---');
      console.error(result.stderr);
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ Failed:', err.message);
    ssh.dispose();
  }
}

run();
