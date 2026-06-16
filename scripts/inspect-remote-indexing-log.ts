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
    console.log('✅ Connected to VPS.');

    const catRes = await ssh.execCommand('tail -n 40 /root/esc/logs/indexing.log');
    console.log('📋 [VPS LOGS] Last 40 lines of GSC Indexing Blast logs:');
    console.log(catRes.stdout || catRes.stderr || 'No logs found.');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
