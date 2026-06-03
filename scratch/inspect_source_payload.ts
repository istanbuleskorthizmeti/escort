import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function inspectSource() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- LS -LA /root/esc/.pm2 ---');
    const pm2Res = await ssh.execCommand('ls -la /root/esc/.pm2');
    console.log(pm2Res.stdout || pm2Res.stderr);

    console.log('\n--- LS -LA /root/ ---');
    const rootRes = await ssh.execCommand('ls -la /root/');
    console.log(rootRes.stdout || rootRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

inspectSource();
