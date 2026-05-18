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
    
    console.log('💾 Optimizing DATABASE_URL connection limit in remote .env...');
    const result = await ssh.execCommand("sed -i 's|DATABASE_URL=.*|DATABASE_URL=\"postgresql://vuc2026_user:vuc2026_pass@localhost:5432/vuc2026?sslmode=disable\\&connection_limit=3\"|g' /root/esc/.env");
    console.log(result.stdout || result.stderr || '✅ Remote .env optimized.');

    console.log('🔄 Restarting PM2 processes to apply environment change...');
    await ssh.execCommand('pm2 restart all');
    console.log('✅ PM2 restarted.');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
