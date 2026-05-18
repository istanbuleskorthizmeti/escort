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
    
    console.log('📡 Testing sendPhoto using raw local file stream upload instead of HTTP URL to bypass "wrong type of the web page content" errors...');
    const cmd = `node -r dotenv/config -e "
      const { bot } = require('./dist_scripts/lib/crm/bot-instance');
      const fs = require('fs');
      bot.telegram.sendPhoto('-1003961137983', { source: fs.createReadStream('/root/esc/public/_media/vitrin/istanbul-kaporasiz-escort-melissa-1.webp') }, {
        caption: 'Visual SEO Blast Stream Test'
      }).then(res => console.log('STREAM SUCCESS:', res.message_id))
      .catch(err => console.error('STREAM ERROR:', err.message));
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
