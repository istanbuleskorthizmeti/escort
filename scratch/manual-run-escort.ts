import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function manualRun() {
  console.log('⚡ [MANUAL-RUN] Running npm start via direct SSH to see output...');

  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    const res = await ssh.execCommand('cd /root/hydra && npm start -- -p 3001', {
      onStdout: (chunk) => process.stdout.write(chunk.toString()),
      onStderr: (chunk) => process.stderr.write(chunk.toString()),
    });

    console.log('\n--- COMMAND FINISHED ---');
    console.log('Exit code:', res.code);

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 FAILURE:', err.message);
  }
}

manualRun();
