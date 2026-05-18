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
    
    console.log('🛑 [EMERGENCY] Stopping and deleting telegram-blast task from PM2 immediately...');
    await ssh.execCommand('pm2 stop telegram-blast || true');
    await ssh.execCommand('pm2 delete telegram-blast || true');
    await ssh.execCommand('pm2 save');
    console.log('✅ Visual SEO Blast completely disabled.');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
