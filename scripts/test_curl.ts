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
    
    console.log('📡 WHICH CURL:');
    const whichRes = await ssh.execCommand('which curl');
    console.log('which curl:', whichRes.stdout || whichRes.stderr || 'Nothing');

    console.log('📡 CURL VERSION:');
    const verRes = await ssh.execCommand('curl --version');
    console.log('curl version:', verRes.stdout || verRes.stderr || 'Nothing');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
