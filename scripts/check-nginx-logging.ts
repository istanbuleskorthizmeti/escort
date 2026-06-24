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

    console.log('--- NGINX ACCESS LOG SETTINGS ---');
    const logSettings = await ssh.execCommand('grep -r "access_log" /etc/nginx/');
    console.log(logSettings.stdout || 'None');

    console.log('--- TAIL SYSLOG / JOURNALCTL FOR NGINX ---');
    const journal = await ssh.execCommand('journalctl -u nginx --no-pager -n 20');
    console.log(journal.stdout);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
