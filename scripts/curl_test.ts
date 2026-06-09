import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📡 CURL GET ON PORT 3001:');
    const result = await ssh.execCommand('curl -s -L -H "Host: istanbulescort.blog" -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" http://127.0.0.1:3001');
    const html = result.stdout;
    console.log('HTML Length:', html.length);
    console.log('Svetlana present?', html.includes('Svetlana') || html.includes('svetlana'));
    console.log('Ceren present?', html.includes('Ceren') || html.includes('ceren'));
    console.log('esmer present?', html.includes('esmer') || html.includes('Esmer'));

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
