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
    const res = await ssh.execCommand('curl -i -X POST -H "Authorization: Bearer vuc_serp_apikey_2026" http://127.0.0.1:5000/api/cron');
    console.log('--- FIRST 500 CHARS OF CURL ON PORT 5000 ---');
    console.log(res.stdout.substring(0, 500));
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
