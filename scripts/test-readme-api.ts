import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.README_API_KEY || 'rdme_xn8s9h65127df9243b79abce5c172c8b13db7518c2d129598202c2d646dc2fda0d111b';

async function testApiKey() {
  console.log("Checking API key:", API_KEY.substring(0, 10) + "...");
  const authHeader = 'Basic ' + Buffer.from(API_KEY + ':').toString('base64');
  
  try {
    const res = await axios.get('https://api.readme.com/v1/', {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });
    console.log("SUCCESS! API Key response:", res.data);
  } catch (err: any) {
    console.error("FAILED! Status:", err.response?.status);
    console.error("Data:", err.response?.data);
  }
}

testApiKey();
