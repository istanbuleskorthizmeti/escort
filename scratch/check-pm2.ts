import { NodeSSH } from 'node-ssh';

async function run() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('📡 SSH Connected.');
    
    console.log('--- PM2 LOGS FOR HYDRA-WEB ---');
    const logs = await ssh.execCommand('pm2 logs --lines 100 --nostream');
    console.log(logs.stdout || logs.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ SSH Failed:', err.message);
  }
}

run();
