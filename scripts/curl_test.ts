import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('--- Testing https://istanbulescort.blog/ ---');
    const res1 = await ssh.execCommand('curl -k -i -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://istanbulescort.blog/');
    console.log('istanbulescort.blog:', res1.stdout);

    console.log('--- Testing http://vipescorthizmeti.com/ ---');
    const res2 = await ssh.execCommand('curl -k -i -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://vipescorthizmeti.com/');
    console.log('vipescorthizmeti.com:', res2.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
