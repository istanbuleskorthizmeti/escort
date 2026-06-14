const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });

    console.log('--- Querying DB PageContent Directly ---');
    const cmd = `node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const site = await prisma.site.findUnique({ where: { domain: 'istanbulescort.blog' } });
  console.log('Resolved SiteId:', site ? site.id : 'Null');
  
  if (site) {
    const page = await prisma.pageContent.findFirst({
      where: { 
        slug: 'istanbul-merkez-kategori-rus-escort', 
        OR: [{ siteId: site.id }, { siteId: null }]
      }
    });
    console.log('Direct Prisma Query Result:', page ? 'Found! ' + page.slug : 'Null');
    
    // Check if there is any page starting with 'istanbul-merkez'
    const pages = await prisma.pageContent.findMany({
      where: {
        siteId: site.id,
        slug: { startsWith: 'istanbul-merkez' }
      },
      take: 5
    });
    console.log('Other istanbul-merkez pages:');
    pages.forEach(p => console.log('  ' + p.slug));
  }
}
main().catch(console.error).finally(() => prisma.\\$disconnect());
"`;

    const res = await ssh.execCommand(cmd, { cwd: '/root/esc' });
    console.log(res.stdout || res.stderr);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
