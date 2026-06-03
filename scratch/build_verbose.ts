import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function buildVerbose() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- RUNNING NEXT BUILD WITH NODE OPTIONS FOR EXTRA VERBOSE/DEBUG ---');
    const result = await ssh.execCommand(
      'npx --no-install next build --debug', 
      { 
        cwd: '/root/esc',
        env: {
          NODE_OPTIONS: '--max-old-space-size=4096'
        }
      }
    );
    console.log('STDOUT:');
    console.log(result.stdout);
    console.log('STDERR:');
    console.log(result.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

buildVerbose();
