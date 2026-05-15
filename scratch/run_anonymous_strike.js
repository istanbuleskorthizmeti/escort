const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function runAnonymousStrike() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('☢️ [NUCLEAR] Executing Anonymous Telegraph Strike...');
    
    const cmd = 'npx tsx scripts/master/anonymous-sniper.ts';
    
    const res = await ssh.execCommand(cmd, { cwd: '/root/esc' });
    console.log('--- STDOUT ---');
    console.log(res.stdout);
    console.log('--- STDERR ---');
    console.log(res.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('❌ SSH Error:', err);
    ssh.dispose();
  }
}

runAnonymousStrike();
