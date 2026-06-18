import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Define the output path
const outputDir = path.join(process.cwd(), 'public', 'pdf');
const outputPath = path.join(outputDir, 'istanbul-vip-escort-katalogu.pdf');

// Ensure directory exists
fs.mkdirSync(outputDir, { recursive: true });

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 60, bottom: 60, left: 60, right: 60 },
  bufferPages: true
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Override Helvetica with Arial to support Turkish characters natively
const regFont = 'C:\\Windows\\Fonts\\arial.ttf';
const boldFont = 'C:\\Windows\\Fonts\\arialbd.ttf';
const italicFont = 'C:\\Windows\\Fonts\\ariali.ttf';

if (fs.existsSync(regFont)) {
  doc.registerFont('Helvetica', regFont);
  doc.font('Helvetica');
}
if (fs.existsSync(boldFont)) {
  doc.registerFont('Helvetica-Bold', boldFont);
}
if (fs.existsSync(italicFont)) {
  doc.registerFont('Helvetica-Oblique', italicFont);
}

// 🎨 BRAND COLORS
const COLOR_PRIMARY = '#e11d48'; // Rose 600
const COLOR_TEXT = '#1f2937';    // Gray 800
const COLOR_MUTED = '#6b7280';   // Gray 500
const COLOR_LINE = '#e5e7eb';    // Gray 200
const COLOR_LINK = '#e11d48';    // Rose 600
const COLOR_BG_CODE = '#f9fafb'; // Gray 50

const PRIMARY_HOST = 'dorukcanay.digital';

const avrupaDistricts = [
  'Arnavutkoy', 'Avcilar', 'Bagcilar', 'Bahcelievler', 'Bakirkoy',
  'Basaksehir', 'Bayrampasa', 'Besiktas', 'Beylikduzu', 'Beyoglu',
  'Buyukcekmece', 'Catalca', 'Esenler', 'Esenyurt', 'Eyupsultan',
  'Fatih', 'Gaziosmanpasa', 'Gungoren', 'Kagithane', 'Kucukcekmece',
  'Sariyer', 'Silivri', 'Sultangazi', 'Sisli', 'Zeytinburnu'
];

const anadoluDistricts = [
  'Adalar', 'Atasehir', 'Beykoz', 'Cekmekoy', 'Kadikoy',
  'Kartal', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sariyer',
  'Sile', 'Sisli', 'Tuzla', 'Umraniye', 'Uskudar'
];

const trMap: { [key: string]: string } = {
  'arnavutkoy': 'Arnavutköy',
  'avcilar': 'Avcılar',
  'bagcilar': 'Bağcılar',
  'bahcelievler': 'Bahçelievler',
  'bakirkoy': 'Bakırköy',
  'basaksehir': 'Başakşehir',
  'bayrampasa': 'Bayrampaşa',
  'besiktas': 'Beşiktaş',
  'beylikduzu': 'Beylikdüzü',
  'beyoglu': 'Beyoğlu',
  'buyukcekmece': 'Büyükçekmece',
  'catalca': 'Çatalca',
  'esenler': 'Esenler',
  'esenyurt': 'Esenyurt',
  'eyupsultan': 'Eyüpsultan',
  'fatih': 'Fatih',
  'gaziosmanpasa': 'Gaziosmanpaşa',
  'gungoren': 'Güngören',
  'kagithane': 'Kağıthane',
  'kucukcekmece': 'Küçükçekmece',
  'sariyer': 'Sarıyer',
  'silivri': 'Silivri',
  'sultangazi': 'Sultangazi',
  'sisli': 'Şişli',
  'zeytinburnu': 'Zeytinburnu',
  'adalar': 'Adalar',
  'atasehir': 'Ataşehir',
  'beykoz': 'Beykoz',
  'cekmekoy': 'Çekmeköy',
  'kadikoy': 'Kadıköy',
  'kartal': 'Kartal',
  'maltepe': 'Maltepe',
  'pendik': 'Pendik',
  'sancaktepe': 'Sancaktepe',
  'sile': 'Şile',
  'tuzla': 'Tuzla',
  'umraniye': 'Ümraniye',
  'uskudar': 'Üsküdar',
  'mecidiyekoy': 'Mecidiyeköy',
  'etiler': 'Etiler',
  'bebek': 'Bebek',
  'florya': 'Florya',
  'nisantasi': 'Nişantaşı',
  'acibadem': 'Acıbadem',
  'bostanci': 'Bostancı',
  'suadiye': 'Suadiye',
  'bahcesehir': 'Bahçeşehir',
  'gokturk': 'Göktürk'
};

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper: Add Title Page
function addTitlePage() {
  // Deep black luxury background
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#09090b');
  
  // Luxury gold/rose border
  doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).stroke('#e11d48');
  
  doc.fillColor('#e11d48')
     .fontSize(12)
     .font('Helvetica-Bold')
     .text('⚡ DORUKCAN AY ⚡', 60, doc.page.height * 0.2, {
       align: 'center',
       characterSpacing: 2
     });

  doc.fillColor('#ffffff')
     .fontSize(28)
     .font('Helvetica-Bold')
     .text('İSTANBUL VIP PARTNER &', { align: 'center' })
     .text('ELİT REFAKATÇİ REHBERİ', { align: 'center' });

  doc.fillColor('#a1a1aa')
     .fontSize(11)
     .font('Helvetica')
     .text('Güvenilir, Doğrulanmış ve Kaporasız Bireysel Modeller', { align: 'center' });

  doc.moveDown(3);

  doc.fillColor('#e4e4e7')
     .fontSize(10)
     .font('Helvetica')
     .text('İstanbul genelinde 7/24 hizmet veren lüks refakatçiler,', { align: 'center' })
     .text('bireysel escort bayanlar ve elit partner seçenekleri.', { align: 'center' });

  doc.moveDown(5);

  doc.fillColor('#e11d48')
     .fontSize(9)
     .font('Helvetica-Bold')
     .text('AKTİF REHBER GİRİŞ PORTALLARI:', { align: 'center' });
      
  doc.fillColor(COLOR_LINK)
     .fontSize(9)
     .font('Helvetica-Bold')
     .text('Resmi Web Sitesi: https://dorukcanay.digital', { link: 'https://dorukcanay.digital', align: 'center', underline: true })
     .text('Şişli VIP İlanlar: https://dorukcanay.digital/istanbul/sisli', { link: 'https://dorukcanay.digital/istanbul/sisli', align: 'center', underline: true })
     .text('Kadıköy VIP İlanlar: https://dorukcanay.digital/istanbul/kadikoy', { link: 'https://dorukcanay.digital/istanbul/kadikoy', align: 'center', underline: true })
     .text('Beşiktaş VIP İlanlar: https://dorukcanay.digital/istanbul/besiktas', { link: 'https://dorukcanay.digital/istanbul/besiktas', align: 'center', underline: true });

  doc.moveDown(4);

  doc.fillColor('#71717a')
     .fontSize(8)
     .font('Helvetica')
     .text('GİZLİLİK VE GÜVENLİK BEYANNAMESİ // ELİT SEÇKİ NETWORK', { align: 'center' })
     .text('YAYIN: 2026 RESMİ BASKI', { align: 'center' })
     .text('DURUM: AKTİF KATALOG', { align: 'center' });
}

// Helper: Add Section Page
function addSectionPage(pageNum: number, title: string, subtitle: string, contentCallback: () => void) {
  doc.addPage();
  
  // Header section
  doc.fillColor(COLOR_PRIMARY)
     .fontSize(8)
     .font('Helvetica-Bold')
     .text(`BÖLÜM ${pageNum} // ${subtitle.toUpperCase()}`, { characterSpacing: 1.2 });
      
  doc.moveDown(0.3);
  
  doc.fillColor('#111827')
     .fontSize(18)
     .font('Helvetica-Bold')
     .text(title);
      
  // Divider line
  doc.moveDown(0.4);
  doc.strokeColor(COLOR_PRIMARY)
     .lineWidth(1)
     .moveTo(60, doc.y)
     .lineTo(doc.page.width - 60, doc.y)
     .stroke();
      
  doc.moveDown(1.5);
  
  contentCallback();
}

// Helpers for contents
function textP(text: string, boldPrefix = '', linkInfo?: { text: string; url: string }) {
  doc.fillColor(COLOR_TEXT)
     .fontSize(10)
     .font('Helvetica')
     .lineGap(4);
      
  if (boldPrefix) {
    doc.font('Helvetica-Bold').text(boldPrefix + ' ', { continued: true });
  }
  
  if (linkInfo) {
    const parts = text.split(linkInfo.text);
    if (parts.length === 2) {
      doc.font('Helvetica').text(parts[0], { continued: true });
      doc.fillColor(COLOR_LINK).font('Helvetica-Bold').text(linkInfo.text, { link: linkInfo.url, underline: true, continued: true });
      doc.fillColor(COLOR_TEXT).font('Helvetica').text(parts[1]);
    } else {
      doc.font('Helvetica').text(text);
    }
  } else {
    doc.font('Helvetica').text(text);
  }
  
  doc.moveDown(1);
}

function textBullet(text: string, boldPart = '') {
  doc.fillColor(COLOR_TEXT)
     .fontSize(10)
     .font('Helvetica')
     .lineGap(3);
      
  doc.text('• ', { continued: true });
  if (boldPart) {
    doc.font('Helvetica-Bold').text(boldPart + ': ', { continued: true });
  }
  doc.font('Helvetica').text(text);
  doc.moveDown(0.7);
}

function calloutB(text: string) {
  const startY = doc.y;
  doc.fontSize(9)
     .font('Helvetica-Oblique')
     .fillColor('#e11d48')
     .lineGap(3);
      
  const textHeight = doc.heightOfString(text, { width: doc.page.width - 160 });
  
  doc.save()
     .rect(60, startY - 4, doc.page.width - 120, textHeight + 8)
     .fill('#fff1f2');
      
  doc.restore()
     .fillColor('#e11d48')
     .text(text, 80, startY, { width: doc.page.width - 160 });
      
  doc.moveDown(1.5);
}

// ----------------------------------------------------
// BUILD CATALOG BOOK PAGE BY PAGE
// ----------------------------------------------------

console.log("📄 Page 1: Title Page...");
addTitlePage();

// PAGE 2: Security & Booking Rules
console.log("📄 Page 2: Safety & Rules...");
addSectionPage(2, "Rezervasyon Kuralları & Güvenlik Politikası", "Güvenilir Buluşma Kılavuzu", () => {
  textP("Rehberimizde yer alan tüm bağımsız partnerler %100 elden ödeme ilkesiyle çalışmaktadır. Sitemizde adı geçen hiçbir model sizden rezervasyon, taksi veya kapora adı altında ön ödeme talep etmez.");
  textP("Buluşmalarınızı güvenle gerçekleştirmek için kapora dolandırıcılarına karşı dikkatli olunuz. Doğrudan doğrulanmış profil kataloğuna erişerek güvenilir partnerlerle randevu planlayabilirsiniz.", "", { text: "güvenilir partnerlerle randevu", url: "https://dorukcanay.digital" });
  calloutB("ÖNEMLİ UYARI: Kapora veya ön ödeme talep eden ilanlar ajansımızla ilişkili değildir. Şüpheli durumları info@dorukcanay.digital adresine bildirebilirsiniz.");
  textBullet("Ön ödemesiz, buluşma anında elden nakit ödeme", "Kaporasız Hizmet");
  textBullet("Tüm partnerlerimizin görselleri güncel ve teyitlidir", "Gerçek Görseller");
  textBullet("Rezervasyonlarınızda gizlilik en üst seviyede korunur", "%100 Gizlilik");
});

// PAGE 3: European Side Districts (Double Column)
console.log("📄 Page 3: European Districts...");
addSectionPage(3, "Avrupa Yakası İlçe Dizinleri ve Katalog Linkleri", "Avrupa Yakası Bölgeleri", () => {
  textP("Aşağıdaki listeden Avrupa Yakası genelinde aktif olarak hizmet veren VIP refakatçilerin güncel profillerine doğrudan erişim sağlayabilirsiniz. Bölgeye özel katalogları incelemek için ilçe linklerini kullanın.");

  let yOffset = doc.y;
  let col = 0;
  
  avrupaDistricts.forEach((dist) => {
    const slug = slugify(dist);
    const ampUrl = `https://${PRIMARY_HOST}/istanbul/${slug}`;
    const displayName = trMap[dist.toLowerCase()] || dist;
    const x = col === 0 ? 60 : 310;

    doc.fillColor('#111111')
       .fontSize(8.5)
       .font('Helvetica-Bold')
       .text(`📍 ${displayName} VIP Escort:`, x, yOffset);

    doc.fillColor(COLOR_LINK)
       .fontSize(8.5)
       .font('Helvetica')
       .text(`Kataloğu Aç`, x + 165, yOffset, {
         link: ampUrl,
         underline: true
       });

    if (col === 0) {
      col = 1;
    } else {
      col = 0;
      yOffset += 24;
    }
  });

  doc.y = yOffset + 30;
});

// PAGE 4: Anatolian Side Districts (Double Column)
console.log("📄 Page 4: Anatolian Districts...");
addSectionPage(4, "Anadolu Yakası İlçe Dizinleri ve Katalog Linkleri", "Anadolu Yakası Bölgeleri", () => {
  textP("Anadolu Yakası genelinde elit refakat hizmeti sunan doğrulanmış modellerin iletişim kanalları ve güncel lokasyon ilanları aşağıda listelenmiştir. Detaylı bilgi ve randevu için lokasyon linklerine tıklayabilirsiniz.");

  let yOffset = doc.y;
  let col = 0;
  
  anadoluDistricts.forEach((dist) => {
    const slug = slugify(dist);
    const ampUrl = `https://${PRIMARY_HOST}/istanbul/${slug}`;
    const displayName = trMap[dist.toLowerCase()] || dist;
    const x = col === 0 ? 60 : 310;

    doc.fillColor('#111111')
       .fontSize(8.5)
       .font('Helvetica-Bold')
       .text(`📍 ${displayName} VIP Escort:`, x, yOffset);

    doc.fillColor(COLOR_LINK)
       .fontSize(8.5)
       .font('Helvetica')
       .text(`Kataloğu Aç`, x + 165, yOffset, {
         link: ampUrl,
         underline: true
       });

    if (col === 0) {
      col = 1;
    } else {
      col = 0;
      yOffset += 24;
    }
  });

  doc.y = yOffset + 30;
});

// PAGE 5: Popular Sub-locations & Neighborhoods
console.log("📄 Page 5: Popular Locations...");
addSectionPage(5, "Popüler Alt Lokasyonlar & Mahalle Rehberi", "Popüler Lokasyonlar", () => {
  textP("İstanbul'un en prestijli semtlerinde ve merkezi bölgelerinde bireysel konseptte hizmet sunan partnerlerin kataloglarına aşağıda yer alan özel semt dizinlerinden ulaşabilirsiniz.");

  const linkWheelList = [
    { loc: 'Mecidiyekoy', label: 'Mecidiyeköy VIP Escort İlanları' },
    { loc: 'Etiler', label: 'Etiler VIP Escort İlanları' },
    { loc: 'Bebek', label: 'Bebek Elit Partner Kataloğu' },
    { loc: 'Florya', label: 'Florya Kaporasız Escort' },
    { loc: 'Nisantasi', label: 'Nişantaşı Escort Bayan İlanları' },
    { loc: 'Acibadem', label: 'Acıbadem Escort İletişim' },
    { loc: 'Bostanci', label: 'Bostancı VIP Escort Randevu' },
    { loc: 'Suadiye', label: 'Suadiye Model Escort Kataloğu' },
    { loc: 'Bahcesehir', label: 'Bahçeşehir Elit Escort Lady' },
    { loc: 'Gokturk', label: 'Göktürk VIP Escort Seçenekleri' }
  ];

  let yOffset = doc.y + 10;
  linkWheelList.forEach((lw) => {
    const slug = slugify(lw.loc);
    const ampUrl = `https://${PRIMARY_HOST}/istanbul/${slug}`;
    const displayName = trMap[lw.loc.toLowerCase()] || lw.loc;

    doc.fillColor('#111111')
       .fontSize(9.5)
       .font('Helvetica-Bold')
       .text(`🔗 ${lw.label}:`, 60, yOffset);

    doc.fillColor(COLOR_LINK)
       .fontSize(9)
       .font('Helvetica')
       .text(ampUrl, 260, yOffset, {
         link: ampUrl,
         underline: true
       });

    yOffset += 32;
  });

  doc.y = yOffset + 20;
});

// PAGE 6: Frequently Asked Questions (FAQ)
console.log("📄 Page 6: FAQ...");
addSectionPage(6, "Sıkça Sorulan Sorular (S.S.S.)", "SSS ve Bilgilendirme", () => {
  textBullet("Rehberimizde listelenen tüm ilanlar bireysel partnerlerimize aittir. Profil detaylarında yer alan iletişim butonlarını (WhatsApp / Arama) kullanarak doğrudan partnerle iletişim kurabilir ve detayları görüşebilirsiniz.", "Nasıl rezervasyon yapabilirim?");
  textBullet("Kesinlikle hayır. Güvenliğiniz için kapora veya benzeri hiçbir isim altında ön ödeme yapmamanız gerekmektedir. Ödeme tamamen buluşma esnasında elden elden nakit olarak gerçekleştirilmektedir.", "Randevu için kapora ödemeli miyim?");
  textBullet("Gizliliğiniz bizim ve partnerlerimizin en öncelikli kuralıdır. Görüşmeleriniz ve iletişim detaylarınız tamamen iki kişi arasında gizli kalır, üçüncü şahıslarla asla paylaşılmaz.", "Kişisel bilgilerim ve gizliliğim güvende mi?");
  textBullet("İlanlardaki tüm fotoğraflar partnerlerimizin stüdyo ve güncel çekimlerinden oluşmaktadır. Gerçekliğinden şüphe duyduğunuz profilleri şikayet hattımız üzerinden bildirebilirsiniz.", "Fotoğraflar gerçek mi?");
});

// PAGE 7: Legal Disclaimers & Rules
console.log("📄 Page 7: Legal...");
addSectionPage(7, "Hukuki Uyarılar ve Yasal Sorumluluk Reddi", "Yasal Uyarılar", () => {
  textP("Bu web sitesi ve beraberindeki PDF kataloğu, yalnızca 18 yaş ve üzeri yetişkin kullanıcıların bilgilendirilmesi amacıyla hazırlanmış bağımsız bir reklam platformudur. Katalogda yer alan tüm içerikler reklam verenlerin kendi sorumluluğundadır.");
  textP("Sitede sunulan hizmetlerin yasal sınırları yerel mevzuatlara göre belirlenmektedir. Kullanıcılar ve reklam verenler yasalara uymakla yükümlüdür.");
  calloutB("YASAL UYARI: Bu dökümanı ve sitemizi 18 yaşından küçüklerin kullanması kesinlikle yasaktır. Giriş yaparak 18 yaşından büyük olduğunuzu beyan etmiş sayılırsınız.");
  textBullet("Tüm hakları saklıdır. Sitedeki materyallerin izinsiz kopyalanması yasaktır.", "Telif Hakları");
});

// PAGE 8: Closing & Contact
console.log("📄 Page 8: Closing & Contact...");
addSectionPage(8, "İletişim ve Resmi Dijital Kanallar", "Kapanış ve İletişim", () => {
  textP("İstanbul genelinde prestij ve lüks refakat deneyimini en üst standartlarda yaşamak için resmi web sitemizi yer imlerinize ekleyebilir, güncel adres değişikliklerini sosyal kanallarımız üzerinden takip edebilirsiniz.");
  textP("Katalog güncellemeleri, reklam talepleri ve şikayet bildirimleriniz için resmi mail adresimiz üzerinden 7/24 bizimle iletişim kurabilirsiniz.");

  doc.moveDown(2);
  
  // Luxury signature box
  const startY = doc.y;
  doc.save()
     .rect(60, startY, doc.page.width - 120, 120)
     .fill('#09090b');
     
  doc.restore();
  
  doc.fillColor('#ffffff')
     .fontSize(11)
     .font('Helvetica-Bold')
     .text('⚡ DORUKCAN AY ⚡', 80, startY + 20, { align: 'center' });

  doc.fillColor('#a1a1aa')
     .fontSize(9.5)
     .font('Helvetica')
     .text('Premium Companion Network & Digital Identity Secured', { align: 'center' });

  doc.moveDown(1);
  
  doc.fillColor(COLOR_PRIMARY)
     .fontSize(9.5)
     .font('Helvetica-Bold')
     .text('Destek E-Posta: info@dorukcanay.digital', { align: 'center' })
     .text('Web Giriş: https://dorukcanay.digital', { link: 'https://dorukcanay.digital', align: 'center', underline: true });
});

// Add page numbers and headers in footer
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);
  
  // Skip header/footer on title page
  if (i === 0) continue;
  
  // Header
  doc.fontSize(8)
     .font('Helvetica-Bold')
     .fillColor(COLOR_MUTED)
     .text('⚡ DORUKCAN AY ⚡ // İSTANBUL VIP REFAKATÇİ REHBERİ', 60, 30, { align: 'left' });
     
  doc.strokeColor(COLOR_LINE)
     .lineWidth(0.5)
     .moveTo(60, 45)
     .lineTo(doc.page.width - 60, 45)
     .stroke();

  // Footer
  doc.strokeColor(COLOR_LINE)
     .lineWidth(0.5)
     .moveTo(60, doc.page.height - 45)
     .lineTo(doc.page.width - 60, doc.page.height - 45)
     .stroke();
      
  doc.fontSize(8)
     .font('Helvetica')
     .fillColor(COLOR_MUTED)
     .text(`Sayfa ${i + 1} / ${range.count}`, 60, doc.page.height - 35, { align: 'right' });
}

// Finalize PDF
doc.end();

stream.on('finish', () => {
  console.log(`\n🏁 [SUCCESS] VIP Companion Catalog PDF successfully generated and saved to: ${outputPath}`);
});
