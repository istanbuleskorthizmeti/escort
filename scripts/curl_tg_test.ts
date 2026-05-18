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
    
    console.log('📝 Testing manual sendPhoto call with the token and chat ID directly via curl...');
    // We will attempt to curl telegram directly to check if the group chat ID accepts photo posts
    const cmd = `curl -s -X POST "https://api.telegram.org/bot8656705130:AAFJr9QsnYASOQgIoAEEw_V8EzobjXH7nBc/sendPhoto" \
      -d chat_id="-1003961137983" \
      -d photo="http://213.232.235.181/_media/vitrin/istanbul-kaporasiz-escort-melissa-1.webp" \
      -d caption="Test visual SEO blast from console"`;
    
    const res = await ssh.execCommand(cmd);
    console.log(res.stdout || res.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
