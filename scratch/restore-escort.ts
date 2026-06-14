import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '5TVuj6qiHMfh8CxH9O!' };

const envContent = `TELEGRAM_BOT_TOKEN="8656705130:AAFJr9QsnYASOQgIoAEEw_V8EzobjXH7nBc"
TELEGRAM_CHAT_ID="-1003961137983"
CRM_ENCRYPTION_KEY="f7f34600fab642e58e065d48f6d663dc"
ADMIN_HQ_KEY="drkcnay_2026_elite"
INDEX_NOW_KEY="8771e07e4e31024024720e4a348e10f0"
DRKCNAY_SYSTEM_KEY="212jeAmind!"
SITE_DOMAIN="istanbulescort.blog"
LLM_BASE_URL="https://generativelanguage.googleapis.com/v1beta"
LLM_API_KEY="AIzaSyCJrkR6g0LqhMj32rq6GT8dpmpUDskyqiQ"
LLM_MODEL="gemini-2.5-flash"
LLM_GATEWAY_KEY="llmgtwy_g3d1IPSFbzFpz0VGasTKcow6ThgGIJfatrvLPqbi"
GOOGLE_APPLICATION_CREDENTIALS="google-key.json"
GTM_BACKEND_URL="http://127.0.0.1:8080"
OPENAI_API_KEY="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"
DEEPSEEK_API_KEY="sk-02233a61861b4b8d9657384ca96976f0"
DEEPSEEK_BASE_URL="https://api.deepseek.com"
DEEPSEEK_CHAT_MODEL="deepseek-chat"
DEEPSEEK_REASONER_MODEL="deepseek-reasoner"
DEEPINFRA_API_KEY="g2x7q2QdcJPtP5Bc8BmtWCaCuqZJ7DYr"
DEEPINFRA_BASE_URL="https://api.deepinfra.com/v1/openai"
DEEPINFRA_DEFAULT_MODEL="meta-llama/Meta-Llama-3.1-405B-Instruct"
HUGGINGFACE_API_KEY="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"
HUGGINGFACE_BASE_URL="https://api-inference.huggingface.co/v1"
HUGGINGFACE_DEFAULT_MODEL="mistralai/Mistral-7B-Instruct-v0.3"
GOOGLE_PROJECT_ID="karacocuk"
GOOGLE_PROJECT_NUMBER="117929191270923435802"
PRODUCTION_SERVER_IP="213.232.235.181"
GOOGLE_CLIENT_ID="279960646827-n81r57arr7ikvjcbs2ooc08om5kppkm7.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
GOOGLE_REDIRECT_URI="https://escortvip.net/api/auth/callback/google"
GTM_ID="GTM-M46MRKSV"
GOOGLE_GA4_PROPERTY_ID="389963655"
GOOGLE_GSC_SITE_ID="531327098"
TUMBLR_CONSUMER_KEY="7DjhAMnz7hyHYQumJb2evbtCMmoriGwmuKErHywHCoyDUBaOYD"
TUMBLR_CONSUMER_SECRET="7eiiuSzlkWOXFjXupa6HtXZ0hIx15r3xUuaPEG4zNWBOa7Bz6E"
TUMBLR_BLOG_NAME="escvipnet"
TUMBLR_ACCESS_TOKEN="5IME6uGtfvjUyrhMKRRVrGdJMVF9NhYQqjCpYwBJG2X5MeQhNc"
TUMBLR_ACCESS_TOKEN_SECRET="KY0y9K7jEfjRx1kVY9JoaeRAerf0kaWMky5Oi3YU3wXZt44AA5"
BITLY_ACCESS_TOKEN="ed616460db9e334881139c3eb03a55512c3e7429"
BLOG_ID="8605049258804928849"
BLOGGER_BATCH_SIZE="10"
CF_API_TOKEN="cfat_JwtaN2nqkC7QxGItIaAbu2nA6TyojAqHS7DWfvpse525d170"
CF_ACCOUNT_ID="b1ec451c33c18d8b854c61c1c4dce140"
CF_EMAIL="onur@istanbulescort.blog"
PROXY_CHEAP_API_KEY="019da7f8-34f1-71db-9d47-fc1fe8eb4f87"
PROXY_CHEAP_API_SECRET="019da7f8-34f1-71db-9d47-fc1fe908055a"
PROXY_CHEAP_ID="1963310"
GITHUB_PAT="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"
DATABASE_URL="postgresql://vuc2026_user:DorukElite2026Secure@localhost:5432/vuc2026?sslmode=disable"
`;

async function restoreEscort() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🛡️ Restoring Escort Server...');

    // 1. Upload .env
    console.log('📤 Uploading .env...');
    await ssh.execCommand(`echo '${envContent.replace(/'/g, "'\\''")}' > /root/hydra/.env`);

    // 2. Clean node_modules and rebuild (Aggressive)
    console.log('🛠️ Cleaning and Rebuilding (This might take a while)...');
    // Using --force to bypass peer dependency issues if any
    const buildCmd = 'rm -rf node_modules .next package-lock.json && npm install --force && npx prisma generate && npm run build';
    const result = await ssh.execCommand(buildCmd, { cwd: '/root/hydra' });
    console.log(result.stdout || result.stderr);

    // 3. Restart PM2
    console.log('🔄 Restarting Services...');
    await ssh.execCommand('pm2 restart hydra-web', { cwd: '/root/hydra' });
    
    console.log('✅ Escort Server Restored!');
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ RESTORE FAILED:', err.message);
  }
}

restoreEscort();
