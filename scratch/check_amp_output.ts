import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkAMP() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- CURL AMP PAGE ---');
    const resAmp = await ssh.execCommand(
      'curl -i -H "Host: istanbulescort.blog" "http://127.0.0.1/amp?loc=sariyer"'
    );
    console.log(resAmp.stdout.substring(0, 1500));

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkAMP();
