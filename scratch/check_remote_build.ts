import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkBuild() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- LS -LA /root/esc/.next ---');
    const lsRes = await ssh.execCommand('ls -la /root/esc/.next');
    console.log(lsRes.stdout || lsRes.stderr);

    console.log('\n--- VERIFYING NEXT BUILD LOGS ---');
    // Let's run npm run build on the server directly to verify if there's any compile issues on target
    const buildRes = await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    console.log(buildRes.stdout);
    console.log(buildRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkBuild();
