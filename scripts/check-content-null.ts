import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();
const config = {
  host: '187.77.111.203',
  port: 22,
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    const script = `
      import { prisma } from '../lib/prisma';
      async function main() {
        const domain = 'istanbulescort.blog';
        const site = await prisma.site.findUnique({ where: { domain } });
        if (!site) {
          console.log('Site not found');
          return;
        }
        const total = await prisma.pageContent.count({ where: { siteId: site.id } });
        const withContent = await prisma.pageContent.count({ where: { siteId: site.id, content: { not: null } } });
        console.log('Total pages in DB for site:', total);
        console.log('Pages with content NOT NULL:', withContent);
      }
      main().catch(console.error);
    `;

    console.log('📤 Uploading count script...');
    await ssh.execCommand(`echo "${script.replace(/"/g, '\\"')}" > /root/esc/scratch/temp-count.ts`);
    
    console.log('📡 Executing count...');
    const result = await ssh.execCommand('npx tsx scratch/temp-count.ts', { cwd: '/root/esc' });
    console.log(result.stdout || result.stderr);

    await ssh.execCommand('rm -f /root/esc/scratch/temp-count.ts');
    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

run();
