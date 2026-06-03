import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkRcLocal() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- RC.LOCAL ---');
    const rc = await ssh.execCommand('cat /etc/rc.local 2>/dev/null || echo "No rc.local"');
    console.log(rc.stdout);

    console.log('\n--- INIT.D FILES ---');
    const initD = await ssh.execCommand('ls -la /etc/init.d/');
    console.log(initD.stdout);

    console.log('\n--- MULTI-USER.TARGET.WANTS ---');
    const wants = await ssh.execCommand('ls -la /etc/systemd/system/multi-user.target.wants/');
    console.log(wants.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkRcLocal();
