import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function diagnose() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- REMOTE ECOSYSTEM.CONFIG.JS ---');
    const ecoJs = await ssh.execCommand('cat /root/esc/ecosystem.config.js');
    console.log(ecoJs.stdout || 'No ecosystem.config.js found.');

    console.log('\n--- REMOTE ECOSYSTEM.CONFIG.CJS ---');
    const ecoCjs = await ssh.execCommand('cat /root/esc/ecosystem.config.cjs');
    console.log(ecoCjs.stdout || 'No ecosystem.config.cjs found.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Diagnostic script failed:', err);
    ssh.dispose();
  }
}

diagnose();
