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

    console.log('--- Checking SiteId and Page Slugs ---');
    const cmd = `node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getSiteId } = require('./lib/site-context');

async function main() {
  const siteId = await getSiteId('esenyurtescorthizmeti.shop');
  console.log('Resolved SiteId:', siteId);
  
  const site = await prisma.site.findUnique({ where: { id: siteId } });
  console.log('Site domain in DB:', site ? site.domain : 'NOT FOUND');

  const page = await prisma.pageContent.findFirst({
    where: {
      siteId: siteId,
      slug: 'istanbul-merkez-kategori-rus-escort'
    }
  });
  console.log('Page found with exact siteId:', page ? 'YES' : 'NO');

  const pageNull = await prisma.pageContent.findFirst({
    where: {
      siteId: null,
      slug: 'istanbul-merkez-kategori-rus-escort'
    }
  });
  console.log('Page found with null siteId:', pageNull ? 'YES' : 'NO');
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
