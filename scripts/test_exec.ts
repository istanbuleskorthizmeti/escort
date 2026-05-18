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
    
    console.log('📡 Running whoami...');
    const who = await ssh.execCommand('whoami');
    console.log('STDOUT:', who.stdout);
    console.log('STDERR:', who.stderr);
    console.log('CODE:', who.code);

    console.log('📡 Running simple ps...');
    const ps = await ssh.execCommand('ps -e -o pid,ppid,cmd,%mem,%cpu --sort=-%mem | head -n 10');
    console.log('STDOUT:', ps.stdout);
    console.log('STDERR:', ps.stderr);
    console.log('CODE:', ps.code);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
