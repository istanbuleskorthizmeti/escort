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
  const sites = await prisma.site.findMany({
    where: {
      domain: {
        in: ['esenyurtescorthizmeti.shop', 'esenyurtescort.blog', 'besiktasescorthizmeti.shop']
      }
    }
  });
  console.log('Sites found: ' + sites.length);
  for (const s of sites) {
    const pageCount = await prisma.pageContent.count({ where: { siteId: s.id } });
    console.log('  - ' + s.domain + ' (ID: ' + s.id + ', Pages: ' + pageCount + ')');
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
    fs.writeFileSync('scratch/specific_db_output.txt', output);
    console.log('Saved output to scratch/specific_db_output.txt');
  }
}
run();
