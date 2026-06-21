import { NodeSSH } from 'node-ssh';
import { getSSHConfig } from './lib/ssh-helper';

const ssh = new NodeSSH();
const config = getSSHConfig();

async function remediateAndBoost() {
  try {
    console.log('🚀 [REMEDIATION] Connecting to Alexhost root@187.77.111.203...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    // 1. Manually trigger the indexing sniper right now to update DB stats
    console.log('📡 [EXEC] Force starting hydra-auto-index to fetch live GSC rankings...');
    const startRes = await ssh.execCommand('pm2 start hydra-auto-index');
    console.log('PM2 Start:', startRes.stdout || startRes.stderr);

    console.log('📡 [EXEC] Running indexing sniper manually to force database update...');
    const runRes = await ssh.execCommand('npx tsx scripts/master/indexing-sniper.ts', { cwd: '/root/esc' });
    console.log('Sniper Output:', runRes.stdout || runRes.stderr);

    // 3. Ensure all PM2 services are running stable
    console.log('🔄 [EXEC] Verifying PM2 cluster status...');
    const listRes = await ssh.execCommand('pm2 list');
    console.log(listRes.stdout);

    // 4. Fire the consolidated dashboard report again to Telegram
    console.log('📊 [EXEC] Re-running Consolidated Master Operational Report...');
    const reportRes = await ssh.execCommand('node scripts/master-consolidated-report.js', { cwd: '/root/esc' });
    console.log('Report Output:', reportRes.stdout || reportRes.stderr);

    ssh.dispose();
  } catch (err: unknown) {
    console.error('💥 Error in remediation run:', err instanceof Error ? err.message : err);
    ssh.dispose();
  }
}

remediateAndBoost();
