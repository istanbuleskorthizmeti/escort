import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function testLiveRequest() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('🧹 Flushing PM2 logs...');
    await ssh.execCommand('pm2 flush');

    console.log('\n--- CURL HOME PAGE ---');
    const resHome = await ssh.execCommand(
      'curl -I -H "Host: istanbulescort.blog" http://127.0.0.1/'
    );
    console.log(resHome.stdout || resHome.stderr);

    console.log('\n--- CURL DYNAMIC DISTRICT PAGE ---');
    const resDistrict = await ssh.execCommand(
      'curl -I -H "Host: istanbulescort.blog" http://127.0.0.1/istanbul-sariyer'
    );
    console.log(resDistrict.stdout || resDistrict.stderr);

    console.log('\n--- PM2 ERROR LOGS AFTER REQUESTS ---');
    const logsRes = await ssh.execCommand('pm2 logs drkcnay-web-cluster --lines 50 --err --nostream');
    console.log(logsRes.stdout || logsRes.stderr || 'No error logs.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

testLiveRequest();
