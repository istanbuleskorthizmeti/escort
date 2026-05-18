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
    
    console.log('🔄 Restarting PostgreSQL service to clear connection pool saturation...');
    const result = await ssh.execCommand('systemctl restart postgresql');
    console.log(result.stdout || result.stderr || '✅ PostgreSQL restarted successfully.');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
