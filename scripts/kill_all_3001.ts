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
    
    console.log('📡 [FIND PORT 3001] Finding PID occupying port 3001...');
    // Use fuser or lsof or ss to find and kill the process occupying port 3001
    const checkRes = await ssh.execCommand('fuser 3001/tcp');
    console.log('Fuser output:', checkRes.stdout || checkRes.stderr || 'No fuser output');

    console.log('💥 [FORCE KILL] Force killing any process on port 3001...');
    await ssh.execCommand('fuser -k 3001/tcp || true');
    await ssh.execCommand('kill -9 $(lsof -t -i:3001) || true');

    console.log('🔄 [PM2 RESTART] Restarting PM2 web cluster...');
    const restartRes = await ssh.execCommand('pm2 restart drkcnay-web-cluster');
    console.log(restartRes.stdout || restartRes.stderr || 'PM2 restarted.');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
