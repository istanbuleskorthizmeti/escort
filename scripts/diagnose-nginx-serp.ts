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
    
    console.log('--- ENABLED SITES ---');
    const enabled = await ssh.execCommand('ls -la /etc/nginx/sites-enabled/');
    console.log(enabled.stdout);

    console.log('--- SERPBEAR NGINX FILE ---');
    const serpFile = await ssh.execCommand('cat /etc/nginx/sites-available/serpbear');
    console.log(serpFile.stdout || serpFile.stderr);

    console.log('--- NGINX CONFIG TEST ---');
    const testRes = await ssh.execCommand('nginx -t');
    console.log(testRes.stdout || testRes.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
