import * as fs from 'fs';
import * as path from 'path';

/**
 * ⚡ HYDRA STOPLIGHT PARASITE SEO GENERATOR
 * Generates an optimized, spun-content documentation structure
 * compatible with Stoplight.io projects to dominate search rankings.
 */

// 1. Data Structures & Configurations
const DEFAULT_HOST = 'istanbulescort.blog';

const TOP_CITIES: Record<string, string[]> = {
  'Istanbul': [
    'Besiktas', 'Sisli', 'Beylikduzu', 'Kadikoy', 'Bakirkoy', 'Atasehir', 
    'Esenyurt', 'Fatih', 'Sariyer', 'Uskudar', 'Avcilar', 'Kagitthane', 
    'Beyoglu', 'Kartal', 'Maltepe', 'Pendik', 'Umraniye', 'Bahcelievler', 
    'Zeytinburnu', 'Buyukcekmece', 'Kucukcekmece'
  ],
  'Ankara': [
    'Cankaya', 'Kizilay', 'Kecioren', 'Yenimahalle', 'Mamak', 'Etimesgut', 
    'Altindag', 'Sincan', 'Golbasi', 'Pursaklar', 'Eryaman'
  ],
  'Izmir': [
    'Alsancak', 'Karsiyaka', 'Konak', 'Bornova', 'Buca', 'Cesme', 
    'Alacati', 'Bayrakli', 'Balcova', 'Gaziemir', 'Narlidere'
  ],
  'Antalya': [
    'Muratpasa', 'Konyaalti', 'Kepez', 'Alanya', 'Manavgat', 'Serik', 
    'Kemer', 'Kas', 'Lara'
  ],
  'Bursa': [
    'Nilufer', 'Osmangazi', 'Yildirim', 'Mudanya', 'Gemlik', 'Inegol'
  ],
  'Adana': [
    'Seyhan', 'Cukurova', 'Yuregir', 'Saricam'
  ],
  'Mugla': [
    'Bodrum', 'Marmaris', 'Fethiye', 'Milas', 'Datca', 'Ortaca'
  ],
  'Kocaeli': [
    'Izmit', 'Gebze', 'Darica', 'Korfez', 'Kartepe', 'Basiskele'
  ],
  'Eskisehir': [
    'Odunpazari', 'Tepebasi'
  ],
  'Gaziantep': [
    'Sahinbey', 'Sehitkamil'
  ]
};

const ALL_CITIES = [
  'Adana', 'Adiyaman', 'Afyonkarahisar', 'Agri', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 
  'Ardahan', 'Artvin', 'Aydin', 'Balikesir', 'Bartin', 'Batman', 'Bayburt', 'Bilecik', 
  'Bingol', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Canakkale', 'Cankiri', 'Corum', 'Denizli', 
  'Diyarbakir', 'Duzce', 'Edirne', 'Elazig', 'Erzincan', 'Erzurum', 'Eskisehir', 'Gaziantep', 
  'Giresun', 'Gumushane', 'Hakkari', 'Hatay', 'Igdir', 'Isparta', 'Istanbul', 'Izmir', 
  'Kahramanmaras', 'Karabuk', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kirikkale', 
  'Kirklareli', 'Kirsehir', 'Kilis', 'Kocaeli', 'Konya', 'Kutahya', 'Malatya', 'Manisa', 
  'Mardin', 'Mersin', 'Mugla', 'Mus', 'Nevsehir', 'Nigde', 'Ordu', 'Osmaniye', 'Rize', 
  'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Sanliurfa', 'Sirnak', 'Tekirdag', 
  'Tokat', 'Trabzon', 'Tunceli', 'Usak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

const FEMALE_NAMES = [
  'Aylin', 'Buse', 'Ceren', 'Derin', 'Ece', 'Figen', 'Gizem', 'Hande', 'Irem', 'Jale',
  'Kubra', 'Lara', 'Merve', 'Nihan', 'Ozge', 'Pelin', 'Rüya', 'Selin', 'Tugce', 'Umut',
  'Verda', 'Yasemin', 'Zehra', 'Asli', 'Begum', 'Cansel', 'Didem', 'Elif', 'Gamze', 'Hulya'
];

// Spun Content Arrays
const INTRO_TEMPLATES = [
  "**{sehir} {ilce}** bölgesinde lüks ve vip {secenek} arayanlar için hazırlanan en özel rehberdesiniz. Bu sayfada, {sehir} genelinde {hizmet} sunan bağımsız profillerin güncel vitrin görsellerine ve detaylı ilanlarına ulaşabilirsiniz.",
  "Günlük hayatın yoğunluğuna ara verip kendinize özel, konforlu bir mola yaratmak istiyorsanız, **{sehir} {ilce}** {ilan} tam size göre. Beklentileriniz doğrultusunda, {luks} ve unutulmaz anlar için vitrinimizi detaylıca inceleyebilirsiniz.",
  "**{sehir} {ilce}** en çok tercih edilen bağımsız {secenek} listesiyle karşınızdayız. Size en üst düzeyde kalite, {luks} ve gizlilik vaat eden seçkin profillerin tüm detaylarını burada bulacaksınız."
];

const BODY_TEMPLATES = [
  "### Güvenlik & Doğrulanmış Profil Vitrini\n\nParasite SEO ve güvenlik algoritmalarımız sayesinde platformumuzda listelenen tüm görseller özgün morphing süreçlerinden geçirilmiştir. Bu sayede hem görseller arama motorlarında benzersiz (unique) olarak algılanmakta, hem de ziyaretçilerimiz aradıkları yüksek kaliteli ve gerçek profillere kolayca ulaşabilmektedir.\n\n* **Doğrulanmış Görseller:** Tüm vitrin kartları güncel ve aktif üyelere aittir.\n* **Gizlilik Odaklı:** İletişim detayları ve randevu süreçleri tamamen gizli tutulmaktadır.\n* **Yüksek Memnuniyet:** Ziyaretçi geri bildirimlerine göre en çok tercih edilen elit profiller listelenir.",
  "### Rezervasyon ve Buluşma Protokolleri\n\nBölgedeki bağımsız VIP profillerle görüşmeden önce karşılıklı güven esasına dayalı randevu süreçlerine dikkat etmeniz tavsiye edilir. Görüşmeler genellikle lüks rezidanslarda, elit otellerde veya kişisel alanlarda gerçekleşmektedir. Detaylı bilgi almak ve randevu takvimini netleştirmek adına profil kartlarının üzerindeki yönlendirme linklerini kullanabilirsiniz."
];

const FAQ_TEMPLATES = [
  [
    { q: "Nasıl randevu alabilirim?", a: "Profil kartlarında bulunan linklere tıklayarak doğrudan profillerin güncel iletişim kanallarına ulaşabilir ve randevunuzu hemen oluşturabilirsiniz." },
    { q: "Vitrin görselleri gerçek mi?", a: "Evet, tüm görseller %100 doğrulanmış profillere ait olup, güncel hallerini yansıtmaktadır." }
  ],
  [
    { q: "Gizlilik konusunda hassasiyet var mı?", a: "Kesinlikle. Platformumuz ve listelenen tüm profiller en yüksek gizlilik protokollerine sadık kalarak hizmet vermektedir." },
    { q: "Hangi bölgelerde hizmet veriliyor?", a: "{sehir} ve tüm bağlı ilçelerinde VIP transfer ve buluşma seçenekleri mevcuttur." }
  ]
];

// Helper Functions
function parseSpin(text: string, sehir: string, ilce: string): string {
  const customText = text
    .replace(/{sehir}/g, sehir)
    .replace(/{ilce}/g, ilce)
    .replace(/{secenek}/g, () => getRandomElement(['escort bayan', 'VIP refakatçi', 'bireysel refakatçi']))
    .replace(/{hizmet}/g, () => getRandomElement(['kaliteli hizmet', 'prestijli buluşmalar', 'vip eşlik hizmeti']))
    .replace(/{ilan}/g, () => getRandomElement(['bireysel ilanları', 'vip escort seçenekleri', 'elit escort rehberi']))
    .replace(/{luks}/g, () => getRandomElement(['lüks', 'elit', 'kaliteli', 'konforlu']));

  return customText.replace(/{([^{}]+)}/g, (_, choices) => {
    const arr = choices.split('|');
    return getRandomElement(arr);
  });
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function slugify(text: string): string {
  if (!text) return '';
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/Ğ/g, 'g')
    .replace(/ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/ö/g, 'o')
    .replace(/Ç/g, 'c')
    .replace(/ç/g, 'c')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// 2. Main Generation Logic
export async function generateProject(host: string, targetPath: string) {
  console.log(`🚀 Starting Stoplight Project Generation for host: ${host}`);
  console.log(`📁 Target directory: ${targetPath}`);

  // Create necessary directories
  const docsDir = path.join(targetPath, 'docs');
  fs.mkdirSync(docsDir, { recursive: true });

  const toc: unknown[] = [];

  // Add README.md (Landing page)
  const readmeContent = `# ${host} Stoplight API & Escort Rehberi Portal

Hoş geldiniz. Bu portal, **${host}** ağının Türkiye genelindeki tüm il ve ilçeler için sunduğu API entegrasyonlarını, vitrin yapılandırmalarını ve bağımsız profillerin SEO indeksleme dokümantasyonunu içerir.

## API Entegrasyonları ve Servisler

Soldaki menüden Türkiye'deki tüm illeri ve bu illere bağlı ilçeleri seçerek, o bölgelerde aktif olan VIP vitrin kodlarımızı, görsel morphing parametrelerini ve dinamik yönlendirme şemalarını inceleyebilirsiniz.

> [!NOTE]
> Bu dokümantasyon tamamen dinamik arama motoru optimizasyonu (SEO) standartlarına göre hazırlanmış olup, Stoplight portal entegrasyonunu sağlamaktadır.
`;
  fs.writeFileSync(path.join(targetPath, 'README.md'), readmeContent);

  toc.push({
    title: "Welcome",
    type: "item",
    path: "README.md"
  });

  // Generate for each city
  for (const city of ALL_CITIES) {
    const citySlug = slugify(city);
    const cityDistricts = TOP_CITIES[city] || [`${city} Merkez`];

    console.log(`Generating pages for: ${city} (${cityDistricts.length} districts)...`);

    const cityGroupItems: unknown[] = [];

    // 1. Generate City Main Page
    const cityFileName = `docs/${citySlug}.md`;
    const cityFilePath = path.join(targetPath, cityFileName);

    const cityContent = generateMarkdownContent(city, 'Merkez', host);
    fs.writeFileSync(cityFilePath, cityContent);

    cityGroupItems.push({
      title: `${city} Genel`,
      type: "item",
      path: cityFileName
    });

    // 2. Generate District Pages
    for (const district of cityDistricts) {
      const districtSlug = slugify(district);
      const districtFileName = `docs/${citySlug}-${districtSlug}.md`;
      const districtFilePath = path.join(targetPath, districtFileName);

      const districtContent = generateMarkdownContent(city, district, host);
      fs.writeFileSync(districtFilePath, districtContent);

      cityGroupItems.push({
        title: `${district} Escort`,
        type: "item",
        path: districtFileName
      });
    }

    // Add City Group to TOC
    toc.push({
      title: `${city} Escort İlanları`,
      type: "group",
      items: cityGroupItems
    });
  }

  // Write toc.json
  fs.writeFileSync(path.join(targetPath, 'toc.json'), JSON.stringify(toc, null, 2));
  console.log(`✅ Project successfully generated at: ${targetPath}`);
}

// 3. Spun Markdown Content Template Generator
function generateMarkdownContent(sehir: string, ilce: string, host: string): string {
  const title = `${sehir} ${ilce} Escort | ${sehir} ${ilce} Eskort Bayan Rehberi`;
  
  // Spun selections
  const intro = parseSpin(getRandomElement(INTRO_TEMPLATES), sehir, ilce);
  const body = parseSpin(getRandomElement(BODY_TEMPLATES), sehir, ilce);
  const faqList = getRandomElement(FAQ_TEMPLATES);

  // Generate 6 profile vitrin elements
  let vitrinHtml = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin: 24px 0;">\n`;
  
  for (let i = 1; i <= 6; i++) {
    const name = getRandomElement(FEMALE_NAMES) + (i % 2 === 0 ? '' : ' Canan'.split(' ')[Math.floor(Math.random() * 2)]);
    const nameSlug = slugify(name);
    
    vitrinHtml += `  <!-- Profile Card ${i} -->
  <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); background: #ffffff;">
    <a href="https://${host}/go/${nameSlug}" target="_blank" style="text-decoration: none; color: inherit;">
      <div style="position: relative; padding-top: 125%; background-image: url('https://${host}/_media/vitrin/vip-profil-${i}.webp'); background-size: cover; background-position: center;">
        <span style="position: absolute; top: 8px; left: 8px; background: #10b981; color: white; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600;">DOĞRULANDI</span>
      </div>
      <div style="padding: 12px;">
        <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 700; color: #1e293b;">${name}</h4>
        <p style="margin: 0; font-size: 12px; color: #64748b;">${ilce}, ${sehir}</p>
        <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 11px; color: #10b981; font-weight: 600;">● Çevrimiçi</span>
          <span style="background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 500;">VIP</span>
        </div>
      </div>
    </a>
  </div>\n`;
  }
  
  vitrinHtml += `</div>`;

  // FAQ section
  let faqMarkdown = `### Sıkça Sorulan Sorular\n\n`;
  for (const faq of faqList) {
    const q = parseSpin(faq.q, sehir, ilce);
    const a = parseSpin(faq.a, sehir, ilce);
    faqMarkdown += `**S: ${q}**\n\n> C: ${a}\n\n`;
  }

  const kws = [
    `${sehir} ${ilce} escort`,
    `${sehir} ${ilce} eskort`,
    `${sehir} ${ilce} escort bayan`,
    `${sehir} ${ilce} eskort bayan`,
    `${sehir} eve gelen escort`,
    `${sehir} otele servis escort`,
    `${sehir} eskort telefonları`,
    `${sehir} escort numaraları`,
    `${sehir} güvenilir escort bayanlar`
  ];
  const hiddenSpans = kws.map(k => `<span style="position:absolute; width:0px; height:0px; font-size:0px; line-height:0px; opacity:0; overflow:hidden;" class="stealth-node">${k}</span>`).join('');
  const kwsMd = `<div class="seo-footprint-neutralizer" style="overflow:hidden; height:0px; width:0px; opacity:0; pointer-events:none;">${hiddenSpans}</div>`;

  return `# ${title}

${intro}

${vitrinHtml}

${body}

${faqMarkdown}

---
### Popüler Arama Terimleri
${kwsMd}

---
[Like what you see? Visit our official portal for full list and live chat support!](https://${host}/${slugify(sehir)})
`;
}

// 4. CLI Entry Point
if (require.main === module) {
  const args = process.argv.slice(2);
  const hostArg = args.find(arg => arg.startsWith('--host='));
  const host = hostArg ? hostArg.split('=')[1] : DEFAULT_HOST;
  
  const targetPath = path.join(process.cwd(), 'stoplight-project');
  generateProject(host, targetPath).catch(err => {
    console.error('Fatal generation error:', err);
    process.exit(1);
  });
}
