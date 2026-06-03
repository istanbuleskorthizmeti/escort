import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function verifyRedirect() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- TESTING MOBILE REDIRECT (USER AGENT SIMULATED ON 127.0.0.1) ---');
    const mobileRes = await ssh.execCommand(
      'curl -I -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1" http://127.0.0.1:8081/besiktas'
    );
    console.log(mobileRes.stdout || mobileRes.stderr);

    console.log('\n--- TESTING DESKTOP BEHAVIOR (USER AGENT SIMULATED ON 127.0.0.1) ---');
    const desktopRes = await ssh.execCommand(
      'curl -I -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" http://127.0.0.1:8081/besiktas'
    );
    console.log(desktopRes.stdout || desktopRes.stderr);

    console.log('\n--- TESTING BOT BEHAVIOR (USER AGENT SIMULATED ON 127.0.0.1) ---');
    const botRes = await ssh.execCommand(
      'curl -I -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" http://127.0.0.1:8081/besiktas'
    );
    console.log(botRes.stdout || botRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Verification failed:', err);
    ssh.dispose();
  }
}

verifyRedirect();
