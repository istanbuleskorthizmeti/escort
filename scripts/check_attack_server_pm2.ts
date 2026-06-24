import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to secondary attack server.');
    
    console.log('📡 Listing active PM2 daemons on the secondary attack server...');
    const result = await ssh.execCommand('pm2 list');
    console.log(result.stdout || result.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error connecting to secondary server:', err);
    ssh.dispose();
  }
}

run();
