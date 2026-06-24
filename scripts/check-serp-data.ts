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
    const res = await ssh.execCommand('sqlite3 /var/www/serpbear/data/database.sqlite "SELECT keyword, position, device, url FROM keyword WHERE position > 0 LIMIT 10;"');
    console.log('--- RANKINGS > 0 ---');
    console.log(res.stdout || 'No rankings greater than 0 yet.');

    const totalKeywords = await ssh.execCommand('sqlite3 /var/www/serpbear/data/database.sqlite "SELECT COUNT(*) FROM keyword;"');
    console.log('Total keywords in DB:', totalKeywords.stdout.trim());

    const updatingKeywords = await ssh.execCommand('sqlite3 /var/www/serpbear/data/database.sqlite "SELECT COUNT(*) FROM keyword WHERE updating = 1;"');
    console.log('Keywords currently updating:', updatingKeywords.stdout.trim());

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
