import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

const domains = [
  'istanbulescdrkcn.com',
  'vipescorthizmeti.com',
  'plakasorgula.shop',
  'dilanpolatifsa.shop'
];

async function run() {
  try {
    await ssh.connect(config);
    for (const domain of domains) {
      console.log(`\n=== Domain: ${domain} ===`);
      const ns = await ssh.execCommand(`nslookup ${domain} 8.8.8.8`);
      console.log('DNS Resolution:');
      console.log(ns.stdout || ns.stderr);
      
      const curl = await ssh.execCommand(`curl -s -o /dev/null -w "%{http_code}" https://${domain}/`);
      console.log(`HTTP Status: ${curl.stdout.trim() || curl.stderr.trim()}`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}

run();
