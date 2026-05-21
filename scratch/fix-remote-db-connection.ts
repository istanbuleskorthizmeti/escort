import { NodeSSH } from 'node-ssh';

async function run() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('📡 SSH Connected.');
    
    // 1. Back up the remote .env file
    console.log('📦 Backing up remote .env...');
    await ssh.execCommand('cp /root/esc/.env /root/esc/.env.bak');

    // 2. Perform replacement in .env on server
    console.log('🔧 Updating DATABASE_URL to 127.0.0.1...');
    const sedResult = await ssh.execCommand(
      "sed -i 's/213.232.235.181:5432/127.0.0.1:5432/g' /root/esc/.env"
    );
    console.log('Sed Status:', sedResult.stdout || 'Done');

    // 3. Verify .env modification
    const envCheck = await ssh.execCommand('grep DATABASE_URL /root/esc/.env');
    console.log('New DATABASE_URL:', envCheck.stdout);

    // 4. Restart the PM2 cluster to load new environment variables
    console.log('🔄 Restarting PM2 app "drkcnay-web-cluster"...');
    const restartResult = await ssh.execCommand('pm2 restart drkcnay-web-cluster --update-env');
    console.log('PM2 Restart Status:\n', restartResult.stdout || restartResult.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ SSH Operation Failed:', err.message);
  }
}

run();
