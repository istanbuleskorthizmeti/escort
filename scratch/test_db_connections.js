const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('--- Testing DB connection for vuc2026 ---');
    const db1Res = await ssh.execCommand('cd /var/www/escortvip && node -e "const { Client } = require(\'pg\'); const c = new Client({ connectionString: \\"postgresql://vuc2026_user:vuc2026_pass@localhost:5432/vuc2026\\" }); c.connect().then(() => c.query(\'SELECT COUNT(*) FROM \\"Site\\"\').then(r => { console.log(\'vuc2026 Site count:\', r.rows[0].count); c.end(); }).catch(e => { console.log(e.message); c.end(); })).catch(e => console.log(\'Connection failed:\', e.message))"');
    console.log(db1Res.stdout || db1Res.stderr);

    console.log('\n--- Testing DB connection for escortvip_db ---');
    const db2Res = await ssh.execCommand('cd /var/www/escortvip && node -e "const { Client } = require(\'pg\'); const c = new Client({ connectionString: \\"postgresql://sovereign:SovereignGodMode2026!@localhost:5432/escortvip_db\\" }); c.connect().then(() => c.query(\'SELECT COUNT(*) FROM \\"Site\\"\').then(r => { console.log(\'escortvip_db Site count:\', r.rows[0].count); c.end(); }).catch(e => { console.log(e.message); c.end(); })).catch(e => console.log(\'Connection failed:\', e.message))"');
    console.log(db2Res.stdout || db2Res.stderr);

  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
