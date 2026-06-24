import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '31.97.79.34',
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('✅ Connected.');
    const res = await ssh.execCommand('docker logs --tail 100 serpbear-app');
    console.log('--- LOGS CONTENT ---');
    console.log(res.stdout || res.stderr);
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
