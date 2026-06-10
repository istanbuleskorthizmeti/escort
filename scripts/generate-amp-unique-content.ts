import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { omniAI } from '../lib/ai-provider';
import { slugify } from '../lib/utils';

const districts = [
  'istanbul', 'kadikoy', 'besiktas', 'sisli', 'beylikduzu', 'bakirkoy', 
  'atasehir', 'esenyurt', 'fatih', 'bagcilar', 'bahcelievler', 'umraniye', 
  'pendik', 'maltepe', 'kartal', 'sariyer', 'uskudar', 'avcilar', 
  'kagitthane', 'sancaktepe', 'basaksehir', 'esenler', 'eyupsultan', 'beykoz', 
  'beyoglu', 'cekmekoy', 'tuzla', 'arnavutkoy', 'gaziosmanpasa', 'sultanbeyli', 
  'gungoren', 'zeytinburnu', 'sile', 'catalca', 'silivri', 'buyukcekmece', 
  'kucukcekmece', 'adalar', 'bayrampasa', 'sultangazi'
];

const trMapNames: { [key: string]: string } = {
  istanbul: 'İstanbul', kadikoy: 'Kadıköy', besiktas: 'Beşiktaş',
  sisli: 'Şişli', beylikduzu: 'Beylikdüzü', bakirkoy: 'Bakırköy',
  atasehir: 'Ataşehir', esenyurt: 'Esenyurt', fatih: 'Fatih',
  bagcilar: 'Bağcılar', bahcelievler: 'Bahçelievler', umraniye: 'Ümraniye',
  pendik: 'Pendik', maltepe: 'Maltepe', kartal: 'Kartal',
  sariyer: 'Sarıyer', uskudar: 'Üsküdar', avcilar: 'Avcılar',
  kagitthane: 'Kağıthane', sancaktepe: 'Sancaktepe', basaksehir: 'Başakşehir',
  esenler: 'Esenler', eyupsultan: 'Eyüpsultan', beykoz: 'Beykoz',
  beyoglu: 'Beyoğlu', cekmekoy: 'Çekmeköy', tuzla: 'Tuzla',
  arnavutkoy: 'Arnavutköy', gaziosmanpasa: 'Gaziosmanpaşa', sultanbeyli: 'Sultanbeyli',
  gungoren: 'Güngören', zeytinburnu: 'Zeytinburnu', sile: 'Şile',
  catalca: 'Çatalca', silivri: 'Silivri', buyukcekmece: 'Büyükçekmece',
  kucukcekmece: 'Küçükçekmece', adalar: 'Adalar', bayrampasa: 'Bayrampaşa',
  sultangazi: 'Sultangazi'
};

const DATA_FILE = path.join(process.cwd(), 'data', 'amp_unique_content.json');

interface AmpContentItem {
  text: string;
  faq: { q: string; a: string }[];
}

interface AmpContentMap {
  [districtSlug: string]: AmpContentItem;
}

async function run() {
  console.log('🚀 [AMP-GEN] Starting unique content generation for AMP route...');

  let contentMap: AmpContentMap = {};
  if (fs.existsSync(DATA_FILE)) {
    try {
      contentMap = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      console.log(`📖 Loaded existing ${Object.keys(contentMap).length} records from data file.`);
    } catch (e) {
      console.warn('⚠️ Could not parse existing data file, starting fresh.');
    }
  }

  // Ensure data directory exists
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Force systemPrompt using deepseek provider
  const systemPrompt = `You are a professional conversion copywriter specializing in high-luxury VIP escort, companion, and model companion platforms. Your goal is to write natural, highly engaging, and non-repetitive Turkish copy that appeals to premium clients. Avoid generic phrasing or spammy keyword-stuffing. Use sophisticated and descriptive terminology ("lüks refakatçi", "seçkin partner deneyimi", "güvenilir buluşma prensipleri").`;

  // Process sequentially to keep API rate limits safe and log progression clearly
  for (const slug of districts) {
    if (contentMap[slug] && contentMap[slug].text && contentMap[slug].text.length > 50) {
      console.log(`⏭️ [AMP-GEN] Skipping ${slug} (Already exists).`);
      continue;
    }

    const locName = trMapNames[slug] || slug;
    console.log(`🤖 [AMP-GEN] Requesting unique DeepSeek generation for: ${locName}...`);

    const prompt = `İstanbul'un ${locName} ilçesi için, o bölgede lüks ve VIP escort/partner arayan seçkin müşterilere yönelik 120-150 kelimelik tamamen özgün bir SEO tanıtım ve rehber metni yaz. Ardından o ilçeye özel 2 adet Soru-Cevap (FAQ) oluştur.
    
Metin içinde şu anahtar kelimeleri ve varyasyonlarını tamamen doğal, akıcı ve profesyonel bir üslupla erit: "${locName} escort", "çıtır gacı", "kaporasız randevu", "eve ve otele servis", "doğrulanmış fotoğraflar".
Ödeme modelinin kesinlikle kaporasız olduğunu, herhangi bir ön ödeme veya depozito alınmadığını, görüşmenin tamamen yüz yüze ve elden ödemeli olduğunu vurgula. Güvenlik ve gizlilik ilkelerinden bahset.

Çıktıyı kesinlikle şu JSON formatında döndür, markdown veya açıklama yazısı ekleme:
{
  "text": "[Oluşturduğun 120-150 kelimelik tanıtım metni]",
  "faq": [
    {"q": "[Soru 1]?", "a": "[Cevap 1]"},
    {"q": "[Soru 2]?", "a": "[Cevap 2]"}
  ]
}`;

    try {
      const response = await omniAI.generate(prompt, {
        provider: 'deepseek',
        model: 'deepseek-chat',
        temperature: 0.7,
        systemPrompt,
        max_tokens: 1500
      });

      // Parse JSON from response
      let parsed: AmpContentItem;
      try {
        const cleanJson = response.includes('```json') 
          ? response.split('```json')[1].split('```')[0].trim() 
          : response.trim();
        parsed = JSON.parse(cleanJson);
      } catch (jsonErr) {
        console.error(`❌ Failed to parse JSON response for ${slug}:`, response);
        continue;
      }

      if (parsed.text && parsed.faq && Array.isArray(parsed.faq)) {
        contentMap[slug] = parsed;
        // Save incrementally to prevent losing work
        fs.writeFileSync(DATA_FILE, JSON.stringify(contentMap, null, 2), 'utf8');
        console.log(`✅ [AMP-GEN] Generated & saved: ${slug}`);
      } else {
        console.warn(`⚠️ [AMP-GEN] Invalid fields returned for ${slug}:`, parsed);
      }

      // Add a small delay between requests to be polite to the API
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (err: any) {
      console.error(`💥 [AMP-GEN] Error generating for ${slug}:`, err.message);
    }
  }

  console.log('🏁 [AMP-GEN] Finished generating unique content for all districts!');
}

run().catch(console.error);
