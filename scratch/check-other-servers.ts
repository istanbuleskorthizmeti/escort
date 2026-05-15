import { NodeSSH } from 'node-ssh';

const servers = [
  { name: 'Attack Server', host: '187.77.111.203', pass: 'Z4-nN8JfiUIh5,;g' },
  { name: 'Dizi Server', host: '45.93.137.164', pass: 'Z4-nN8JfiUIh5,;g' }
];

async function checkHealth() {
  for (const server of servers) {
    const ssh = new NodeSSH();
    try {
      console.log(`🔍 Checking ${server.name} (${server.host})...`);
      await ssh.connect({
        host: server.host,
        username: 'root',
        password: server.pass
      });
      
      const pm2 = await ssh.execCommand('pm2 status');
      console.log(`--- PM2 STATUS (${server.name}) ---`);
      console.log(pm2.stdout || 'PM2 NOT RUNNING');

      const ports = await ssh.execCommand('netstat -tulpn | grep node');
      console.log(`--- PORTS (${server.name}) ---`);
      console.log(ports.stdout || 'NO NODE PORTS');

      ssh.dispose();
    } catch (err: any) {
      console.error(`❌ FAILED to connect to ${server.name}:`, err.message);
    }
  }
}

checkHealth();
