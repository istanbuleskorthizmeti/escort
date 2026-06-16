import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env explicitly
dotenv.config({ path: path.join(__dirname, '../.env') });

const keysToTest = {
  gemini_env: process.env.GOOGLE_API_KEY || '',
  gemini_llm: process.env.LLM_API_KEY || '',
  openai: process.env.OPENAI_API_KEY || '',
  deepseek: process.env.DEEPSEEK_API_KEY || '',
  deepinfra: process.env.DEEPINFRA_API_KEY || '',
  huggingface: process.env.HUGGINGFACE_API_KEY || '',
};

async function testGemini(key: string, name: string) {
  if (!key) {
    console.log(`❌ [GEMINI - ${name}] No key provided.`);
    return;
  }
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    const res = await axios.post(url, {
      contents: [{ parts: [{ text: "Respond only with 'Hello'" }] }]
    }, { timeout: 10000 });
    const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    console.log(`✅ [GEMINI - ${name}] Success:`, text);
  } catch (err: any) {
    console.log(`❌ [GEMINI - ${name}] Failed:`, err.response?.data?.error?.message || err.message);
  }
}

async function testOpenAI() {
  const key = keysToTest.openai;
  if (!key) {
    console.log(`❌ [OPENAI] No key.`);
    return;
  }
  try {
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say hello' }],
      max_tokens: 10
    }, {
      headers: { Authorization: `Bearer ${key}` },
      timeout: 10000
    });
    console.log(`✅ [OPENAI] Success:`, res.data.choices?.[0]?.message?.content?.trim());
  } catch (err: any) {
    console.log(`❌ [OPENAI] Failed:`, err.response?.data?.error?.message || err.message);
  }
}

async function testDeepSeek() {
  const key = keysToTest.deepseek;
  if (!key) {
    console.log(`❌ [DEEPSEEK] No key.`);
    return;
  }
  try {
    const res = await axios.post('https://api.deepseek.com/chat/completions', {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: 'Say hello' }],
      max_tokens: 10
    }, {
      headers: { Authorization: `Bearer ${key}` },
      timeout: 10000
    });
    console.log(`✅ [DEEPSEEK] Success:`, res.data.choices?.[0]?.message?.content?.trim());
  } catch (err: any) {
    console.log(`❌ [DEEPSEEK] Failed:`, err.response?.data?.error?.message || err.message);
  }
}

async function testDeepInfra() {
  const key = keysToTest.deepinfra;
  if (!key) {
    console.log(`❌ [DEEPINFRA] No key.`);
    return;
  }
  try {
    const res = await axios.post('https://api.deepinfra.com/v1/openai/chat/completions', {
      model: 'meta-llama/Meta-Llama-3-70b-instruct',
      messages: [{ role: 'user', content: 'Say hello' }],
      max_tokens: 10
    }, {
      headers: { Authorization: `Bearer ${key}` },
      timeout: 10000
    });
    console.log(`✅ [DEEPINFRA] Success:`, res.data.choices?.[0]?.message?.content?.trim());
  } catch (err: any) {
    console.log(`❌ [DEEPINFRA] Failed:`, err.response?.data?.error?.message || err.message);
  }
}

async function testHuggingFace() {
  const key = keysToTest.huggingface;
  if (!key) {
    console.log(`❌ [HUGGINGFACE] No key.`);
    return;
  }
  try {
    const res = await axios.post('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3', {
      inputs: "Say hello",
    }, {
      headers: { Authorization: `Bearer ${key}` },
      timeout: 10000
    });
    console.log(`✅ [HUGGINGFACE] Success:`, JSON.stringify(res.data));
  } catch (err: any) {
    console.log(`❌ [HUGGINGFACE] Failed:`, err.response?.data?.error?.message || err.message);
  }
}

async function run() {
  console.log("Starting Key Tests...");
  console.log("Keys found:", Object.keys(keysToTest).filter(k => !!(keysToTest as any)[k]));
  
  await testGemini(keysToTest.gemini_env, "GOOGLE_API_KEY");
  await testGemini(keysToTest.gemini_llm, "LLM_API_KEY");
  await testOpenAI();
  await testDeepSeek();
  await testDeepInfra();
  await testHuggingFace();
}

run();
