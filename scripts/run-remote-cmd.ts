import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function main() {
  const cmd = process.argv.slice(2).join(' ');
  if (!cmd) {
    console.error('Usage: npx tsx scripts/run-remote-cmd.ts <command>');
    process.exit(1);
  }

  try {
    await ssh.connect(config);
    console.log('✅ SSH Connected.');
    console.log(`🚀 Executing: ${cmd}`);
    const result = await ssh.execCommand(cmd, { cwd: '/root/esc' });
    
    console.log('\n--- OUTPUT ---');
    console.log(result.stdout);
    if (result.stderr) {
      console.error('--- ERROR ---');
      console.error(result.stderr);
    }
  } catch (err) {
    console.error('❌ SSH Error:', err);
  } finally {
    ssh.dispose();
  }
}

main();
