import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function envUpdate() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🛠️ [ESCORT] Updating .env to use 127.0.0.1 and ensuring correct database name...');
    
    // We update localhost to 127.0.0.1 and make sure it points to vuc2026
    const updateCmd = `sed -i 's/localhost:5432\\/vuc2026/127.0.0.1:5432\\/vuc2026/g' /root/hydra/.env`;
    await ssh.execCommand(updateCmd);

    console.log('✅ [ESCORT] Updated! Testing DB again with the script in /root/hydra...');
    // We should run check_db.js from the project folder if it exists there too
    const testRes = await ssh.execCommand('npx tsx /root/check_db.js');
    console.log(testRes.stdout || testRes.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

envUpdate();
