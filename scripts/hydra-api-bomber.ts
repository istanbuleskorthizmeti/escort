import axios from 'axios';
import dotenv from 'dotenv';
import { DRKCNAYSpintax } from '../lib/spintax-engine';
import { cities } from '../lib/locations';
import { slugify, toTitleCaseTR } from '../lib/utils';
import fs from 'fs';
import path from 'path';

dotenv.config();

/**
 * ⚡ HYDRA API BOMBER [GOD MODE] ⚡
 * Yüksek Otoriteli (DR 85+) platformlara (Dev.to, Hashnode vb.) 
 * saniyeler içinde otomatik SEO makaleleri (Parazit) basar.
 */

// .env dosyasından API anahtarlarını al
const DEVTO_API_KEY = process.env.DEVTO_API_KEY || ''; // Dev.to > Settings > Extensions > Generate API Key
const HASHNODE_API_KEY = process.env.HASHNODE_API_KEY || ''; // Hashnode > Developer Settings > Personal Access Token
const HASHNODE_PUBLICATION_ID = process.env.HASHNODE_PUBLICATION_ID || ''; // Hashnode Blog ID'si

// Hedef Platformları Seç
const ENABLE_DEVTO = true;
const ENABLE_HASHNODE = false; // Hashnode kullanmak istersen true yap

const BRAND_NAME = "DRKCNAY ELITE";
const MAIN_URL = "https://istanbulescort.blog"; // veya dorukcanay.digital

function logEvent(msg: string) {
  const timestamp = new Date().toLocaleTimeString('tr-TR');
  console.log(`[${timestamp}] 🚀 ${msg}`);
}

async function publishToDevTo(title: string, content: string, tags: string[]) {
  if (!DEVTO_API_KEY) {
    console.log("⚠️ DEVTO_API_KEY bulunamadı. Atlanıyor...");
    return null;
  }

  try {
    const response = await axios.post(
      'https://dev.to/api/articles',
      {
        article: {
          title: title,
          body_markdown: content,
          published: true,
          tags: tags.slice(0, 4) // Dev.to max 4 etiket kabul eder
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': DEVTO_API_KEY
        }
      }
    );
    return response.data.url;
  } catch (error: any) {
    console.error(`❌ Dev.to Hatası (${title}):`, error.response?.data || error.message);
    return null;
  }
}

async function publishToHashnode(title: string, content: string, tags: string[]) {
  if (!HASHNODE_API_KEY || !HASHNODE_PUBLICATION_ID) {
    console.log("⚠️ HASHNODE bilgileri eksik. Atlanıyor...");
    return null;
  }

  const query = `
    mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) {
        post {
          url
        }
      }
    }
  `;

  // Etiketlerin id veya slug karşılıklarını bulmak gerekebilir, basitleştirilmiş hali:
  const variables = {
    input: {
      title: title,
      contentMarkdown: content,
      publicationId: HASHNODE_PUBLICATION_ID,
      // Hashnode tag ID'leri gerektirir, şimdilik boş geçilebilir veya statik eklenebilir
      tags: [] 
    }
  };

  try {
    const response = await axios.post(
      'https://gql.hashnode.com/',
      { query, variables },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': HASHNODE_API_KEY
        }
      }
    );

    if (response.data.errors) {
       console.error(`❌ Hashnode Hatası (${title}):`, response.data.errors);
       return null;
    }
    return response.data.data.publishPost.post.url;
  } catch (error: any) {
    console.error(`❌ Hashnode Hatası (${title}):`, error.message);
    return null;
  }
}

async function runBomber() {
  logEvent('HYDRA API BOMBER (Dev.to & Hashnode) Başlatılıyor...');

  const istanbul = cities['istanbul'];
  if (!istanbul) {
    logEvent('❌ İstanbul lokasyon verisi bulunamadı!');
    return;
  }

  const generatedUrls: string[] = [];
  
  // Sadece ana ilçeleri (39 adet) hedef alalım
  for (const district of istanbul.districts) {
    const locationName = district.name;
    const slug = district.slug;
    
    logEvent(`Hedef İşleniyor: ${locationName}...`);

    const spintaxEngine = new DRKCNAYSpintax(locationName + "api-bomber");

    // 1. Makale Başlığı Oluştur
    const titleTemplate = "{👑|💎|🔥} [LOC] Escort | [LOC] VIP Eskort Bayan {Rehberi|Kataloğu|İlanları} {2026|Kaporasız}";
    const title = spintaxEngine.resolve(titleTemplate, { LOC: locationName });

    // 2. Makale İçeriği Oluştur (Markdown Formatında)
    const contentTemplate = `
# ${title}

{[LOC] genelinde {seçkin ve lüks|asillik ve ihtişam dolu} bir {refakatçi deneyimi|VIP partnerlik} sunuyoruz.} {Dorukcanay Elite güvencesi altında, {tamamen doğrulanmış fotoğraflar|profesyonel model vitrini} ile {akıllardan silinmeyecek|unutulmaz} bir seans planlayın.}

## [LOC] Kaporasız VIP Görüşmeler

{Buluşmalarımızda {kesinlikle ön ödeme|hiçbir şekilde kapora} talep edilmeyip, {yüz yüze ve elden ödeme|güvenilir elden ödemeli model} esastır.} {{Gizlilik ve maksimum mahremiyet|Üst düzey güvenlik standartları} altında otele ve eve gelen {seçkin manken ve partnerlerimizle|elit eşlikçilerimizle} {hayal ettiğiniz prestijli geceyi|C-Level buluşmayı} başlatın.}

### Hızlı İletişim ve Orijinal Profil
Resmi sitemiz üzerinden kızların %100 gerçek resimlerine ulaşabilir ve doğrudan WhatsApp ile iletişime geçebilirsiniz.

👉 **Resmi Katalog İçin Tıklayın:** [${locationName} Escort VIP Ziyaret Et](${MAIN_URL}/istanbul/${slug})

👉 **Tüm İstanbul Bölgeleri:** [${BRAND_NAME} Ana Sayfa](${MAIN_URL})

*Gizlilik Kuralları: Tüm kayıtlar anonimdir ve müşteri verisi tutulmaz.*
`;
    
    const content = spintaxEngine.resolve(contentTemplate, { LOC: locationName });
    const tags = ['istanbul', 'escort', slug, 'vip'];

    // DEV.TO'ya Bas
    if (ENABLE_DEVTO) {
      const devToUrl = await publishToDevTo(title, content, tags);
      if (devToUrl) {
        logEvent(`✅ Dev.to Başarılı: ${devToUrl}`);
        generatedUrls.push(devToUrl);
      }
      await new Promise(r => setTimeout(r, 2000)); // Rate limit yememek için 2 saniye bekle
    }

    // HASHNODE'a Bas
    if (ENABLE_HASHNODE) {
      const hashnodeUrl = await publishToHashnode(title, content, tags);
      if (hashnodeUrl) {
        logEvent(`✅ Hashnode Başarılı: ${hashnodeUrl}`);
        generatedUrls.push(hashnodeUrl);
      }
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  logEvent(`🎉 Operasyon Tamamlandı! ${generatedUrls.length} yeni parazit link üretildi.`);
  
  if (generatedUrls.length > 0) {
    const outputFilePath = path.join(process.cwd(), 'data', 'api_bomber_results.txt');
    fs.appendFileSync(outputFilePath, generatedUrls.join('\n') + '\n', 'utf8');
    logEvent(`🔗 Tüm linkler buraya kaydedildi: ${outputFilePath}`);
    logEvent(`💡 İpucu: Şimdi bu linkleri "google-ultra-ping.ts" ile Google'a fırlatabilirsiniz!`);
  }
}

runBomber();
