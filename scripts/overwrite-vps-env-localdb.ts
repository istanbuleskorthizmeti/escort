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
    console.log('✅ Connected to 187.77.111.203.');

    console.log('🔄 Overwriting .env on VPS with localhost DATABASE_URL...');
    
    // We construct the new env file content.
    const newEnv = `TELEGRAM_BOT_TOKEN="8656705130:AAFJr9QsnYASOQgIoAEEw_V8EzobjXH7nBc"
TELEGRAM_CHAT_ID="-1003961137983"
CRM_ENCRYPTION_KEY="f7f34600fab642e58e065d48f6d663dc"
ADMIN_HQ_KEY="drkcnay_2026_elite"
INDEX_NOW_KEY="8771e07e4e31024024720e4a348e10f0"
DRKCNAY_SYSTEM_KEY="212jeAmind!"
SITE_DOMAIN="istanbulescort.blog"
LLM_BASE_URL="https://generativelanguage.googleapis.com/v1beta"
LLM_API_KEY="AIzaSyCJrkR6g0LqhMj32rq6GT8dpmpUDskyqiQ"
LLM_MODEL="gemini-flash-latest"
LLM_GATEWAY_KEY="llmgtwy_g3d1IPSFbzFpz0VGasTKcow6ThgGIJfatrvLPqbi"
GOOGLE_APPLICATION_CREDENTIALS="google-key.json"
GOOGLE_WORKSPACE_EMAIL="info@dorukcanay.digital"
GTM_BACKEND_URL="http://127.0.0.1:8080"
OPENAI_API_KEY="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"
DEEPSEEK_API_KEY="sk-31035d35e3d9457aa17bbf38797d284a"
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
PRODUCTION_SERVER_IP="187.77.111.203"
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
BITLY_ACCESS_TOKEN="dcfb6cbef7b15015d8aa3abc990ed559109de328"
BLOG_ID="8605049258804928849"
BLOGGER_BATCH_SIZE="10"
PREMIUM_PROXY_URL="http://8U8ZZHjMiUiPdnF:P3ZbAc2rvW4xd9K_country-TR_region-istanbul_session-27696685_ttl-10@thehub.proxy-cheap.com:8080"
PROXY_LIST="http://8U8ZZHjMiUiPdnF:P3ZbAc2rvW4xd9K_country-TR_region-istanbul_session-27696685_ttl-10@thehub.proxy-cheap.com:8080,http://8U8ZZHjMiUiPdnF:P3ZbAc2rvW4xd9K_country-TR_region-istanbul_session-26121388_ttl-10@thehub.proxy-cheap.com:8080,http://8U8ZZHjMiUiPdnF:P3ZbAc2rvW4xd9K_country-TR_region-istanbul_session-15939989_ttl-10@thehub.proxy-cheap.com:8080,http://8U8ZZHjMiUiPdnF:P3ZbAc2rvW4xd9K_country-TR_region-istanbul_session-34687617_ttl-10@thehub.proxy-cheap.com:8080,http://8U8ZZHjMiUiPdnF:P3ZbAc2rvW4xd9K_country-TR_region-istanbul_session-37165357_ttl-10@thehub.proxy-cheap.com:8080"
FORCE_PROXY="false"
CF_API_TOKEN="cfat_XZOqfgE0ToGskESZ6SMEgboAVeGeZz1rcXBdIIona3784f9f"
CF_ACCOUNT_ID="b1ec451c33c18d8b854c61c1c4dce140"
CF_EMAIL="onur@istanbulescort.blog"
PROXY_CHEAP_API_KEY="019da7f8-34f1-71db-9d47-fc1fe8eb4f87"
PROXY_CHEAP_API_SECRET="019da7f8-34f1-71db-9d47-fc1fe908055a"
PROXY_CHEAP_ID="1963310"
GITHUB_PAT="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"
GBP_ACCESS_TOKEN="ya29.a0Aa7MYiqRohsTraRW_oJqNesKc5Ux0Q7nqYLvyIonG7Lnzw4ToABtPlBZmYXgTB1eVPS3ub7dUi6JsbNv3MxyTNRf-BfPzixMx45LWi2Qdlh5WZ_CSRQ471fxs_Cm7oNJfh0mgRxzfRFyii3ptFuOdlldV7wNX-s2lcvmzsqtEJKjVg5PtbQ17M1MnYvQktw77Ug9DS8aCgYKATkSARYSFQHGX2Mic4bTBnn0lAgFpzan3xYikg0206"
GOOGLE_API_KEY="AIzaSyCJrkR6g0LqhMj32rq6GT8dpmpUDskyqiQ"
PAGESPEED_API_KEY="AIzaSyDuPRdF2fh6ja35xqxZmBmEp3gFQ0poRIM"
DATABASE_URL="postgresql://vuc2026_user:vuc2026_pass@127.0.0.1:5432/vuc2026?sslmode=disable"
SSH_HOST="213.232.235.181"
SSH_USER="root"
SSH_PASSWORD="4TVuj7qiHMfh7CxH6K!"
ATTACK_SERVER_IP="187.77.111.203"
ATTACK_SERVER_USER="root"
ATTACK_SERVER_PASS="Z4-nN8JfiUIh5,;g"`;

    // Write file directly using ssh
    await ssh.execCommand(`cat << 'EOF' > /root/esc/.env\n${newEnv}\nEOF`);
    console.log('✅ Overwritten remote .env');

    // Reload PM2 to apply changes
    console.log('🔄 Reloading PM2 applications to apply env changes...');
    await ssh.execCommand('pm2 reload all', { cwd: '/root/esc' });
    console.log('✅ PM2 reloaded.');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
