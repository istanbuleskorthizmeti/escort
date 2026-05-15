import { NodeSSH } from 'node-ssh';

const server = { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function catPrisma() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('📄 Catting Prisma Schema on Dizi Server...');
    const res = await ssh.execCommand('cat /var/www/escortvip/prisma/schema.prisma');
    console.log(res.stdout);
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

catPrisma();
