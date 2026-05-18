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
    
    console.log('📡 Compiling specific target with pure tsc compiler options...');
    const buildRes = await ssh.execCommand('npx tsc --target es2022 --module commonjs --esModuleInterop true --outDir dist_scripts scripts/master/telegram-blast.ts', { cwd: '/root/esc' });
    console.log(buildRes.stdout || buildRes.stderr || 'Build triggered.');

    console.log('📡 Executing compiled javascript output with pure node...');
    const execRes = await ssh.execCommand('node -r dotenv/config dist_scripts/scripts/master/telegram-blast.js', { cwd: '/root/esc' });
    console.log(execRes.stdout || execRes.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
