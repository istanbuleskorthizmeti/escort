const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function runBloggerMassPost() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('☢️ [NUCLEAR] Executing Blogger Mass Post from Attack Server...');
    
    const cmd = `export CRM_ENCRYPTION_KEY="drkcnay-elite-2026-god-mode" && npx tsx scripts/master/blogger-mass-poster.ts`;
    
    const result = await ssh.execCommand(cmd, { cwd: '/root/esc' });
    console.log(result.stdout || result.stderr);

    ssh.dispose();
    console.log('✅ [DONE] Blogger Mass Post executed.');
  } catch (err) {
    console.error('❌ [ERROR]', err);
    ssh.dispose();
  }
}

runBloggerMassPost();
