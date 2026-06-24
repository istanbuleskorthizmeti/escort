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

    const dbPath = '/var/www/serpbear/data/database.sqlite';

    console.log('--- TABLES ---');
    const tables = await ssh.execCommand(`sqlite3 ${dbPath} ".tables"`);
    console.log(tables.stdout.trim());

    console.log('--- SCHEMA FOR TABLE "domain" ---');
    const domainSchema = await ssh.execCommand(`sqlite3 ${dbPath} "PRAGMA table_info(domain);"`);
    console.log(domainSchema.stdout.trim());

    console.log('--- SCHEMA FOR TABLE "keyword" ---');
    const keywordSchema = await ssh.execCommand(`sqlite3 ${dbPath} "PRAGMA table_info(keyword);"`);
    console.log(keywordSchema.stdout.trim());

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
