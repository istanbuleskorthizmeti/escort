import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function testMobileCurl() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1';

    console.log('\n--- CURL HOME PAGE (MOBILE UA) ---');
    const resHome = await ssh.execCommand(
      `curl -I -A "${mobileUA}" -H "Host: istanbulescdrkcn.com" http://127.0.0.1/`
    );
    console.log(resHome.stdout || resHome.stderr);

    console.log('\n--- CURL DISTRICT PAGE (MOBILE UA) ---');
    // Using a known valid path or checking if it returns 200/404/500/308
    const resDist = await ssh.execCommand(
      `curl -I -A "${mobileUA}" -H "Host: istanbulescdrkcn.com" http://127.0.0.1/istanbul/esenyurt-escort-gercek-gorseller`
    );
    console.log(resDist.stdout || resDist.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

testMobileCurl();
