import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkPgCluster() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- PG CLUSTERS ---');
    const pgRes = await ssh.execCommand('pg_lsclusters');
    console.log(pgRes.stdout || pgRes.stderr);

    console.log('\n--- FREE MEMORY ---');
    const freeRes = await ssh.execCommand('free -m');
    console.log(freeRes.stdout);

    console.log('\n--- POSTGRES SERVICE STATUS ---');
    const pgSys = await ssh.execCommand('systemctl status postgresql@16-main');
    console.log(pgSys.stdout || pgSys.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkPgCluster();
