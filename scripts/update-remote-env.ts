import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function updateRemoteEnv() {
  try {
    console.log('🚀 [ENV MOD] Connecting to root@213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // 1. Execute sed to correct the model name
    console.log('📡 [SED] Replacing gemini-2.5-flash with gemini-2.0-flash in production .env...');
    const sedRes = await ssh.execCommand("sed -i 's/gemini-2.5-flash/gemini-2.0-flash/g' /root/esc/.env");
    console.log('Sed Status:', sedRes.code === 0 ? 'SUCCESS' : 'FAILED');

    // 2. Restart hydra-all-out-war so it re-reads the updated .env
    console.log('🔄 [RESTART] Restarting hydra-all-out-war to apply Gemini update...');
    await ssh.execCommand('pm2 restart hydra-all-out-war');

    ssh.dispose();
    console.log('🏁 [SUCCESS] Production env patched and war engine restarted!');
  } catch (err: any) {
    console.error('💥 Error patching remote env:', err.message);
    ssh.dispose();
  }
}

updateRemoteEnv();
