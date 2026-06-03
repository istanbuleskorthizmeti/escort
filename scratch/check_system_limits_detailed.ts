import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkSystemLimitsDetailed() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- SYSTEMD SYSTEM.CONF LIMITS ---');
    const systemdConf = await ssh.execCommand('grep -r -i "DefaultLimit" /etc/systemd/system.conf /etc/systemd/system.conf.d/ 2>/dev/null');
    console.log(systemdConf.stdout || 'No systemd limit overrides.');

    console.log('\n--- PROC SELF LIMITS ---');
    const procLimits = await ssh.execCommand('cat /proc/self/limits');
    console.log(procLimits.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkSystemLimitsDetailed();
