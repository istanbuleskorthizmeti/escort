require('dotenv').config();
const axios = require('axios');

const tokens = (process.env.BITLY_ACCESS_TOKEN || "").split(',').map(t => t.trim()).filter(Boolean);

async function testToken(token, index) {
  console.log(`\n🔑 Testing Token #${index}: ${token.substring(0, 6)}...`);
  try {
    const res = await axios.get("https://api-ssl.bitly.com/v4/user", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log(`✅ Token #${index} is VALID! User:`, res.data.login || res.data.name);
    return true;
  } catch (err) {
    const errorMsg = err.response ? JSON.stringify(err.response.data) : err.message;
    console.error(`❌ Token #${index} is INVALID! Error:`, errorMsg);
    return false;
  }
}

async function run() {
  console.log("🚀 Testing all configured Bitly tokens...");
  console.log(`Tokens count: ${tokens.length}`);
  for (let i = 0; i < tokens.length; i++) {
    await testToken(tokens[i], i);
  }
}

run();
