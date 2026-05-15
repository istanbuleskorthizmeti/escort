import axios from 'axios';
import "dotenv/config";

async function test() {
    const proxyUrl = process.env.PREMIUM_PROXY_URL;
    console.log("Testing Proxy URL:", proxyUrl);
    
    if (!proxyUrl) return;

    const urlObj = new URL(proxyUrl);
    
    try {
        const response = await axios.get('https://api.ipify.org?format=json', {
            proxy: {
                protocol: urlObj.protocol.replace(':', ''),
                host: urlObj.hostname,
                port: parseInt(urlObj.port),
                auth: {
                    username: urlObj.username,
                    password: urlObj.password
                }
            },
            timeout: 10000
        });
        console.log("Success! IP:", response.data.ip);
    } catch (e: any) {
        console.error("Failed:", e.message);
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Data:", e.response.data);
        }
    }
}

test();
