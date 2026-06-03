const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');

async function run() {
  let output = '';
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });

    const cmd = `node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const sites = await prisma.site.findMany();
  console.log('Total sites: ' + sites.length);
  
  // Find top sites by PageContent count
  const counts = await prisma.pageContent.groupBy({
    by: ['siteId'],
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    take: 10
  });

  for (const c of counts) {
    const site = sites.find(s => s.id === c.siteId);
    console.log('Site ID: ' + c.siteId + ' | Domain: ' + (site ? site.domain : 'Unknown') + ' | Pages: ' + c._count.id);
  }
}
main().catch(console.error).finally(() => prisma.\\$disconnect());
"`;

    const res = await ssh.execCommand(cmd, { cwd: '/root/esc' });
    output += res.stdout || res.stderr;

  } catch(e) {
    output += `Error: ${e.message}\n`;
  } finally {
    ssh.dispose();
    fs.writeFileSync('scratch/db_slugs_output.txt', output);
    console.log('Saved output to scratch/db_slugs_output.txt');
  }
}
run();
