import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to server.');

    // Check if swap already exists
    console.log('🔍 Checking current swap...');
    const checkRes = await ssh.execCommand('swapon --show');
    if (checkRes.stdout.trim() !== '') {
      console.log('⚠️ Swap is already enabled:', checkRes.stdout);
      ssh.dispose();
      return;
    }

    console.log('🛠️ Creating 4GB swap file...');
    await ssh.execCommand('fallocate -l 4G /swapfile');
    await ssh.execCommand('chmod 600 /swapfile');
    await ssh.execCommand('mkswap /swapfile');
    
    console.log('🚀 Activating swap file...');
    const swaponRes = await ssh.execCommand('swapon /swapfile');
    console.log(swaponRes.stdout || swaponRes.stderr);

    console.log('📊 Verifying new memory state...');
    const freeRes = await ssh.execCommand('free -h');
    console.log(freeRes.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Error:', err);
    ssh.dispose();
  }
}

run();
