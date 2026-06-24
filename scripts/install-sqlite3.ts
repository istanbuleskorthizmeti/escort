import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function main() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log(' • Installing sqlite3 on the VPS...');
    const installRes = await ssh.execCommand('apt-get update && apt-get install -y sqlite3');
    console.log(installRes.stdout || installRes.stderr);

    console.log(' • Checking sqlite3 version...');
    const verRes = await ssh.execCommand('sqlite3 --version');
    console.log(verRes.stdout || verRes.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
