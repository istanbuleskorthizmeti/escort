import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '31.97.79.34',
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('✅ Connected to old server.');

    const findKey = await ssh.execCommand('find / -name "google-key.json" 2>/dev/null');
    console.log('--- FIND google-key.json ON OLD SERVER ---');
    console.log(findKey.stdout || findKey.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
