import { connectSSH } from './lib/ssh-helper';

async function run() {
  console.log('🔌 [SSH] Connecting to VPS...');
  let ssh;
  try {
    ssh = await connectSSH();
    console.log('✅ [SSH] Connected successfully!');
    
    const path = require('path');
    const localScript = path.resolve(__dirname, 'fleet-gsc-automation.ts');
    console.log(`🚀 [SSH] Syncing latest ${path.basename(localScript)} to VPS...`);
    await ssh.putFile(localScript, '/root/esc/scripts/fleet-gsc-automation.ts');

    console.log('🚀 [SSH] Running Fleet GSC/Index Automation on VPS...');
    const result = await ssh.execCommand('export $(grep -v \'^#\' /var/www/escortvip/.env | xargs) && npx tsx scripts/fleet-gsc-automation.ts', {
      cwd: '/root/esc'
    });
    
    console.log('\n================ OUTPUT FROM VPS ================');
    console.log(result.stdout);
    if (result.stderr) {
      console.warn('\n================ STDERR FROM VPS ================');
      console.warn(result.stderr);
    }
    console.log('=================================================');
    console.log('🏁 [SUCCESS] VPS Command Execution Complete.');
  } catch (err: any) {
    console.error('💥 [ERROR] Failed to run SSH command:', err.message);
  } finally {
    if (ssh) {
      ssh.dispose();
    }
  }
}

run();
