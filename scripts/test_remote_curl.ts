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

    console.log('📡 Printing /etc/resolv.conf:');
    const resolvConf = await ssh.execCommand('cat /etc/resolv.conf');
    console.log(resolvConf.stdout || 'Empty /etc/resolv.conf');

    console.log('\n📡 Direct Ping to 8.8.8.8 (Google DNS):');
    const pingRes = await ssh.execCommand('ping -c 3 8.8.8.8');
    console.log(pingRes.stdout || pingRes.stderr || 'Ping failed');

    console.log('\n📡 DNS Lookup for google.com:');
    const hostRes = await ssh.execCommand('host google.com || nslookup google.com || getent hosts google.com');
    console.log(hostRes.stdout || hostRes.stderr || 'Lookup failed');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
  }
}

run();
