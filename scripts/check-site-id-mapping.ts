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
        console.log('--- SITE FOR DOMAIN: ' + domain + ' ---');
        console.log(JSON.stringify(site, null, 2));
        
        if (site) {
          const pagesCount = await prisma.pageContent.count({
            where: { siteId: site.id }
          });
          console.log('\\nTotal pageContent entries with siteId ' + site.id + ': ' + pagesCount);

          // Get first 5 slugs
          const samplePages = await prisma.pageContent.findMany({
            where: { siteId: site.id },
            take: 5,
            select: { slug: true }
          });
          console.log('\\nSample Slugs in DB:');
          console.log(samplePages);
        }
      }
      main().catch(console.error);
    `;

    console.log('📤 Uploading diagnostic script...');
    await ssh.execCommand(`echo "${script.replace(/"/g, '\\"')}" > /root/esc/scratch/temp-diagnostic.ts`);
    
    console.log('📡 Executing...');
    const result = await ssh.execCommand('npx tsx scratch/temp-diagnostic.ts', { cwd: '/root/esc' });
    console.log(result.stdout || result.stderr);

    await ssh.execCommand('rm -f /root/esc/scratch/temp-diagnostic.ts');
    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

run();
