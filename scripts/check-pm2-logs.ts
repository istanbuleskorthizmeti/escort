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

    const pm2Logs = await ssh.execCommand('pm2 logs esc-live --lines 20 --nostream');
    console.log('--- PM2 LOGS ---');
    console.log(pm2Logs.stdout || pm2Logs.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
