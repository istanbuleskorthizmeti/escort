import { NodeSSH } from 'node-ssh';
import { getSSHConfig } from './lib/ssh-helper';

const ssh = new NodeSSH();
const config = getSSHConfig();

async function run() {
  try {
    console.log(`Connecting to VPS at ${config.host}...`);
    await ssh.connect(config);
    console.log('Connected.');

    console.log('Checking package manager on VPS...');
    const hasPnpm = await ssh.execCommand('which pnpm');
    const pkgManager = hasPnpm.stdout ? 'pnpm' : 'npm';
    console.log(`Using package manager: ${pkgManager}`);

    console.log(`Installing dependencies in /root/esc using ${pkgManager}...`);
    const installRes = await ssh.execCommand(`${pkgManager} install`, { cwd: '/root/esc' });
    console.log('--- INSTALL OUTPUT ---');
    console.log(installRes.stdout || 'No stdout.');
    if (installRes.stderr) {
      console.log('--- INSTALL ERRORS ---');
      console.log(installRes.stderr);
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

run();
