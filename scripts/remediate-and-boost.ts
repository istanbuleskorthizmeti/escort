import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function remediateAndBoost() {
  try {
    console.log('🚀 [REMEDIATION] Connecting to Alexhost root@213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    // 1. Manually trigger the indexing sniper right now to update DB stats
    console.log('📡 [EXEC] Force starting hydra-auto-index to fetch live GSC rankings...');
    const startRes = await ssh.execCommand('pm2 start hydra-auto-index');
    console.log('PM2 Start:', startRes.stdout || startRes.stderr);

    // 2. Also run the indexing sniper script in the foreground/background just to be sure it executes
    console.log('📡 [EXEC] Running indexing sniper manually to force database update...');
    const runRes = await ssh.execCommand('node -r dotenv/config dist_scripts/scripts/master/indexing-sniper.js', { cwd: '/root/esc' });
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
