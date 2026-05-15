import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function testDirect() {
  const apiKey = process.env.LLM_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
  const model = process.env.LLM_MODEL || 'gemini-2.0-flash';
  const url = `${baseUrl}/models/${model}:generateContent?key=${apiKey}`;

  console.log(`📡 [TEST] Direct calling API: ${url}`);
  try {
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: "hi" }] }]
    });
    console.log('✅ Response:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.response) console.log(JSON.stringify(error.response.data, null, 2));
  }
}

testDirect();
