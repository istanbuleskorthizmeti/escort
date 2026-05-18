import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function runTest() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to SSH.');

    await ssh.putFile(
      path.join(process.cwd(), 'scratch/check-phone-in-db.js'),
      '/root/esc/scratch-check-phone.js'
    );
    console.log('✅ Uploaded test script.');

    const res = await ssh.execCommand('node scratch-check-phone.js', { cwd: '/root/esc' });
    console.log('STDOUT:', res.stdout);
    console.log('STDERR:', res.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

runTest();
