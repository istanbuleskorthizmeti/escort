import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkRemoteDb() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- RETRIEVING RECENT PAGES FROM DATABASE ---');
    const sql = `
      SELECT id, slug, title, substring(content from 1 for 200) as content_snippet
      FROM "PageContent"
      LIMIT 10;
    `;
    const res = await ssh.execCommand(
      `psql "postgresql://vuc2026_user:vuc2026_pass@127.0.0.1:5432/vuc2026?sslmode=disable" -c '${sql}'`
    );
    console.log(res.stdout || res.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkRemoteDb();
