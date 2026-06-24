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
    const result = await ssh.execCommand('find / -name "docker-compose.yml" 2>/dev/null');
    console.log('--- DOCKER-COMPOSE FILES ---');
    console.log(result.stdout || 'None');
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
