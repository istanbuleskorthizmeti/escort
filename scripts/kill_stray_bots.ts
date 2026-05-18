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
    console.log('✅ Connected.');
    
    console.log('📡 Checking for running node processes that contain telegram-master...');
    const psRes = await ssh.execCommand('ps aux | grep -i "telegram-master" | grep -v "grep"');
    console.log(psRes.stdout || 'No stray processes found.');

    if (psRes.stdout) {
      console.log('🛑 Killing stray telegram-master processes to resolve 409 conflict...');
      // Kill all matching processes except PM2 managed ones if possible, or just kill all non-PM2 stray node processes
      await ssh.execCommand('pkill -f "telegram-master.js" || true');
      await ssh.execCommand('pkill -f "telegram-master.ts" || true');
      console.log('✅ Stray processes terminated.');
    }

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
