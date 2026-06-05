import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function run() {
  try {
    console.log('📡 Connecting to SSH...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('\n--- Checking /root/esc/public/_media/vitrin/ ---');
    const mediaRes = await ssh.execCommand('ls -la /root/esc/public/_media/vitrin/ | head -n 30');
    console.log(mediaRes.stdout);

    console.log('\n--- Count of files in /root/esc/public/_media/vitrin/ ---');
    const mediaCount = await ssh.execCommand('ls -la /root/esc/public/_media/vitrin/ | wc -l');
    console.log(mediaCount.stdout.trim());

    console.log('\n--- Count of files in /root/esc/public/vitrin/ ---');
    const vitrinCount = await ssh.execCommand('ls -la /root/esc/public/vitrin/ | wc -l');
    console.log(vitrinCount.stdout.trim());

    ssh.dispose();
  } catch (err) {
    console.error('💥 Error:', err);
    ssh.dispose();
  }
}

run();
