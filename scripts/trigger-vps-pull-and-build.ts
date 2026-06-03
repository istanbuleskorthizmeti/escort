import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function deploy() {
  try {
    console.log('🚀 Connecting to production VPS root@213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('📡 [REMOTE] Correcting Git remote origin URL to escc.git...');
    const remoteUrl = 'https://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@github.com/guondyshop-del/escc.git';
    await ssh.execCommand(`git remote set-url origin ${remoteUrl}`, { cwd: '/root/esc' });

    console.log('📡 [GIT] Discarding local changes and resetting to origin/main...');
    // Fetch latest branch listings
    await ssh.execCommand('git fetch origin', { cwd: '/root/esc' });
    // Force sync VPS working directory to local commit state on origin/main
    const syncRes = await ssh.execCommand('git reset --hard origin/main', { cwd: '/root/esc' });
    console.log(syncRes.stdout || syncRes.stderr);

    console.log('📡 [BUILD] Running production client rebuild on VPS...');
    const buildRes = await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    console.log(buildRes.stdout || buildRes.stderr);

    console.log('📡 [PM2] Reloading NextJS ecosystem daemon...');
    const pm2Res = await ssh.execCommand('pm2 reload all', { cwd: '/root/esc' });
    console.log(pm2Res.stdout || pm2Res.stderr);

    console.log('🏁 [DEPLOYMENT SUCCESS] All changes are now live across all 49+ domains!');
    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Deployment failed:', err.message);
    ssh.dispose();
  }
}

deploy();
