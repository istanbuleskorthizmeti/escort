import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.README_API_KEY;

async function testApiKey() {
  console.log("Checking API key with dash.readme.com base URL...");
  const authHeader = 'Basic ' + Buffer.from(API_KEY + ':').toString('base64');
  
  try {
    const res = await axios.get('https://dash.readme.com/api/v1/categories', {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });
    console.log("SUCCESS! Categories:", res.data.map((c: any) => ({ title: c.title, slug: c.slug })));
  } catch (err: any) {
    console.error("FAILED! Status:", err.response?.status);
    console.error("Data:", err.response?.data);
  }
}

testApiKey();
