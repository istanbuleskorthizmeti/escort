import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function restartPm2() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('🗑️ Deleting drkcnay-web-cluster PM2 process...');
    await ssh.execCommand('pm2 delete drkcnay-web-cluster');

    console.log('🚀 Starting drkcnay-web-cluster from ecosystem.config.js...');
    const startRes = await ssh.execCommand('pm2 start ecosystem.config.js --env production', { cwd: '/root/esc' });
    console.log(startRes.stdout || startRes.stderr);

    console.log('⏳ Waiting 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('\n--- VERIFYING NEW DATABASE_URL IN PM2 ---');
    // Get list of process ids and check env of the first cluster instance
    const statusRes = await ssh.execCommand('pm2 status');
    console.log(statusRes.stdout);
    
    // Find PID from status
    const envRes = await ssh.execCommand('pm2 env drkcnay-web-cluster');
    if (envRes.stdout.includes('127.0.0.1')) {
      console.log('✅ DATABASE_URL successfully updated to 127.0.0.1 in PM2!');
    } else {
      console.log('❌ DATABASE_URL still has public IP or is missing!');
      console.log(envRes.stdout.substring(0, 1000));
    }

    console.log('\n--- CURL DYNAMIC DISTRICT PAGE VIA LOCAL NGINX ---');
    const curlRes = await ssh.execCommand(
      'curl -I -H "Host: istanbulescort.blog" http://127.0.0.1/istanbul/esenyurt-escort-gercek-gorseller'
    );
    console.log(curlRes.stdout || curlRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

restartPm2();
