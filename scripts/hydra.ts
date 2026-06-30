import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// ⚡ GOD MODE: HYDRA CENTRAL COMMAND (CLI) ⚡
// Yüzlerce dağınık script'i tek bir merkezi sinir sistemine (router) bağlıyoruz.

const [, , command, ...args] = process.argv;

const SCRIPTS_DIR = path.join(process.cwd(), 'scripts');

// Hydra'nın alt komut eşleştirmeleri (Modüler yapı - O(1) Lookup)
const COMMAND_REGISTRY: Record<string, string> = {
  // Veritabanı ve Migration
  'db:migrate': 'migrate-keywords-to-db.ts',
  
  // SEO ve Temizlik
  'seo:sanitize': 'sanitize-keywords.ts',
  'seo:ping': 'ping-all.ts',
  
  // İçerik ve Raporlama
  'content:district': 'generate-district-texts.ts',
  'report:comprehensive': 'send-comprehensive-report.ts',

  // Bot ve Saldırı Ağları (Kayıtlı olanlardan örnekler)
  'attack:api': 'hydra-api-bomber.ts',
  'attack:ctr': 'hydra-ctr-assassin.ts',
  'attack:swarm': 'god-mode-swarm.ts',
};

function showHelp() {
  console.log(\`
🔥 HYDRA COMMAND CENTER - GOD MODE 🔥
Kullanım: npm run hydra -- <komut> [parametreler]

Mevcut Komutlar:\`);

  Object.entries(COMMAND_REGISTRY).forEach(([cmd, script]) => {
    console.log(\`  👉 \x1b[36m\${cmd.padEnd(25)}\x1b[0m (\${script})\`);
  });

  console.log(\`\\n💡 İpucu: Listede olmayan bir script'i direkt adıyla da çalıştırabilirsiniz.\`);
  console.log(\`Örnek: npm run hydra -- script-adi.ts\`);
}

async function executeScript(scriptName: string, passArgs: string[]) {
  const scriptPath = path.join(SCRIPTS_DIR, scriptName);

  if (!fs.existsSync(scriptPath)) {
    console.error(\`❌ Hata: Hedef script bulunamadı -> \${scriptPath}\`);
    process.exit(1);
  }

  console.log(\`🚀 Başlatılıyor: \x1b[33m\${scriptName}\x1b[0m...\`);

  // tsx kullanarak scripti child_process ile spawn ediyoruz
  const child = spawn('npx', ['tsx', scriptPath, ...passArgs], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log(\`\\n✅ \x1b[32mGörev başarıyla tamamlandı.\x1b[0m\`);
    } else {
      console.log(\`\\n❌ \x1b[31mGörev hata ile sonlandı (Exit Code: \${code}).\x1b[0m\`);
    }
  });
}

// Komut Yönlendirici (Router)
if (!command || command === 'help' || command === '--help') {
  showHelp();
} else {
  // Eğer komut registry'de varsa eşleşen scripti bul, yoksa kullanıcının yazdığı ismi direkt script olarak kabul et
  const targetScript = COMMAND_REGISTRY[command] || (command.endsWith('.ts') ? command : \`\${command}.ts\`);
  executeScript(targetScript, args);
}
