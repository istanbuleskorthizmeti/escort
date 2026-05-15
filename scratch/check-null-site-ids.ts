import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const dbUrl = 'postgresql://vuc2026_user:D0rukC4n4y_Elit3_Secur3_2026_!X@localhost:5432/vuc2026?sslmode=disable';

async function checkNullSiteIds() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    const res = await ssh.execCommand(`psql "${dbUrl}" -c "SELECT COUNT(*) FROM \\"PageContent\\" WHERE \\"siteId\\" IS NULL;"`);
    console.log(res.stdout);
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkNullSiteIds();
