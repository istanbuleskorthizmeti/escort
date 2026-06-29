const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const keyFiles = [
  'google-key-lyrical.json',
  'google-key-model-osprey.json',
  'google-key-sovereign.json',
  'google-key-starry.json',
  'hydra-gcp-key.json'
];

async function testKey(filename) {
  const keyPath = path.join('/root/esc', filename);
  if (!fs.existsSync(keyPath)) {
    console.log(`[SKIP] ${filename}: file not found`);
    return;
  }
  try {
    const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    const fixedKey = keyData.private_key.replace(/\\n/g, '\n');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: keyData.client_email,
        private_key: fixedKey,
      },
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });
    const token = await auth.getAccessToken();
    console.log(`[OK]   ${filename} (${keyData.client_email}) -> Token: ${token ? token.substring(0,20)+'...' : 'null'}`);
  } catch (err) {
    console.log(`[FAIL] ${filename}: ${err.message}`);
  }
}

(async () => {
  for (const f of keyFiles) {
    await testKey(f);
  }
  console.log('Done.');
})();
