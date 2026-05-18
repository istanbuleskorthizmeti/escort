import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📤 Uploading test_http_on_droplet.js...');
    await ssh.putFile('c:\\Users\\onurk\\esc\\scripts\\test_http_on_droplet.js', '/root/esc/scripts/test_http_on_droplet.js');
    console.log('✅ Uploaded.');

    console.log('🚀 Running test_http_on_droplet.js on remote droplet...');
    const runRes = await ssh.execCommand('node /root/esc/scripts/test_http_on_droplet.js');
    console.log('\n📡 REMOTE STDOUT:');
    console.log(runRes.stdout);
    if (runRes.stderr) {
      console.log('\n💥 REMOTE STDERR:');
      console.log(runRes.stderr);
    }

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
