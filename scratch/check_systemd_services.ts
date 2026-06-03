import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkSystemdServices() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- SYSTEMD SERVICE FILES IN /ETC/SYSTEMD/SYSTEM/ ---');
    const systemdFiles = await ssh.execCommand('ls -la /etc/systemd/system/');
    console.log(systemdFiles.stdout);

    console.log('\n--- SYSTEMD CUSTOM OR SUSPICIOUS SERVICES ACTIVE ---');
    const activeServices = await ssh.execCommand('systemctl list-units --type=service --state=running --no-pager');
    console.log(activeServices.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkSystemdServices();
