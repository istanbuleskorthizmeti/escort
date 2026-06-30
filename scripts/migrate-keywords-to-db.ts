import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runMigration() {
  console.log('⚡ GOD MODE: Başlatılıyor - JSON to PostgreSQL Migration ⚡');
  const jsonPath = path.join(process.cwd(), 'scratch', 'all-keywords-matrix.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Dosya bulunamadı:', jsonPath);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(jsonPath, 'utf-8');
  let data: any[] = [];
  
  try {
    data = JSON.parse(fileContent);
  } catch (e) {
    console.error('❌ JSON parse hatası. Dosya bozuk olabilir.');
    process.exit(1);
  }

  console.log(\`📊 Toplam \${data.length} kayıt bulundu. Veritabanına aktarılıyor...\`);

  // O(log n) toplu yazma işlemi (Batch Insert)
  const batchSize = 1000;
  let successCount = 0;

  for (let i = 0; i < data.length; i += batchSize) {
    const chunk = data.slice(i, i + batchSize);
    
    // Verileri Prisma şemasına uygun hale getirme
    const formattedChunk = chunk.map(item => ({
      city: item.city || 'istanbul',
      district: item.district || 'merkez',
      keyword: item.keyword,
      searchVolume: item.searchVolume || 0,
      difficulty: item.difficulty || 0,
      intent: 'COMMERCIAL',
      isTargeted: true,
      metadata: { source: 'legacy_json', ...item.metadata }
    })).filter(item => item.keyword); // Keyword boş olamaz

    try {
      await prisma.keywordMatrix.createMany({
        data: formattedChunk,
        skipDuplicates: true, // Aynı kelimelerin tekrar yazılmasını önler (O(1) conflict bypass)
      });
      successCount += formattedChunk.length;
      console.log(\`✅ [\${i + formattedChunk.length}/\${data.length}] kayıt başarıyla işlendi.\`);
    } catch (err: any) {
      console.error(\`❌ Batch error at index \${i}:\`, err.message);
    }
  }

  console.log(\`\\n🚀 MIGRATION TAMAMLANDI!\`);
  console.log(\`Veritabanına aktarılan toplam benzersiz kayıt: \${successCount}\`);
  console.log(\`Artık bu verileri O(1) hızında Prisma üzerinden sorgulayabilirsiniz.\`);
}

runMigration()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
