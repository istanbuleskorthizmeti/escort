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

    console.log('--- Database SEO Stats ---');
    // Run database stats using inline node script on the server
    const cmd = `node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const sites = await prisma.site.findMany();
  console.log('Total sites: ' + sites.length);
  for (const s of sites) {
    const pageCount = await prisma.pageContent.count({ where: { siteId: s.id } });
    console.log('  - ' + s.domain + ' (Pages: ' + pageCount + ')');
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
