import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to 187.77.111.203.');

    console.log('--- SYSTEM SERVICES ---');
    const systemctlRes = await ssh.execCommand('systemctl status postgresql');
    console.log(systemctlRes.stdout || systemctlRes.stderr || 'Postgres status unknown');

    console.log('\n--- LISTENING PORTS ---');
    const netstatRes = await ssh.execCommand('netstat -tuln || ss -tuln');
    console.log(netstatRes.stdout || netstatRes.stderr || 'No netstat output');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
