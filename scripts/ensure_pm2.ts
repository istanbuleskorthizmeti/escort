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
    
    console.log('📡 [PM2 LIST] Checking live status...');
    const listRes = await ssh.execCommand('pm2 list');
    console.log(listRes.stdout || listRes.stderr || 'No list response');

    console.log('📡 [PM2 RESTART ALL] Activating all processes...');
    const restartRes = await ssh.execCommand('pm2 start ecosystem.config.js || pm2 restart all');
    console.log(restartRes.stdout || restartRes.stderr || 'No restart response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
