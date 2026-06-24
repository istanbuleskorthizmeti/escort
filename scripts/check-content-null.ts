import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();
const config = {
  host: '31.97.79.34',
  port: 22,
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
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
        const shortContent = await prisma.pageContent.count({ 
          where: { siteId: site.id, OR: [{ content: { equals: '' } }, { content: null }] } 
        });
        const fallbackContent = await prisma.pageContent.count({
          where: { siteId: site.id, content: { contains: 'seo-fallback' } }
        });
        const sampleShort = await prisma.pageContent.findMany({
          where: { siteId: site.id, content: { contains: 'seo-fallback' } },
          select: { slug: true, title: true },
          take: 5
        });
        console.log('Total pages in DB for site:', total);
        console.log('Pages with empty or null content:', shortContent);
        console.log('Pages containing duplicate seo-fallback content:', fallbackContent);
        console.log('Sample fallback pages:', JSON.stringify(sampleShort, null, 2));
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
