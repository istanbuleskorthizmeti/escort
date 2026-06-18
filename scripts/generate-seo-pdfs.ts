import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import { istanbulCity } from '../lib/locations-registry/istanbul';

/**
 * 🧛‍♂️ HYDRA PARASITE PDF GENERATOR (v1.0 - God Mode SEO Edition)
 * Generates 8-page, highly optimized SEO PDF backlink documents on the Desktop.
 * 
 * Target Keywords: escort, eskort, istanbul escort, istanbul eskort
 * Output: C:\Users\onurk\Desktop\google-sites-pdfs-backlink
 */

const OUTPUT_DIR = 'C:\\Users\\onurk\\Desktop\\google-sites-pdfs-backlink';
const PRIMARY_HOST = 'dorukcanay.digital';

const trMap: { [key: string]: string } = {
  arnavutkoy: 'Arnavutköy', avcilar: 'Avcılar', bagcilar: 'Bağcılar',
  bahcelievler: 'Bahçelievler', bakirkoy: 'Bakırköy', basaksehir: 'Başakşehir',
  bayrampasa: 'Bayrampaşa', besiktas: 'Beşiktaş', beylikduzu: 'Beylikdüzü',
  beyoglu: 'Beyoğlu', buyukcekmece: 'Büyükçekmece', catalca: 'Çatalca',
  esenler: 'Esenler', esenyurt: 'Esenyurt', eyupsultan: 'Eyüpsultan',
  fatih: 'Fatih', gaziosmanpasa: 'Gaziosmanpaşa', gungoren: 'Güngören',
  kagithane: 'Kağıthane', kucukcekmece: 'Küçükçekmece', sariyer: 'Sarıyer',
  silivri: 'Silivri', sultangazi: 'Sultangazi', sisli: 'Şişli',
  zeytinburnu: 'Zeytinburnu', adalar: 'Adalar', atasehir: 'Ataşehir',
  beykoz: 'Beykoz', cekmekoy: 'Çekmeköy', kadikoy: 'Kadıköy',
  kartal: 'Kartal', maltepe: 'Maltepe', pendik: 'Pendik',
  sancaktepe: 'Sancaktepe', sultanbeyli: 'Sultanbeyli', sile: 'Şile',
  tuzla: 'Tuzla', umraniye: 'Ümraniye', uskudar: 'Üsküdar'
};

const avrupaDistricts = [
  'Arnavutkoy', 'Avcilar', 'Bagcilar', 'Bahcelievler', 'Bakirkoy',
  'Basaksehir', 'Bayrampasa', 'Besiktas', 'Beylikduzu', 'Beyoglu',
  'Buyukcekmece', 'Catalca', 'Esenler', 'Esenyurt', 'Eyupsultan',
  'Fatih', 'Gaziosmanpasa', 'Gungoren', 'Kagithane', 'Kucukcekmece',
  'Sariyer', 'Silivri', 'Sultangazi', 'Sisli', 'Zeytinburnu'
];

const anadoluDistricts = [
  'Adalar', 'Atasehir', 'Beykoz', 'Cekmekoy', 'Kadikoy',
  'Kartal', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sultanbeyli',
  'Sile', 'Tuzla', 'Umraniye', 'Uskudar'
];

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

async function generateSEOPDF(keyword: string, filename: string) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    info: {
      Title: `Istanbul VIP ${keyword.toUpperCase()} Ilanlari & Guvenli Bulusma Rehberi 2026`,
      Author: 'DRKCNAY VIP ESCORT AJANSI',
      Subject: `Istanbul escort eskort ilceler rehberi. Kaporasiz ve guvenilir escort bulusma rehberi.`,
      Keywords: `${keyword}, istanbul ${keyword}, kaporasiz ${keyword}, vip ${keyword}, elit ${keyword}`
    }
  });

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

  const filePath = path.join(OUTPUT_DIR, filename);
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // ---------------------------------------------------------------------------
  // PAGE 1: COVER PAGE
  // ---------------------------------------------------------------------------
  doc.fillColor('#111111').rect(0, 0, 595.28, 841.89).fill(); // Deep dark background

  doc.fillColor('#FFD700') // Gold Accent
     .fontSize(12)
     .text('⚡ DORUKCAN AY ⚡', 50, 150, { align: 'center' });

  doc.fillColor('#FFFFFF')
     .fontSize(28)
     .font('Helvetica-Bold')
     .text(`İSTANBUL VIP ${keyword.toUpperCase()} İLANLARI`, 50, 220, { align: 'center', paragraphGap: 10 });

  doc.fillColor('#A9A9A9')
     .fontSize(16)
     .font('Helvetica')
     .text('2026 Elite Güvenli Buluşma & İlçeler İletişim Kataloğu', 50, 290, { align: 'center' });

  doc.fillColor('#FFD700')
     .rect(100, 360, 395, 3).fill();

  doc.fillColor('#FFFFFF')
     .fontSize(11)
     .font('Helvetica-Oblique')
     .text('Bu dokuman, Istanbul genelinde kaporasiz, guvenilir ve yuz yuze gorusme prensibiyle hizmet veren bagimsiz escort model ilanlarini, ilce bazli arama kataloglarini ve Google AMP Cache baglantilarini icermektedir.', 80, 410, {
       align: 'justify',
       width: 435,
       lineGap: 4
     });

  doc.fillColor('#A9A9A9')
     .fontSize(10)
     .font('Helvetica')
     .text('Yayıncı: DRKCNAY Network Operations', 50, 700, { align: 'center' })
     .text('E-Posta: info@dorukcanay.digital', 50, 715, { align: 'center' })
     .text('Lisans: CC BY-ND 4.0 - Ticari Paylaşım Serbesttir', 50, 730, { align: 'center' });

  // ---------------------------------------------------------------------------
  // PAGE 2: SERVICES & PROTOCOL
  // ---------------------------------------------------------------------------
  doc.addPage();
  doc.fillColor('#FFFFFF').rect(0, 0, 595.28, 841.89).fill(); // Light theme pages

  doc.fillColor('#111111')
     .fontSize(20)
     .font('Helvetica-Bold')
     .text('1. VIP Hizmet Standartları ve Görüşme Protokolü', 50, 50);

  doc.fillColor('#FFD700').rect(50, 75, 495, 2).fill();

  doc.fillColor('#333333')
     .fontSize(11)
     .font('Helvetica')
     .text('İstanbul genelinde premium partner arayanlar için en kritik konu güvenlik, gizlilik ve şeffaflıktır. Sektördeki kirliliği önlemek adına oluşturulan bu rehberde, her model teyit edilmiş görselleriyle yer almaktadır.', 50, 95, {
       width: 495,
       align: 'justify',
       lineGap: 4
     });

  doc.fillColor('#111111')
     .fontSize(14)
     .font('Helvetica-Bold')
     .text('🛡️ Kaporasız Hizmet İlkesi', 50, 175);

  doc.fillColor('#333333')
     .fontSize(11)
     .font('Helvetica')
     .text('İnternet ortamında kendisini bağımsız model olarak tanıtan ancak görüşme öncesi taksi ücreti, kuaför parası veya kapora adı altında ön ödeme talep eden kişilere karşı dikkatli olmalısınız. Gerçek ve teyitli modellerimiz asla ön ödeme kabul etmez. Tüm ödemeler buluşma anında, adreste elden nakit olarak gerçekleşir.', 50, 195, {
       width: 495,
       align: 'justify',
       lineGap: 4
     });

  doc.fillColor('#111111')
     .fontSize(14)
     .font('Helvetica-Bold')
     .text('📍 Lokasyon ve Adrese Servis', 50, 295);

  doc.fillColor('#333333')
     .fontSize(11)
     .font('Helvetica')
     .text('Modellerimiz kendi lüks rezidanslarında hizmet sunabildiği gibi, sizin konakladığınız 5 yıldızlı otellere de hızlı servis sağlamaktadır. İletişime geçtikten sonra konum teyidi alabilir, güvenle randevunuzu oluşturabilirsiniz.', 50, 315, {
       width: 495,
       align: 'justify',
       lineGap: 4
     });

  // Call to Action Box
  doc.fillColor('#F9F9F9')
     .rect(50, 420, 495, 120).fill()
     .strokeColor('#E0E0E0').stroke();

  doc.fillColor('#111111')
     .fontSize(12)
     .font('Helvetica-Bold')
     .text('🟢 HIZLI YÖNLENDİRME BAĞLANTISI', 70, 440);

  doc.fillColor('#333333')
     .fontSize(10)
     .font('Helvetica')
     .text('Telefonunuzdan veya bilgisayarınızdan en güncel escort listelerine engelsiz erişim sağlamak için aşağıdaki resmi Google AMP Cache portalını ziyaret edebilirsiniz:', 70, 460, { width: 450 });

  const mainAmpUrl = `https://${PRIMARY_HOST}/istanbul`;

  doc.fillColor('#0000EE')
     .fontSize(11)
     .font('Helvetica-Bold')
     .text('🔗 Resmi İstanbul Escort Kataloğunu Gör', 70, 505, {
       link: mainAmpUrl,
       underline: true
     });

  // Footer
  doc.fillColor('#777777')
     .fontSize(9)
     .font('Helvetica')
     .text('Sayfa 2 / 8 | DRKCNAY VIP Network', 50, 750, { align: 'center' });

  // ---------------------------------------------------------------------------
  // PAGE 3: EUROPEAN SIDE DISTRICTS
  // ---------------------------------------------------------------------------
  doc.addPage();
  doc.fillColor('#FFFFFF').rect(0, 0, 595.28, 841.89).fill();

  doc.fillColor('#111111')
     .fontSize(20)
     .font('Helvetica-Bold')
     .text('2. Avrupa Yakası İlçe Dizinleri ve SEO Linkleri', 50, 50);

  doc.fillColor('#FFD700').rect(50, 75, 495, 2).fill();

  doc.fillColor('#333333')
     .fontSize(10)
     .font('Helvetica')
     .text('Aşağıdaki ilçelerde aktif olarak hizmet veren VIP partnerlerin listesine doğrudan Google AMP Cache linkleri üzerinden ulaşabilirsiniz. Bu linkler BTK / TİB engellemelerinden etkilenmemektedir.', 50, 85, {
       width: 495,
       align: 'justify',
       lineGap: 3
     });

  let yOffsetPage3 = 135;
  let colPage3 = 0;
  avrupaDistricts.forEach((dist) => {
    const slug = slugify(dist);
    const ampUrl = `https://${PRIMARY_HOST}/istanbul/${slug}`;
    const displayName = trMap[dist.toLowerCase()] || dist;
    const x = colPage3 === 0 ? 50 : 310;

    doc.fillColor('#111111')
       .fontSize(8.5)
       .font('Helvetica-Bold')
       .text(`📍 ${displayName} ${keyword === 'escort' ? 'Escort' : 'Eskort'}:`, x, yOffsetPage3);

    doc.fillColor('#0000EE')
       .fontSize(8.5)
       .font('Helvetica')
       .text(`🔗 Kataloğu Aç`, x + 180, yOffsetPage3, {
         link: ampUrl,
         underline: true
       });

    if (colPage3 === 0) {
      colPage3 = 1;
    } else {
      colPage3 = 0;
      yOffsetPage3 += 42;
    }
  });

  doc.fillColor('#777777')
     .fontSize(9)
     .font('Helvetica')
     .text('Sayfa 3 / 8 | DRKCNAY VIP Network', 50, 750, { align: 'center' });

  // ---------------------------------------------------------------------------
  // PAGE 4: ANATOLIAN SIDE DISTRICTS
  // ---------------------------------------------------------------------------
  doc.addPage();
  doc.fillColor('#FFFFFF').rect(0, 0, 595.28, 841.89).fill();

  doc.fillColor('#111111')
     .fontSize(20)
     .font('Helvetica-Bold')
     .text('3. Anadolu Yakası İlçe Dizinleri ve SEO Linkleri', 50, 50);

  doc.fillColor('#FFD700').rect(50, 75, 495, 2).fill();

  doc.fillColor('#333333')
     .fontSize(10)
     .font('Helvetica')
     .text('İstanbul Anadolu Yakası genelinde hizmet sunan doğrulanmış modellerin iletişim bilgileri ve lokasyon filtreleri aşağıda listelenmiştir. Doğrudan güvenli kanallar üzerinden 7/24 randevu alabilirsiniz.', 50, 85, {
       width: 495,
       align: 'justify',
       lineGap: 3
     });

  let yOffsetPage4 = 135;
  let colPage4 = 0;
  anadoluDistricts.forEach((dist) => {
    const slug = slugify(dist);
    const ampUrl = `https://${PRIMARY_HOST}/istanbul/${slug}`;
    const displayName = trMap[dist.toLowerCase()] || dist;
    const x = colPage4 === 0 ? 50 : 310;

    doc.fillColor('#111111')
       .fontSize(9.5)
       .font('Helvetica-Bold')
       .text(`📍 ${displayName} ${keyword === 'escort' ? 'Escort' : 'Eskort'}:`, x, yOffsetPage4);

    doc.fillColor('#0000EE')
       .fontSize(9.5)
       .font('Helvetica')
       .text(`🔗 Kataloğu Aç`, x + 180, yOffsetPage4, {
         link: ampUrl,
         underline: true
       });

    if (colPage4 === 0) {
      colPage4 = 1;
    } else {
      colPage4 = 0;
      yOffsetPage4 += 70;
    }
  });

  doc.fillColor('#777777')
     .fontSize(9)
     .font('Helvetica')
     .text('Sayfa 4 / 8 | DRKCNAY VIP Network', 50, 750, { align: 'center' });

  // ---------------------------------------------------------------------------
  // PAGE 5: VIP MODELS REGISTRY
  // ---------------------------------------------------------------------------
  doc.addPage();
  doc.fillColor('#FFFFFF').rect(0, 0, 595.28, 841.89).fill();

  doc.fillColor('#111111')
     .fontSize(20)
     .font('Helvetica-Bold')
     .text('4. En Çok Tercih Edilen Elite Model Kataloğu', 50, 50);

  doc.fillColor('#FFD700').rect(50, 75, 495, 2).fill();

  doc.fillColor('#333333')
     .fontSize(11)
     .font('Helvetica')
     .text('Sistemimizde en yüksek puanı alan, kaporasız çalışan ve teyitli görselleriyle popüler olan elite modellerimizin kısa profilleri aşağıdadır. Doğrudan WhatsApp butonu üzerinden randevu talep edebilirsiniz.', 50, 95, {
       width: 495,
       align: 'justify',
       lineGap: 4
     });

  const models = [
    { name: 'Melissa', desc: 'Türk kökenli premium partner. Lüks yaşamı benimsemiş, Beşiktaş ve Şişli otellerine teyitli servis sağlar.' },
    { name: 'Aynur', desc: 'VIP Sarışın Model. Yüksek iletişim becerilerine sahip elit partner. Kadıköy rezidansında hizmet sunmaktadır.' },
    { name: 'Svetlana', desc: 'Kusursuz hatlara sahip Rus model. Ataşehir bölgesindeki elit rezidanslarda ve otellerde hizmet verir.' },
    { name: 'Ceren', desc: 'Samimi ve sıcakkanlı bireysel model. Bakırköy ve Yeşilköy otellerinde ön ödemesiz buluşmalar kabul eder.' }
  ];

  yOffset = 170;
  models.forEach((m) => {
    doc.fillColor('#111111')
       .fontSize(12)
       .font('Helvetica-Bold')
       .text(`⭐ Model: ${m.name} (${m.name} Escort)`, 50, yOffset);

    doc.fillColor('#333333')
       .fontSize(10)
       .font('Helvetica')
       .text(m.desc, 50, yOffset + 18, { width: 495, lineGap: 3 });

    const wpLink = `https://wa.me/12495448982?text=Merhaba%20${m.name},%20randevu%20hakkinda%20bilgi%20alabilir%20miyim?`;
    
    doc.fillColor('#008000')
       .fontSize(10)
       .font('Helvetica-Bold')
       .text('🟢 WhatsApp İletişim Hattı İçin Tıklayın', 50, yOffset + 48, {
         link: wpLink,
         underline: true
       });

    yOffset += 85;
  });

  doc.fillColor('#777777')
     .fontSize(9)
     .font('Helvetica')
     .text('Sayfa 5 / 8 | DRKCNAY VIP Network', 50, 750, { align: 'center' });

  // ---------------------------------------------------------------------------
  // PAGE 6: SCAM AVOIDANCE
  // ---------------------------------------------------------------------------
  doc.addPage();
  doc.fillColor('#FFFFFF').rect(0, 0, 595.28, 841.89).fill();

  doc.fillColor('#111111')
     .fontSize(20)
     .font('Helvetica-Bold')
     .text('5. Escort Sektöründe Dolandırıcılık ve Korunma Rehberi', 50, 50);

  doc.fillColor('#FFD700').rect(50, 75, 495, 2).fill();

  doc.fillColor('#333333')
     .fontSize(11)
     .font('Helvetica')
     .text('İstanbul genelinde escort bayan ilanları ararken dolandırıcılardan korunmak için aşağıdaki altın kurallara mutlaka uymalısınız. Sektörde güvenliğinizi korumak tamamen sizin elinizdedir.', 50, 95, {
       width: 495,
       align: 'justify',
       lineGap: 4
     });

  const rules = [
    { title: 'Asla Kapora Göndermeyin', text: 'Taksi parası, kuaför ücreti, rezervasyon teminatı veya kayıt bedeli gibi bahanelerle sizden ön ödeme talep eden kişilerin tamamı dolandırıcıdır. Gerçek bağımsız modeller her zaman elden ödemeyle çalışır.' },
    { title: 'Teyitli Telefon Numaralarını Tercih Edin', text: 'Sadece güvenilir portallarda listelenmiş ve teyitli WhatsApp numaralarına sahip olan profesyonel modellerle iletişime geçin. Geçici burner numaralar kullanan kişilerden uzak durun.' },
    { title: 'Görsel Doğrulama İsteyin', text: 'İletişime geçtiğiniz kişiden güncel teyitli fotoğraf veya kısa video isteyin. İlanlardaki fotoğraflarla gerçek kişinin uyuştuğundan emin olun.' }
  ];

  yOffset = 180;
  rules.forEach((r, idx) => {
    doc.fillColor('#D8000C')
       .fontSize(12)
       .font('Helvetica-Bold')
       .text(`⚠️ Kural ${idx + 1}: ${r.title}`, 50, yOffset);

    doc.fillColor('#333333')
       .fontSize(10)
       .font('Helvetica')
       .text(r.text, 50, yOffset + 18, { width: 495, lineGap: 3 });

    yOffset += 80;
  });

  // Call to action banner
  doc.fillColor('#FFF0F0')
     .rect(50, 440, 495, 80).fill()
     .strokeColor('#D8000C').stroke();

  doc.fillColor('#D8000C')
     .fontSize(11)
     .font('Helvetica-Bold')
     .text('🚨 GÜVENLİK UYARISI', 70, 455);

  doc.fillColor('#333333')
     .fontSize(9.5)
     .font('Helvetica')
     .text('Rehberimizdeki tüm partnerler %100 elden ödemelidir. Herhangi bir kapora talebinde bulunulması durumunda lütfen info@dorukcanay.digital adresine şikayet bildirin.', 70, 475, { width: 455 });

  doc.fillColor('#777777')
     .fontSize(9)
     .font('Helvetica')
     .text('Sayfa 6 / 8 | DRKCNAY VIP Network', 50, 750, { align: 'center' });

  // ---------------------------------------------------------------------------
  // PAGE 7: LINK WHEEL DIRECTORY
  // ---------------------------------------------------------------------------
  doc.addPage();
  doc.fillColor('#FFFFFF').rect(0, 0, 595.28, 841.89).fill();

  doc.fillColor('#111111')
     .fontSize(20)
     .font('Helvetica-Bold')
     .text('6. Mahalle ve Alt Lokasyon Link Wheel Kataloğu', 50, 50);

  doc.fillColor('#FFD700').rect(50, 75, 495, 2).fill();

  doc.fillColor('#333333')
     .fontSize(11)
     .font('Helvetica')
     .text('İstanbul\'un en popüler alt bölgelerinde ve mahallelerinde hizmet veren partnerlerin arama sayfalarına ve güncel ilanlarına aşağıdaki dizinden ulaşarak backlink döngüsünü takip edebilirsiniz.', 50, 95, {
       width: 495,
       align: 'justify',
       lineGap: 4
     });

  const linkWheelList = [
    { loc: 'Mecidiyekoy', label: `Mecidiyeköy VIP ${keyword === 'escort' ? 'Escort' : 'Eskort'} İlanları` },
    { loc: 'Etiler', label: `Etiler VIP ${keyword === 'escort' ? 'Escort' : 'Eskort'} İlanları` },
    { loc: 'Bebek', label: `Bebek Elit ${keyword === 'escort' ? 'Escort' : 'Eskort'} Partner Kataloğu` },
    { loc: 'Florya', label: `Florya Kaporasız ${keyword === 'escort' ? 'Escort' : 'Eskort'}` },
    { loc: 'Nisantasi', label: `Nişantaşı ${keyword === 'escort' ? 'Escort Bayan' : 'Eskort Bayan'} İlanları` },
    { loc: 'Acibadem', label: `Acıbadem ${keyword === 'escort' ? 'Escort' : 'Eskort'} İletişim` },
    { loc: 'Bostanci', label: `Bostancı VIP ${keyword === 'escort' ? 'Escort' : 'Eskort'} Randevu` },
    { loc: 'Suadiye', label: `Suadiye Model ${keyword === 'escort' ? 'Escort' : 'Eskort'} Kataloğu` },
    { loc: 'Bahcesehir', label: `Bahçeşehir Elit ${keyword === 'escort' ? 'Escort' : 'Eskort'} Lady` },
    { loc: 'Gokturk', label: `Göktürk VIP ${keyword === 'escort' ? 'Escort' : 'Eskort'} Seçenekleri` }
  ];

  yOffset = 180;
  linkWheelList.forEach((lw) => {
    const slug = slugify(lw.loc);
    const ampUrl = `https://${PRIMARY_HOST}/istanbul/${slug}`;

    doc.fillColor('#111111')
       .fontSize(11)
       .font('Helvetica-Bold')
       .text(`🔗 ${lw.label}:`, 50, yOffset);

    doc.fillColor('#0000EE')
       .fontSize(10)
       .font('Helvetica')
       .text(ampUrl, 230, yOffset, {
         link: ampUrl,
         underline: true
       });

    yOffset += 45;
  });

  doc.fillColor('#777777')
     .fontSize(9)
     .font('Helvetica')
     .text('Sayfa 7 / 8 | DRKCNAY VIP Network', 50, 750, { align: 'center' });

  // ---------------------------------------------------------------------------
  // PAGE 8: LEGAL & FOOTER SIGNATURE
  // ---------------------------------------------------------------------------
  doc.addPage();
  doc.fillColor('#111111').rect(0, 0, 595.28, 841.89).fill(); // Dark footer page

  doc.fillColor('#FFD700')
     .fontSize(16)
     .font('Helvetica-Bold')
     .text('LİSANS, YASAL UYARI VE FOOTER BİLDİRİMİ', 50, 100, { align: 'center' });

  doc.fillColor('#FFFFFF')
     .fontSize(11)
     .font('Helvetica')
     .text('Bu katalogda yer alan tüm görseller, açıklamalar ve model profilleri kendi rızalarıyla reklam hizmeti almak amacıyla sağlanmıştır. Dökümanda listelenen web adresleri ve yönlendirme bağlantıları, Google arama dizinlerinde görünürlük elde etmek amacıyla tasarlanmış bir SEO link-wheel yapısıdır.', 50, 160, {
       width: 495,
       align: 'justify',
       lineGap: 4
     });

  doc.fillColor('#FFFFFF')
     .fontSize(11)
     .font('Helvetica')
     .text('Buradaki içeriklerin kopyalanması, dağıtılması ve ticari olmayan web platformlarında yayınlanması Creative Commons Lisansı kapsamında serbesttir. backlink inşası için kendi bloglarınızda veya parazit platformlarınızda bu PDF dosyasını paylaşarak doğrudan ana domaine otorite akışı sağlayabilirsiniz.', 50, 260, {
       width: 495,
       align: 'justify',
       lineGap: 4
     });

  doc.fillColor('#FFD700')
     .rect(150, 420, 295, 1).fill();

  doc.fillColor('#FFFFFF')
     .fontSize(14)
     .font('Helvetica-Bold')
     .text('⚡ DORUKCAN AY ⚡', 50, 470, { align: 'center' });

  doc.fillColor('#A9A9A9')
     .fontSize(10)
     .font('Helvetica')
     .text('Tüm Hakları Saklıdır © 2026', 50, 500, { align: 'center' })
     .text('Secured by Sovereign-HQ Node Cluster', 50, 515, { align: 'center' });

  // End document
  doc.end();
  
  return new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function buildSEOPDFs() {
  console.log(`🔨 Generating Parasite SEO PDFs at: ${OUTPUT_DIR}`);
  
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  await generateSEOPDF('escort', 'istanbul-vip-escort-backlink-directory.pdf');
  await generateSEOPDF('eskort', 'istanbul-vip-eskort-backlink-directory.pdf');

  console.log('✅ Successfully generated 2 Parasite SEO PDF files (8 pages each) inside target folder.');
}

if (require.main === module) {
  buildSEOPDFs().catch(console.error);
}
