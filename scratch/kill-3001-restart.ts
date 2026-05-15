import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function killPort3001() {
  console.log('🔫 [KILL-3001] Nuking anything on port 3001...');

  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    // Kill process on 3001
    await ssh.execCommand('fuser -k 3001/tcp || true');
    console.log('✅ Port 3001 cleared.');

    console.log('🚀 Starting hydra-web...');
    await ssh.execCommand('pm2 start npm --name "hydra-web" --cwd /root/hydra -- start -- -p 3001');

    console.log('🏁 Verification...');
    await new Promise(r => setTimeout(r, 5000));
    const netstat = await ssh.execCommand('netstat -tulpn | grep 3001');
    console.log(netstat.stdout || '❌ Still not listening!');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 FAILURE:', err.message);
  }
}

killPort3001();
