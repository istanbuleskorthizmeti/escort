import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkOpenvz() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- BEANCOUNTERS ---');
    const bc = await ssh.execCommand('cat /proc/user_beancounters 2>/dev/null || echo "No OpenVZ user_beancounters"');
    console.log(bc.stdout);

    console.log('\n--- CPUINFO ---');
    const cpu = await ssh.execCommand('grep -i -E "model name|cores" /proc/cpuinfo | uniq');
    console.log(cpu.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkOpenvz();
