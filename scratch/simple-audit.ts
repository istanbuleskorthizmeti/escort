import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const oldPass = 'D0rukC4n4y_Elit3_Secur3_2026_!X';
const newPass = 'DorukElite2026Secure';

async function simpleAudit() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🛡️ Re-hardening with shell-safe password...');
    
    const dbUrlOld = `postgresql://vuc2026_user:${oldPass}@localhost:5432/vuc2026?sslmode=disable`;
    await ssh.execCommand(`psql "${dbUrlOld}" -c "ALTER USER vuc2026_user WITH PASSWORD '${newPass}';"`).catch(() => {});
    
    const dbUrl = `postgresql://vuc2026_user:${newPass}@localhost:5432/vuc2026?sslmode=disable`;
    
    // Update .env
    await ssh.execCommand(`sed -i 's|DATABASE_URL=.*|DATABASE_URL="${dbUrl}"|' /root/hydra/.env`);

    console.log('🕵️ Row count check...');
    const res = await ssh.execCommand(`psql "${dbUrl}" -c "SELECT COUNT(*) FROM \\"PageContent\\";"`);
    console.log('PageContent:', res.stdout);

    const siteRes = await ssh.execCommand(`psql "${dbUrl}" -c "SELECT \\"siteId\\", COUNT(*) FROM \\"PageContent\\" GROUP BY 1 ORDER BY 2 DESC;"`);
    console.log('Distribution:', siteRes.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

simpleAudit();
