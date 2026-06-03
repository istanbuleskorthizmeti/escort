import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function testConnection() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- TESTING LOCAL POSTGRES CONNECTION ---');
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

testConnection();
