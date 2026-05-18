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
    
    console.log('📡 RUNNING CURL FOR EXIT CODE:');
    const res = await ssh.execCommand('curl -v http://127.0.0.1:3001/');
    console.log('Exit code:', res.code);
    console.log('Stdout:', res.stdout);
    console.log('Stderr:', res.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
