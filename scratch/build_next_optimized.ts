import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function buildNext() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- 1. CLEANING APP DIR ---');
    await ssh.execCommand('rm -rf /root/esc/.next');

    console.log('\n--- 2. RUNNING NEXT BUILD WITH SYSTEM ENVIRONMENT SWAP ---');
    // Using --max-old-space-size=2048 to prevent memory limits
    const buildRes = await ssh.execCommand('npx next build', {
      cwd: '/root/esc',
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=2048',
        DISABLE_ESLINT: 'true',
        DISABLE_TYPESCRIPT: 'true'
      }
    });
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

buildNext();
