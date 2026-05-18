require('dotenv').config();
const axios = require('axios');

const tokens = (process.env.BITLY_ACCESS_TOKEN || "").split(',').map(t => t.trim()).filter(Boolean);
const proxyUrl = process.env.PREMIUM_PROXY_URL;

async function testTokenWithProxy(token, index) {
  console.log(`\n🔑 Testing Token #${index} with proxy: ${token.substring(0, 6)}...`);
  
  const axiosConfig = {
    url: "https://api-ssl.bitly.com/v4/user",
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  };

  if (proxyUrl) {
    try {
      const urlObj = new URL(proxyUrl);
      axiosConfig.proxy = {
        protocol: urlObj.protocol.replace(':', ''),
        host: urlObj.hostname,
        port: parseInt(urlObj.port),
        auth: {
          username: urlObj.username,
          password: urlObj.password
        }
      };
      console.log(`📡 Using residential proxy: ${urlObj.hostname}:${urlObj.port}`);
    } catch (e) {
      console.warn("⚠️ Proxy URL parsing failed, trying direct connection.");
    }
  }

  try {
    const res = await axios(axiosConfig);
    console.log(`✅ Token #${index} is VALID! User:`, res.data.login || res.data.name);
    return true;
  } catch (err) {
    const errorMsg = err.response ? JSON.stringify(err.response.data) : err.message;
    console.error(`❌ Token #${index} failed:`, errorMsg);
    return false;
  }
}

async function run() {
  console.log("🚀 Testing Bitly tokens via premium residential proxy...");
  for (let i = 0; i < tokens.length; i++) {
    await testTokenWithProxy(tokens[i], i);
  }
}

run();
