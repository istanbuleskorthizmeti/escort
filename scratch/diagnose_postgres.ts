import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function diagnose() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- PG_LSCLUSTERS ---');
    const pgLs = await ssh.execCommand('pg_lsclusters');
    console.log(pgLs.stdout || pgLs.stderr);

    console.log('\n--- ATTEMPTING POSTGRES RESTART ---');
    const restartRes = await ssh.execCommand('systemctl restart postgresql');
    console.log('STDOUT:', restartRes.stdout);
    console.log('STDERR:', restartRes.stderr);

    console.log('\n--- PG_LSCLUSTERS AFTER RESTART ---');
    const pgLs2 = await ssh.execCommand('pg_lsclusters');
    console.log(pgLs2.stdout || pgLs2.stderr);

    console.log('\n--- TESTING LOCAL POSTGRES CONNECTION AGAIN ---');
    const pgTest = await ssh.execCommand(
      'psql "postgresql://vuc2026_user:vuc2026_pass@127.0.0.1:5432/vuc2026?sslmode=disable" -c "SELECT 1 as connection_test;"'
    );
    console.log('STDOUT:', pgTest.stdout);
    console.log('STDERR:', pgTest.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

diagnose();
