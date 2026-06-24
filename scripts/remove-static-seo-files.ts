import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('🧹 Removing static robots.txt...');
    const rmRobots = await ssh.execCommand('rm -f /root/esc/public/robots.txt');
    console.log(rmRobots.stdout || rmRobots.stderr || 'Robots.txt removed successfully.');

    console.log('🧹 Removing static sitemap.xml...');
    const rmSitemap = await ssh.execCommand('rm -f /root/esc/public/sitemap.xml');
    console.log(rmSitemap.stdout || rmSitemap.stderr || 'Sitemap.xml removed successfully.');

    ssh.dispose();
  } catch (err: unknown) {
    console.error('Error:', err instanceof Error ? err.message : String(err));
    ssh.dispose();
  }
}

run();
