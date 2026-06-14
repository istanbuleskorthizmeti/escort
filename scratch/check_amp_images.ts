import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkAMPImages() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- EXTRACTING amp-img TAGS ---');
    const resAmp = await ssh.execCommand(
      'curl -s -H "Host: istanbulescort.blog" "http://127.0.0.1/amp?loc=sariyer" | grep -A 8 "amp-img" | head -n 30'
    );
    console.log(resAmp.stdout || 'No tags found.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkAMPImages();
