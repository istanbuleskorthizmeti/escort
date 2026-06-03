import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function fixIPC() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('📝 Configuring RemoveIPC=no in /etc/systemd/logind.conf...');
    // Replace the commented #RemoveIPC=yes with RemoveIPC=no, or append it
    const updateRes = await ssh.execCommand(
      `sed -i 's/#RemoveIPC=yes/RemoveIPC=no/' /etc/systemd/logind.conf`
    );
    console.log(updateRes.stdout || updateRes.stderr || 'Configuration updated.');

    console.log('🔄 Restarting systemd-logind service...');
    await ssh.execCommand('systemctl restart systemd-logind');

    console.log('🔄 Restarting PostgreSQL service...');
    await ssh.execCommand('systemctl restart postgresql@16-main');

    console.log('\n--- VERIFYING /dev/shm CONTENTS ---');
    const shmRes = await ssh.execCommand('ls -la /dev/shm');
    console.log(shmRes.stdout || shmRes.stderr);

    console.log('\n--- VERIFYING PG CLUSTER STATUS ---');
    const pgRes = await ssh.execCommand('pg_lsclusters');
    console.log(pgRes.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

fixIPC();
