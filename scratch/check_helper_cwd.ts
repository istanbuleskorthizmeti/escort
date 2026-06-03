import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkHelperCwd() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- CWD OF SYSLOG-HELPER ---');
    const cwd = await ssh.execCommand('ls -la /proc/3838038/cwd');
    console.log(cwd.stdout || cwd.stderr);

    console.log('\n--- ENVIRONMENT OF SYSLOG-HELPER ---');
    const env = await ssh.execCommand('cat /proc/3838038/environ | tr "\\0" "\\n"');
    console.log(env.stdout || env.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkHelperCwd();
