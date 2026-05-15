import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function checkPaths() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('--- TSCONFIG ---');
    const tsconfig = await ssh.execCommand('cat /root/hydra/tsconfig.json');
    console.log(tsconfig.stdout);

    console.log('--- FILE PATHS CHECK ---');
    const paths = [
      '/root/hydra/components/UI/Navbar.tsx',
      '/root/hydra/lib/locations.ts',
      '/root/hydra/lib/content-data.ts'
    ];

    for (const p of paths) {
      const res = await ssh.execCommand(`ls -la ${p}`);
      console.log(`${p}: ${res.stdout || 'MISSING'}`);
    }

    ssh.dispose();
  } catch (err) {
    console.error(err.message);
  }
}

checkPaths();
