import { omniAI } from '../lib/ai-provider';
import dotenv from 'dotenv';

dotenv.config();

async function testSimple() {
  console.log('🚀 [TEST] Basit AI Testi Baslatiliyor...');
  try {
    const res = await omniAI.generate('Selam, bir cümlelik bir selam ver.', { temperature: 0.7 });
    console.log('AI Cevabi:', res);
  } catch (e) {
    console.error('HATA:', e);
  }
}

testSimple();
