import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📡 Executing telegram-blast via Next.js compiler environment (no TS resolution errors)...');
    // Using simple TSX execution directly but passing the TS_NODE_COMPILER_OPTIONS or ESND interop flags
    const result = await ssh.execCommand('npx tsx scripts/master/telegram-blast.ts', { cwd: '/root/esc', env: { TS_NODE_TRANSPILE_ONLY: 'true' } });
    console.log(result.stdout || result.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
