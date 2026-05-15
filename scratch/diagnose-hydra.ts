import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function diagnose() {
  const conn = new NodeSSH();
  try {
    await conn.connect(server);
    console.log('🚀 Diagnosing Hydra App...');
    
    // 1. Check PM2 logs for hydra-app
    console.log('--- PM2 LOGS (hydra-app) ---');
    const logs = await conn.execCommand('pm2 logs hydra-app --lines 50 --nostream');
    console.log(logs.stdout || logs.stderr);
    
    // 2. Check if .next folder exists
    console.log('--- FILE CHECK ---');
    const files = await conn.execCommand('ls -la /root/hydra');
    console.log(files.stdout);
    
    const nextDir = await conn.execCommand('ls -la /root/hydra/.next');
    console.log('--- .NEXT DIR ---');
    console.log(nextDir.stdout || 'MISSING .next folder!');

    // 3. Check package.json scripts
    console.log('--- PACKAGE.JSON SCRIPTS ---');
    const pkg = await conn.execCommand('cat /root/hydra/package.json | grep -A 10 "scripts"');
    console.log(pkg.stdout);

    conn.dispose();
  } catch (err) {
    console.error(err.message);
  }
}

diagnose();
