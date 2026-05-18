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
    
    console.log('📡 Fetching raw HTTP response from Telegram API via Node Axios execution...');
    const cmd = `node -r dotenv/config -e "
      const axios = require('axios');
      axios.post('https://api.telegram.org/bot8656705130:AAFJr9QsnYASOQgIoAEEw_V8EzobjXH7nBc/sendPhoto', {
        chat_id: '-1003961137983',
        photo: 'http://213.232.235.181/_media/vitrin/istanbul-kaporasiz-escort-melissa-1.webp',
        caption: 'Node direct Axios test'
      }).then(res => console.log('SUCCESS:', res.data))
      .catch(err => console.error('ERROR:', err.response ? err.response.data : err.message));
    "`;
    const result = await ssh.execCommand(cmd, { cwd: '/root/esc' });
    console.log(result.stdout || result.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
