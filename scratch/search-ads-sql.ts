import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function searchAdsInSql() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🔍 Searching for AdProfile/Profile data in vuc2026.sql ...');
    
    // Look for any table related to profiles or ads
    const tables = await ssh.execCommand('grep "CREATE TABLE" /var/www/escortvip/vuc2026.sql | grep -iE "Ad|Profile|Ilan|Member"');
    console.log('Potential Tables in SQL:', tables.stdout);

    // Look for COPY commands for these tables
    const copy = await ssh.execCommand('grep "COPY" /var/www/escortvip/vuc2026.sql | grep -iE "Ad|Profile|Ilan|Member"');
    console.log('COPY Commands for Tables:', copy.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

searchAdsInSql();
