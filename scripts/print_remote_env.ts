import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📝 Reading env keys inside remote config...');
    const res = await ssh.execCommand('grep -E "LLM_API_KEY|GOOGLE_API_KEY|DEEPSEEK_API_KEY|OPENAI_API_KEY|GROQ_API_KEY" /var/www/escortvip/.env');
    console.log(res.stdout || res.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
