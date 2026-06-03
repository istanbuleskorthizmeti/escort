import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function buildWithSystemdRun() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- 1. CLEANING .NEXT CACHE ---');
    await ssh.execCommand('rm -rf /root/esc/.next');

    console.log('\n--- 2. LAUNCHING BUILD VIA SYSTEMD-RUN (TO PREVENT SSH SESSION KILLING) ---');
    // Using systemd-run creates a system service scope that has higher limits and won't get killed by terminal session dropouts
    const buildRes = await ssh.execCommand(
      'systemd-run --scope -p MemoryMax=8G -p CPUWeight=100 npx next build',
      {
        cwd: '/root/esc',
        env: {
          NODE_ENV: 'production',
          NODE_OPTIONS: '--max-old-space-size=4096'
        }
      }
    );
    console.log('STDOUT:');
    console.log(buildRes.stdout);
    console.log('STDERR:');
    console.log(buildRes.stderr);

    console.log('\n--- 3. RESTARTING PM2 PROCESSES ---');
    await ssh.execCommand('pm2 restart all || pm2 start ecosystem.config.js --env production', { cwd: '/root/esc' });

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

buildWithSystemdRun();
