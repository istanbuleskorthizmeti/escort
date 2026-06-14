import { generateEliteOmniContent } from '../lib/ai-seo';
import dotenv from 'dotenv';

dotenv.config();

async function testUpgrade() {
  console.log('🚀 [TEST] Gemini 3.1 Pro "Copywriter" Motoru Test Ediliyor...');
  
  const params = {
    city: 'Istanbul',
    district: 'Besiktas',
    neighborhood: 'Bebek',
    host: 'istanbulescort.blog'
  };

  try {
    const start = Date.now();
    const content = await generateEliteOmniContent(params);
    const end = Date.now();

    console.log('✅ [SUCCESS] Icerik Basariyla Uretildi!');
    console.log(`⏱️ Sure: ${(end - start) / 1000}s`);
    console.log('---');
    console.log(`Baslik: ${content.wordpress.title}`);
    console.log(`Kelime Sayisi: ${content.wordpress.content.split(' ').length}`);
    console.log('---');
    console.log('Icerik Onizleme (Ilk 500 karakter):');
    console.log(content.wordpress.content.substring(0, 500) + '...');
    
  } catch (error) {
    console.error('❌ [ERROR] Test sirasinda hata olustu:', error);
  }
}

testUpgrade();
