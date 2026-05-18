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
    
    console.log('📡 Fetching raw HTTP response from Telegram API...');
    const result = await ssh.execCommand('curl -i -X POST "https://api.telegram.org/bot8656705130:AAFJr9QsnYASOQgIoAEEw_V8EzobjXH7nBc/sendPhoto" -d chat_id="-1003961137983" -d photo="http://213.232.235.181/_media/vitrin/istanbul-kaporasiz-escort-melissa-1.webp" -d caption="Patrol test"');
    console.log(result.stdout || result.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
