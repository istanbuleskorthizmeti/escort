import { omniAI } from '../lib/ai-provider';
import dotenv from 'dotenv';

dotenv.config();

async function testOpenAI() {
  console.log('🚀 [TEST] OpenAI Testi Baslatiliyor...');
  try {
    // Adding "json" to the prompt to force OpenAI provider
    const res = await omniAI.generate('Selam, bir cümlelik bir selam ver. (json formatinda olsun)', { temperature: 0.7 });
    console.log('AI Cevabi:', res);
  } catch (e) {
    console.error('HATA:', e);
  }
}

testOpenAI();
