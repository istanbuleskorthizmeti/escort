import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function testDistrict() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- CURL /istanbul/esenyurt ---');
    const res = await ssh.execCommand(
      'curl -I -H "Host: istanbulescort.blog" "http://127.0.0.1/istanbul/esenyurt"'
    );
    console.log(res.stdout || res.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

testDistrict();
