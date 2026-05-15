const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function runBlogger() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('☢️ [NUCLEAR] Running Blogger Mass Post...');
    
    // Use a single command string to avoid shell escape issues
    const cmd = 'export LLM_MODEL="gemini-1.5-flash" && npx tsx scripts/master/blogger-mass-poster.ts';
    
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

runBlogger();
