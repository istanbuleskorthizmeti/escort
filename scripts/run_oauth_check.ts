import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    await ssh.putFile(
      path.join(process.cwd(), 'scripts', 'test_google_oauth_auth.js'),
      '/root/esc/scripts/test_google_oauth_auth.js'
    );
    console.log('📤 Uploaded.');

    const res = await ssh.execCommand('node scripts/test_google_oauth_auth.js', { cwd: '/root/esc' });
    console.log(res.stdout || res.stderr);
    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
