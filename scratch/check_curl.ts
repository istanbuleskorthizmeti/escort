import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function testFinalRender() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- CURLING DYNAMIC PATH ON istanbulescdrkcn.com HOST ---');
    const curlRes = await ssh.execCommand(
      'curl -I -H "Host: istanbulescdrkcn.com" http://127.0.0.1/istanbul/esenyurt-escort-gercek-gorseller'
    );
    console.log(curlRes.stdout || curlRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Test failed:', err);
    ssh.dispose();
  }
}

testFinalRender();
