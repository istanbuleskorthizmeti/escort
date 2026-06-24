import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '31.97.79.34',
      port: 22,
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('✅ Connected to 31.97.79.34.');

    console.log('Testing port 22 and 80 on 213.232.235.181...');
    const res22 = await ssh.execCommand('nc -zv -w 3 213.232.235.181 22');
    console.log('Port 22 scan:', res22.stdout || res22.stderr);

    const res80 = await ssh.execCommand('nc -zv -w 3 213.232.235.181 80');
    console.log('Port 80 scan:', res80.stdout || res80.stderr);

  } catch (err: any) {
    console.error('❌ SSH Failed:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
