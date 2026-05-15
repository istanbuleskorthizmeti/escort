
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function refreshProxy() {
    console.log("🕵️‍♂️ [PROXY-GEN] Fetching fresh Istanbul proxy from Proxy-Cheap...");
    
    const apiKey = process.env.PROXY_CHEAP_API_KEY;
    const apiSecret = process.env.PROXY_CHEAP_API_SECRET;
    
    try {
        // Proxy-Cheap API call to get active residential proxies
        const response = await axios.get('https://api.proxy-cheap.com/v2/residential/proxies', {
            headers: {
                'X-Api-Key': apiKey,
                'X-Api-Secret': apiSecret
            }
        });
        
        console.log("✅ [PROXY-GEN] Success! New proxy data received.");
        console.log(JSON.stringify(response.data, null, 2));
        
        // Form the URL (Example format, adjust based on actual API response)
        // Note: You might need to rotate or generate a specific one.
    } catch (err: any) {
        console.error("❌ [PROXY-GEN] Error:", err.response?.data || err.message);
    }
}

refreshProxy();
