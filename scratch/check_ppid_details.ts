import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkPpidDetails() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- LS -LA /proc/3765522 ---');
    const procRes = await ssh.execCommand('ls -la /proc/3765522/');
    console.log(procRes.stdout || procRes.stderr);

    console.log('\n--- READING `/proc/3765522/cmdline` ---');
    const cmdlineRes = await ssh.execCommand('cat -v /proc/3765522/cmdline');
    console.log(cmdlineRes.stdout);

    console.log('\n--- READING `/proc/3765522/environ` ---');
    const envRes = await ssh.execCommand('cat -v /proc/3765522/environ | tr "\\0" "\\n"');
    console.log(envRes.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkPpidDetails();
