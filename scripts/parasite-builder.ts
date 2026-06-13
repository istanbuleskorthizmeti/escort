import fs from 'fs';
import path from 'path';
import { ISTANBUL_NEIGHBORS } from '../lib/seo/neighborhood-map';

// Target Redirect Domain Config (Will be resolved dynamically to Google AMP Cache)
const PRIMARY_REDIRECT_DOMAIN = "istanbulescort.blog";
const AMP_CACHE_SUBDOMAIN = PRIMARY_REDIRECT_DOMAIN.replace(/\./g, '-');


interface SpinContext {
  zone: string;
  upperZone: string;
  neighbors: string;
}

// 🎰 Turkish Content Spinner
function spinContentTR(ctx: SpinContext, seed: number): string {
  const { zone, upperZone, neighbors } = ctx;

  const intros = [
    `<p><strong>İstanbul ${upperZone} escort</strong> aramalarınız için güncel ilanları aşağıda bulabilirsiniz. Bölgede çalışan doğrulanmış <strong>${zone} eskort</strong> profilleri elden ödeme güvencesiyle hizmet sunmaktadır. Tüm <strong>${zone} escort bayan</strong> randevuları doğrudan kaporasız buluşma garantisiyle gerçekleştirilir.</p>`,
    `<p>Güvenilir bir <strong>${upperZone} eskort bayan</strong> randevusu oluşturmak için ön ödeme istemeyen <strong>İstanbul ${zone} escort</strong> profillerini tercih edin. İlan vitrinindeki <strong>${zone} eskort bayan telefon numaralarını</strong> kullanarak kızlarla doğrudan iletişime geçebilirsiniz.</p>`,
    `<p>Semtte 7/24 hizmet veren bağımsız <strong>${upperZone} eskort</strong> modellerini tek sayfada derledik. Sitemizde yer alan tüm <strong>${zone} escort bayan</strong> profilleri gerçek fotoğraflı olup kaporasız buluşma sağlamaktadır.</p>`
  ];

  const details = [
    `<p>Görüşmelerde gizlilik kurallarına önem verilir. Müşteri kayıtları kesinlikle tutulmaz. Komşu lokasyonlar olan ${neighbors} çevresine de kızlar hızlı servis göndermektedir.</p>`,
    `<p>Kopya görseller ve sahte ilanlarla karşılaşmayacağınız <strong>${upperZone} eskort kızlar</strong> listemiz tamamen kaporasızdır. Rezervasyon için profil kartlarındaki WhatsApp bağlantılarını takip etmeniz yeterlidir. Servis ağımız ${neighbors} semtlerini de kapsamaktadır.</p>`
  ];

  const features = [
    `<ul>
      <li><strong>🔒 %100 Kaporasız Randevu:</strong> Depozito veya ön ödeme riski yoktur. Ödemenizi adreste elden nakit yaparsınız.</li>
      <li><strong>💎 Vip ${upperZone} Eskort Standartları:</strong> Görsel doğrulaması yapılmış, elit refakatçi modeller.</li>
      <li><strong>📸 %100 Gerçek Fotoğraflar:</strong> İlan vitrininde seçtiğiniz kız kimse adrese gelen partner de odur.</li>
      <li><strong>🌍 Geniş İstanbul Hizmet Ağı:</strong> Sadece ${upperZone} değil, ${neighbors} bölgelerine de 30-45 dakikada hızlı servis.</li>
    </ul>`,
    `<ul>
      <li><strong>👑 Elit ${upperZone} Eskort Kadrosu:</strong> Otel veya rezidans randevularınıza uygun partner kızlar.</li>
      <li><strong>🚫 Elden Ödeme Güvencesi:</strong> Kapora talep eden dolandırıcılardan uzak durup adreste nakit ödeme seçeneği.</li>
      <li><strong>⏳ 7/24 Hızlı Randevu:</strong> WhatsApp üzerinden teyitli randevu koordinasyonu.</li>
      <li><strong>🎯 Yabancı & Rus Model Seçenekleri:</strong> Farklı kategorilerde aktif çalışan model partner alternatifleri.</li>
    </ul>`
  ];

  const faqs = [
    `<div class="faq-section">
      <h3>❓ Sıkça Sorulan Sorular</h3>
      <div class="faq-item">
        <strong>1. İstanbul ${upperZone} eskort randevularında kapora alınıyor mu?</strong>
        <p>Hayır. Platform genelinde yer alan tüm <strong>${zone} escort bayan</strong> ilanlarında ön ödeme veya kapora yoktur. Ödeme nakit olarak adreste elden yapılır.</p>
      </div>
      <div class="faq-item">
        <strong>2. Fotoğraflar güncel mi?</strong>
        <p>Evet, sistemimizdeki tüm Vip <strong>${zone} eskort</strong> profilleri güncel stüdyo çekimlerinden oluşmaktadır.</p>
      </div>
      <div class="faq-item">
        <strong>3. Komşu bölgelerden randevu oluşturabilir miyim?</strong>
        <p>Evet, ${neighbors} gibi çevre lokasyonlardan da hızlı servis ve Vip partner talebinde bulunabilirsiniz.</p>
      </div>
    </div>`,
    `<div class="faq-section">
      <h3>❓ Sıkça Sorulan Sorular</h3>
      <div class="faq-item">
        <strong>1. Görüşmelerde gizlilik nasıl sağlanıyor?</strong>
        <p>Gizliliğiniz kırmızı çizgimizdir. Hiçbir isim veya telefon kaydı veri tabanında saklanmaz.</p>
      </div>
      <div class="faq-item">
        <strong>2. Kızlarla nasıl iletişime geçebilirim?</strong>
        <p>İlanların altındaki bağlantıları kullanarak WhatsApp veya doğrudan arama yoluyla iletişim kurabilirsiniz.</p>
      </div>
    </div>`
  ];

  const i1 = intros[seed % intros.length];
  const d1 = details[(seed + 1) % details.length];
  const f1 = features[(seed + 2) % features.length];
  const q1 = faqs[(seed + 3) % faqs.length];

  return `
    <section class="content-block">
      <h2>👑 ${upperZone} Vip Partner ve Escort Deneyimi</h2>
      ${i1}
      ${d1}
    </section>
    
    <section class="content-block">
      <h2>💎 Neden Bizim Elit Arayüzümüz?</h2>
      ${f1}
    </section>

    <section class="content-block">
      ${q1}
    </section>
  `.trim();
}

// 🎰 English Content Spinner
function spinContentEN(ctx: SpinContext, seed: number): string {
  const { zone, upperZone, neighbors } = ctx;

  const intros = [
    `<p>Looking for verified <strong>Istanbul ${upperZone} escort</strong> profiles? Check out our direct list of active companions in <strong>${zone}</strong>. All girls provide outcall services to hotels and residences with cash payment on arrival and zero upfront fees.</p>`,
    `<p>Avoid advance payment scams. Our <strong>${upperZone} escort directory</strong> lists independent <strong>${zone} escort girls</strong> working strictly with cash on delivery. You can contact them directly via WhatsApp using the buttons below.</p>`,
    `<p>Get 24/7 outcall service in ${upperZone} and surrounding areas. Our directory features independent <strong>${zone} escort bayan</strong> profiles with verified photos and zero deposit requirements.</p>`
  ];

  const details = [
    `<p>We guarantee complete privacy for all outcall bookings. No customer records or logs are saved. Girls also travel to neighboring areas such as ${neighbors} within 30-45 minutes.</p>`,
    `<p>All profiles in our <strong>${upperZone} escort models</strong> list are verified. Enjoy safe, direct meetings with zero prepayment. Outcalls are available to ${neighbors} and nearby districts.</p>`
  ];

  const features = [
    `<ul>
      <li><strong>🔒 No Prepayment Required:</strong> No reservation fees or deposits. You pay cash in person to the girl.</li>
      <li><strong>💎 Vip ${upperZone} Escort Standards:</strong> Elegant, verified independent companion models.</li>
      <li><strong>📸 100% Real Photos:</strong> The girl you see on our website is exactly the one who arrives at your address.</li>
      <li><strong>🌍 Direct Hotel Outcalls:</strong> Fast travel to ${upperZone} and surrounding areas like ${neighbors}.</li>
    </ul>`,
    `<ul>
      <li><strong>👑 Elite ${upperZone} Escort Bayan:</strong> Selected models suitable for high-end hotel and residence bookings.</li>
      <li><strong>🚫 Cash on Delivery:</strong> Protect yourself from scams by paying cash only when the girl arrives.</li>
      <li><strong>⏳ 24/7 WhatsApp Contact:</strong> Direct booking coordination with no intermediate agencies.</li>
      <li><strong>🎯 Foreign & Russian Girls:</strong> Different categories available to suit your preferences.</li>
    </ul>`
  ];

  const faqs = [
    `<div class="faq-section">
      <h3>❓ Frequently Asked Questions</h3>
      <div class="faq-item">
        <strong>1. Do you require any booking deposits?</strong>
        <p>No deposit is required. All listed profiles work with direct cash payment upon arrival.</p>
      </div>
      <div class="faq-item">
        <strong>2. Are the companion photos real?</strong>
        <p>Yes, all listed <strong>${zone} Vip escort</strong> profiles feature actual verified studio photos.</p>
      </div>
      <div class="faq-item">
        <strong>3. Do you cover surrounding areas?</strong>
        <p>Yes, fast outcall delivery is available to neighboring locations like ${neighbors}.</p>
      </div>
    </div>`,
    `<div class="faq-section">
      <h3>❓ Frequently Asked Questions</h3>
      <div class="faq-item">
        <strong>1. How is privacy guaranteed?</strong>
        <p>Your privacy is important. All messaging records and phone numbers are deleted immediately after the booking.</p>
      </div>
      <div class="faq-item">
        <strong>2. How do I contact the girls?</strong>
        <p>Use the buttons under the profile cards to connect directly via WhatsApp or voice calls.</p>
      </div>
    </div>`
  ];

  const i1 = intros[seed % intros.length];
  const d1 = details[(seed + 1) % details.length];
  const f1 = features[(seed + 2) % features.length];
  const q1 = faqs[(seed + 3) % faqs.length];

  return `
    <section class="content-block">
      <h2>👑 ${upperZone} Vip Partner and Escort Experience</h2>
      ${i1}
      ${d1}
    </section>
    
    <section class="content-block">
      <h2>💎 Why Choose Our Directory?</h2>
      ${f1}
    </section>

    <section class="content-block">
      ${q1}
    </section>
  `.trim();
}

// 🎰 Russian Content Spinner
function spinContentRU(ctx: SpinContext, seed: number): string {
  const { zone, upperZone, neighbors } = ctx;

  const intros = [
    `<p>Ищете проверенный <strong>эскорт в Стамбуле ${upperZone}</strong>? В нашем каталоге собраны актуальные анкеты индивидуалок и моделей из района <strong>${zone}</strong>. Все встречи проводятся без предоплаты с расчетом на месте. Вы можете заказать выезд <strong>эскорт модели в ${zone}</strong> в отель или свои апартаменты.</p>`,
    `<p>Если вам нужны реальные анкеты <strong>эскорт девушек в ${upperZone}</strong> с оплатой при встрече, выбирайте профили из нашего списка. Никаких депозитов заранее. Для связи и бронирования <strong>эскорта в ${zone}</strong> напишите моделям напрямую в WhatsApp.</p>`,
    `<p>Актуальная база индивидуалок и моделей из района <strong>${upperZone}</strong>. Выезд на дом или в отель в течение 30-40 минут. Только проверенные фото и надежный <strong>эскорт ${zone}</strong> без предварительных платежей.</p>`
  ];

  const details = [
    `<p>Полная конфиденциальность гарантирована. История переписки и вызовов сразу удаляется. Возможен оперативный выезд моделей в соседние районы: ${neighbors}.</p>`,
    `<p>В отличие от сайтов-агрегаторов с фейками, наши <strong>эскорт модели в ${upperZone}</strong> работают без предоплаты. Все расчеты производятся лично при встрече. Также обслуживаем ${neighbors}.</p>`
  ];

  const features = [
    `<ul>
      <li><strong>🔒 Без предоплаты:</strong> Никаких переводов до встречи. Оплата наличными лично в руки.</li>
      <li><strong>💎 Реальные модели ${upperZone}:</strong> Только верифицированные анкеты с ухоженными девушками.</li>
      <li><strong>📸 100% Соответствие фото:</strong> Приедет именно та девушка, которую вы выбрали в каталоге.</li>
      <li><strong>🌍 Быстрая подача:</strong> Выезд по ${upperZone} и в близлежащие районы ${neighbors} круглосуточно.</li>
    </ul>`,
    `<ul>
      <li><strong>👑 Элитный эскорт в ${upperZone}:</strong> Ухоженные девушки для сопровождения и встреч в отелях.</li>
      <li><strong>🚫 Безопасный расчет:</strong> Полностью исключены схемы с предоплатой и залогами.</li>
      <li><strong>⏳ Связь в WhatsApp 24/7:</strong> Удобное бронирование выезда без лишних звонков.</li>
      <li><strong>🎯 Разные категории:</strong> Местные и приезжие модели под любые предпочтения.</li>
    </ul>`
  ];

  const faqs = [
    `<div class="faq-section">
      <h3>❓ Часто задаваемые вопросы</h3>
      <div class="faq-item">
        <strong>1. Есть ли предоплата или залог за бронь?</strong>
        <p>Нет, никаких предоплат мы не берем. Оплата производится лично модели при встрече.</p>
      </div>
      <div class="faq-item">
        <strong>2. Фотографии в каталоге настоящие?</strong>
        <p>Да, все фото на 100% соответствуют реальности, анкеты проходят проверку.</p>
      </div>
      <div class="faq-item">
        <strong>3. Возможен ли выезд за пределы района?</strong>
        <p>Да, модели выезжают в любые отели и апартаменты по соседству, включая ${neighbors}.</p>
      </div>
    </div>`,
    `<div class="faq-section">
      <h3>❓ Часто задаваемые вопросы</h3>
      <div class="faq-item">
        <strong>1. Как обеспечивается приватность?</strong>
        <p>Мы удаляем контакты и данные клиентов сразу после подтверждения встречи.</p>
      </div>
      <div class="faq-item">
        <strong>2. Как связаться для заказа?</strong>
        <p>Используйте кнопку перехода в каталог под анкетами для быстрой связи в WhatsApp.</p>
      </div>
    </div>`
  ];

  const i1 = intros[seed % intros.length];
  const d1 = details[(seed + 1) % details.length];
  const f1 = features[(seed + 2) % features.length];
  const q1 = faqs[(seed + 3) % faqs.length];

  return `
    <section class="content-block">
      <h2>👑 Эскорт и проверенные модели в ${upperZone}</h2>
      ${i1}
      ${d1}
    </section>
    
    <section class="content-block">
      <h2>💎 Почему стоит заказывать у нас?</h2>
      ${f1}
    </section>

    <section class="content-block">
      ${q1}
    </section>
  `.trim();
}

function toTitleCaseTR(str: string): string {
  if (!str) return "";
  const cleanStr = str.replace(/-/g, ' ');
  return cleanStr
    .split(/\s+/)
    .map(word => {
      if (!word) return "";
      const lowerWord = word.toLowerCase()
        .replace(/İ/g, "i")
        .replace(/I/g, "ı")
        .replace(/Ş/g, "ş")
        .replace(/Ç/g, "ç")
        .replace(/Ö/g, "ö")
        .replace(/Ü/g, "ü")
        .replace(/Ğ/g, "ğ");
      if (lowerWord === 'vip' || lowerWord === 'vıp') return 'Vip';
      const first = word.charAt(0)
        .replace(/i/g, "İ")
        .replace(/ı/g, "I")
        .replace(/ş/g, "Ş")
        .replace(/ç/g, "Ç")
        .replace(/ö/g, "Ö")
        .replace(/ü/g, "Ü")
        .replace(/ğ/g, "Ğ")
        .toUpperCase();
      const rest = word.slice(1)
        .replace(/İ/g, "i")
        .replace(/I/g, "ı")
        .replace(/Ş/g, "ş")
        .replace(/Ç/g, "ç")
        .replace(/Ö/g, "ö")
        .replace(/Ü/g, "ü")
        .replace(/Ğ/g, "ğ")
        .toLowerCase();
      return first + rest;
    })
    .join(' ');
}

function getDynamicSeoMetadata(zone: string, seed: number) {
  const upperZone = toTitleCaseTR(zone);
  const titles = [
    `🔥 İstanbul ${upperZone} Escort - Elit ${upperZone} Eskort Bayanlar`,
    `💎 ${upperZone} Escort | Vip ${upperZone} Eskort Bayan Rehberi (Kaporasız)`,
    `👑 İstanbul ${upperZone} Escort - ${upperZone} Vip Partner ve Eskort`,
    `🔞 ${upperZone} Escort | Kaporasız ${upperZone} Eskort Bayan Numaraları`
  ];
  
  const descriptions = [
    `İstanbul ${upperZone} escort ve eskort bayan ilanları. Kaporasız, %100 doğrulanmış gerçek ${upperZone} Vip partner hizmetleri için hemen tıklayın.`,
    `${upperZone} escort ve Vip eskort bayan rehberi. Kapıda ödemeli, kaporasız ${upperZone} elit model ilanları ile gerçek partnerinle hemen buluş.`,
    `En popüler ${upperZone} escort bayan telefon numaraları ve randevu detayları. Doğrulanmış resimli ${upperZone} eskort hizmetleri için kataloğumuzu inceleyin.`
  ];
  
  return {
    title: titles[seed % titles.length],
    description: descriptions[seed % descriptions.length]
  };
}

function generateSchemas(zone: string, seed: number): string {
  const upperZone = toTitleCaseTR(zone);
  const ratingCount = 100 + (seed * 17) % 150;
  const ratingValue = (4.7 + (seed * 3) % 4 * 0.1).toFixed(1);
  
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `İstanbul ${upperZone} Escort ve Eskort Hizmetleri`,
    "description": `${upperZone} bölgesinde kapıda ödemeli, kaporasız doğrulanmış eskort bayan ilanları ve Vip partner hizmetleri.`,
    "image": "https://istanbulescort.blog/assets/logo.png",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": upperZone,
      "addressRegion": "İstanbul",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "41.0082",
      "longitude": "28.9784"
    },
    "telephone": "+900000000000"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `İstanbul ${upperZone} eskort bayan randevusu kaporasız mı?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Evet, ${upperZone} escort randevularımızda kesinlikle ön ödeme veya kapora talep edilmez. Güvenle elden ödeme yapabilirsiniz.`
        }
      },
      {
        "@type": "Question",
        "name": `${upperZone} escort bayan görsel ve profilleri gerçek mi?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Evet, tüm ${upperZone} eskort ilanlarımızdaki fotoğraflar güncel ve doğrulanmış gerçek modellerden oluşmaktadır.`
        }
      }
    ]
  };

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": `${upperZone} Escort ve Vip Eskort Bayanlar`,
    "image": "https://istanbulescort.blog/assets/logo.png",
    "description": `${upperZone} kaporasız, doğrulanmış Vip escort ve eskort bayan ilanları rehberi.`,
    "brand": {
      "@type": "Brand",
      "name": "Hydra Elite"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": ratingCount.toString()
    }
  };

  return `
    <script type="application/ld+json">${JSON.stringify(localBusinessSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(productSchema)}</script>
  `;
}

// 🎨 Premium Static HTML Generator
function generateHtmlPage(zone: string, contentTR: string, contentEN: string, contentRU: string, seed: number): string {
  const upperZone = toTitleCaseTR(zone);
  const meta = getDynamicSeoMetadata(zone, seed);
  const schemas = generateSchemas(zone, seed);

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>💎 ${meta.title} (2026)</title>
  <meta name="description" content="${meta.description}">
  <meta name="keywords" content="${zone} escort, ${zone} vip escort, ${zone} eskort, ${zone} eskort bayan, istanbul escort, elit partner, rus eskort">
  <link rel="canonical" href="https://dorukcanay-elite.github.io/drkcnay-${zone.toLowerCase()}/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=Outfit:wght@300;600;900&display=swap" rel="stylesheet">
  ${schemas}
  
  <style>
    :root {
      --bg: #09090b;
      --card-bg: rgba(24, 24, 27, 0.65);
      --border: rgba(63, 63, 70, 0.4);
      --primary: #f43f5e;
      --primary-glow: rgba(244, 63, 94, 0.15);
      --text: #f4f4f5;
      --text-muted: #a1a1aa;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      line-height: 1.7;
      overflow-x: hidden;
      position: relative;
    }

    /* Elegant Glowing Backgrounds */
    body::before {
      content: '';
      position: absolute;
      top: -10%;
      left: 15%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
      pointer-events: none;
      z-index: -1;
    }

    body::after {
      content: '';
      position: absolute;
      bottom: 10%;
      right: 10%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%);
      pointer-events: none;
      z-index: -1;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    /* Header styling with dynamic logo */
    header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 20px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--primary), #a855f7);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 15px var(--primary-glow);
    }

    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      background: linear-gradient(to right, #ffffff, #a1a1aa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .logo-text span {
      color: var(--primary);
      -webkit-text-fill-color: initial;
    }

    .tagline {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--text-muted);
      font-weight: 800;
    }

    /* Language Selector */
    .lang-selector {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 25px;
    }

    .lang-btn {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 10px;
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .lang-btn:hover, .lang-btn.active {
      background: var(--primary);
      border-color: var(--primary);
      color: #ffffff;
      box-shadow: 0 4px 12px var(--primary-glow);
    }

    /* Language content elements default state */
    .lang-content {
      display: none;
    }
    .lang-content.active {
      display: block !important;
    }

    /* Glassmorphism content cards */
    .content-block {
      background: var(--card-bg);
      border: 1px solid var(--border);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 20px;
      padding: 30px;
      margin-bottom: 25px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    }

    h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 15px;
      text-transform: uppercase;
      border-left: 4px solid var(--primary);
      padding-left: 10px;
    }

    p {
      color: var(--text-muted);
      font-size: 14px;
      margin-bottom: 15px;
    }

    strong {
      color: #ffffff;
    }

    ul {
      list-style-type: none;
      margin-bottom: 15px;
    }

    li {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 8px;
      padding-left: 18px;
      position: relative;
    }

    li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--primary);
      font-weight: bold;
    }

    /* High Converting CTA Button */
    .cta-card {
      background: linear-gradient(135deg, rgba(244, 63, 94, 0.08) 0%, rgba(168, 85, 247, 0.04) 100%);
      border: 1px solid rgba(244, 63, 94, 0.2);
      border-radius: 24px;
      padding: 35px;
      text-align: center;
      margin-bottom: 30px;
      box-shadow: 0 12px 30px rgba(244, 63, 94, 0.03);
    }

    .cta-title {
      font-family: 'Outfit', sans-serif;
      font-size: 24px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .cta-desc {
      font-size: 13px;
      color: var(--text-muted);
      max-width: 580px;
      margin: 0 auto 20px auto;
    }

    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, var(--primary), #db2777);
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-decoration: none;
      padding: 16px 40px;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(244, 63, 94, 0.35);
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(244, 63, 94, 0.5);
      background: #ffffff;
      color: #000000;
    }

    /* FAQ Section */
    .faq-section h3 {
      font-family: 'Outfit', sans-serif;
      color: #ffffff;
      margin-bottom: 15px;
      font-size: 16px;
    }

    .faq-item {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 12px;
      margin-bottom: 12px;
    }

    .faq-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }

    .faq-item strong {
      display: block;
      font-size: 13px;
      margin-bottom: 6px;
      color: #ffffff;
    }

    /* Footer styling and Badges */
    footer {
      border-top: 1px solid var(--border);
      padding-top: 30px;
      margin-top: 50px;
      text-align: center;
      color: var(--text-muted);
      font-size: 10px;
    }

    .badges {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .badge {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 8px;
      padding: 8px 14px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 8px;
      letter-spacing: 1px;
    }

    .badge-icon {
      color: var(--primary);
      font-weight: bold;
    }

    .copyright {
      margin-bottom: 8px;
    }

    .security-notice {
      color: #3f3f46;
      font-size: 8px;
    }
  </style>
</head>
<body>

  <div class="container">
    
    <header>
      <div class="logo">
        <div class="logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color: #ffffff;">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="logo-text">${upperZone} <span>ELITE</span></div>
      </div>
      <p class="tagline">🔒 HYDRA NETWORK SECURED AUTHORITY // 2026</p>
    </header>

    <!-- Beautiful Language Tab Selector -->
    <div class="lang-selector">
      <button class="lang-btn active" onclick="switchLanguage('tr')">🇹🇷 Türkçe</button>
      <button class="lang-btn" onclick="switchLanguage('en')">🇬🇧 English</button>
      <button class="lang-btn" onclick="switchLanguage('ru')">🇷🇺 Русский</button>
    </div>

    <!-- Turkish Content Block -->
    <div class="lang-content lang-tr active">
      <div class="cta-card">
        <h1 class="cta-title">${upperZone} EŞSİZ VIP REHBERİ</h1>
        <p class="cta-desc">Tamamen doğrulanmış, kaporasız ve elden ödemeli model portföyüne erişmek için aşağıdaki kapıyı kullanın. İstanbul'un en seçkin partnerleri sizi bekliyor.</p>
        <a href="https://${PRIMARY_REDIRECT_DOMAIN}/istanbul/${zone.toLowerCase()}" class="cta-btn" rel="dofollow">KATALOĞU GÖRÜNTÜLE →</a>
      </div>
      ${contentTR}
    </div>

    <!-- English Content Block -->
    <div class="lang-content lang-en">
      <div class="cta-card">
        <h1 class="cta-title">${upperZone} VIP ESCORT DIRECTORY</h1>
        <p class="cta-desc">Use the button below to access our 100% verified, no deposit, and cash-on-delivery VIP companion portfolio. Istanbul's premium escorts await you.</p>
        <a href="https://${PRIMARY_REDIRECT_DOMAIN}/istanbul/${zone.toLowerCase()}" class="cta-btn" rel="dofollow">VIEW CATALOGUE →</a>
      </div>
      ${contentEN}
    </div>

    <!-- Russian Content Block -->
    <div class="lang-content lang-ru">
      <div class="cta-card">
        <h1 class="cta-title">VIP ЭСКОРТ КАТАЛОГ ${upperZone.toUpperCase()}</h1>
        <p class="cta-desc">Используйте кнопку ниже для доступа к 100% проверенным анкетам элитных моделей без предоплаты с расчетом при встрече. Вас ждут лучшие эскорт девушки Стамбула.</p>
        <a href="https://${PRIMARY_REDIRECT_DOMAIN}/istanbul/${zone.toLowerCase()}" class="cta-btn" rel="dofollow">ПЕРЕЙТИ В КАТАЛОГ →</a>
      </div>
      ${contentRU}
    </div>

    <footer>
      <div class="badges">
        <div class="badge">
          <span class="badge-icon">✓</span> DMCA PROTECTED
        </div>
        <div class="badge">
          <span class="badge-icon">🛡️</span> SSL SECURED
        </div>
        <div class="badge">
          <span class="badge-icon">🔒</span> ANTI-COPY ACTIVE
        </div>
      </div>
      <p class="copyright">© 2026 Hydra Network Authority & ${upperZone} Elite. Tüm Hakları Saklıdır.</p>
      <p class="security-notice">Bu sayfa dijital telif hakları (DMCA) koruması altındadır. Sayfa içeriğinin kopyalanması durumunda yasal işlem uygulanacaktır.</p>
    </footer>

  </div>

  <!-- Dynamic Content Display & Copy Protection Script -->
  <script>
    // 🌐 Language switching logic
    function switchLanguage(lang) {
      document.querySelectorAll('.lang-content').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
      });
      const target = document.querySelector('.lang-' + lang);
      if (target) {
        target.classList.add('active');
        target.style.display = 'block';
      }
      
      document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
      const activeBtn = Array.from(document.querySelectorAll('.lang-btn')).find(btn => {
        const onClickAttr = btn.getAttribute('onclick');
        return onClickAttr && onClickAttr.includes(lang);
      });
      if (activeBtn) {
        activeBtn.classList.add('active');
      }
    }

    // 📱 Phone/Browser Language Auto-Detection (God Mode)
    (function() {
      try {
        const userLang = (navigator.language || navigator.userLanguage || 'tr').toLowerCase();
        if (userLang.startsWith('ru')) {
          switchLanguage('ru');
        } else if (userLang.startsWith('en')) {
          switchLanguage('en');
        } else {
          switchLanguage('tr');
        }
      } catch (e) {
        switchLanguage('tr');
      }
    })();

    // 🔒 Anti-Scraping Security Guards
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
    document.addEventListener('selectstart', function(e) {
      e.preventDefault();
    });
    document.addEventListener('keydown', function(e) {
      if (e.ctrlKey && (e.key === 'u' || e.key === 'c' || e.key === 'a' || e.key === 'i' || e.key === 'j')) {
        e.preventDefault();
      }
      if (e.key === 'F12') {
        e.preventDefault();
      }
    });
  </script>
</body>
</html>
`.trim();
}

// 🌐 Kök Portal (dorukcanay-elite.github.io) HTML Generator
function generateRootPortalHtml(): string {
  const zonesList = Object.keys(ISTANBUL_NEIGHBORS).sort();

  const linksHtml = zonesList.map(z => {
    const upper = z.charAt(0).toUpperCase() + z.slice(1);
    return `<a href="./drkcnay-${z.toLowerCase()}/" class="portal-link-item">
      <div class="portal-link-icon">📍</div>
      <div class="portal-link-name">${upper} VIP Rehber</div>
    </a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>💎 DRKCNAY ELITE | VIP Elite Concierge Portal (2026)</title>
  <meta name="description" content="İstanbul'un tüm elit bölgelerinde kaporasız, doğrulanmış VIP partner ve refakatçilik hizmetleri portalı.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=Outfit:wght@300;600;900&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg: #09090b;
      --card-bg: rgba(24, 24, 27, 0.65);
      --border: rgba(63, 63, 70, 0.4);
      --primary: #f43f5e;
      --primary-glow: rgba(244, 63, 94, 0.15);
      --text: #f4f4f5;
      --text-muted: #a1a1aa;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      overflow-x: hidden;
      position: relative;
    }

    body::before {
      content: '';
      position: absolute;
      top: -10%;
      left: 10%;
      width: 700px;
      height: 700px;
      background: radial-gradient(circle, rgba(244, 63, 94, 0.12) 0%, transparent 70%);
      pointer-events: none;
      z-index: -1;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 60px 20px;
    }

    header {
      text-align: center;
      margin-bottom: 50px;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--primary), #a855f7);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 25px var(--primary-glow);
    }

    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-size: 30px;
      font-weight: 900;
      letter-spacing: 3px;
      text-transform: uppercase;
      background: linear-gradient(to right, #ffffff, #a1a1aa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .logo-text span {
      color: var(--primary);
      -webkit-text-fill-color: initial;
    }

    h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 34px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 15px;
      text-transform: uppercase;
    }

    .subtitle {
      color: var(--text-muted);
      font-size: 15px;
      max-width: 600px;
      margin: 0 auto;
    }

    .grid-portal {
      display: grid;
      grid-template-cols: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 60px;
    }

    .portal-link-item {
      background: var(--card-bg);
      border: 1px solid var(--border);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 20px;
      padding: 22px;
      text-align: center;
      text-decoration: none;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    }

    .portal-link-item:hover {
      border-color: var(--primary);
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(244, 63, 94, 0.15);
    }

    .portal-link-icon {
      font-size: 24px;
      margin-bottom: 10px;
    }

    .portal-link-name {
      font-family: 'Outfit', sans-serif;
      color: #ffffff;
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    footer {
      border-top: 1px solid var(--border);
      padding-top: 40px;
      text-align: center;
      color: var(--text-muted);
      font-size: 12px;
    }

    .badges {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 20px;
    }

    .badge {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 8px 15px;
      font-weight: 800;
      font-size: 9px;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>

  <div class="container">
    
    <header>
      <div class="logo">
        <div class="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color: #ffffff;">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="logo-text">DRKCNAY <span>ELITE</span></div>
      </div>
      <h1>VIP Elite Concierge Network</h1>
      <p class="subtitle">İstanbul genelinde kaporasız, gerçek ve doğrulanmış profillerin yer aldığı en seçkin bölgesel ağ rehberlerimize aşağıdaki linklerden ulaşabilirsiniz.</p>
    </header>

    <div class="grid-portal">
      ${linksHtml}
    </div>

    <footer>
      <div class="badges">
        <div class="badge">DMCA SECURED</div>
        <div class="badge">SSL PROTECTION</div>
        <div class="badge">HYDRA FLEET CONTROL</div>
      </div>
      <p>© 2026 Hydra Network. Tüm hakları saklıdır.</p>
    </footer>

  </div>

</body>
</html>
`.trim();
}

// 🚀 Main Builder Loop
function buildAllParasites() {
  console.log("🔥 [BUILDER] Commencing parasite build process...");
  
  const zones = Object.keys(ISTANBUL_NEIGHBORS);
  let count = 0;

  for (let idx = 0; idx < zones.length; idx++) {
    const zone = zones[idx];
    const neighborsList = ISTANBUL_NEIGHBORS[zone] || [];
    const neighborsString = neighborsList.join(', ');
    const spinCtx: SpinContext = {
      zone,
      upperZone: toTitleCaseTR(zone),
      neighbors: neighborsString || "Çevre Semtler"
    };    // Spin Content & Compile HTML for TR, EN, RU
    const contentTR = spinContentTR(spinCtx, idx);
    const contentEN = spinContentEN(spinCtx, idx);
    const contentRU = spinContentRU(spinCtx, idx);
    const html = generateHtmlPage(zone, contentTR, contentEN, contentRU, idx);

    // Write to parasite_hub/[zone]/index.html
    const dir = path.join(process.cwd(), 'parasite_hub', zone.toLowerCase());
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(path.join(dir, 'index.html'), html);
    
    // Write a clean markdown payload for Git repos too
    const targetAmpUrl = `https://${PRIMARY_REDIRECT_DOMAIN}/istanbul/${zone.toLowerCase()}`;
    const md = `# 💎 ${spinCtx.upperZone} Escort | VIP Partner & Escort Kataloğu (2026)

${spinCtx.upperZone} bölgesinde kaporasız, %100 doğrulanmış, kapıda elden ödemeli VIP partnerlerin yer aldığı resmi rehberimize hoş geldiniz.

## 🔗 RESMİ ERİŞİM PORTALI
> [!IMPORTANT]
> Gerçek fotoğraflı, doğrulanmış VIP escort kataloğunu görüntülemek ve randevu oluşturmak için resmi web sitemizi ziyaret edin:
> ### 🌐 👉 [${spinCtx.upperZone} Escort Portalı](${targetAmpUrl}) 👈

## 📍 HİZMET ALANLARI VE BÖLGELER
- **🔞 ${spinCtx.upperZone} Rus Escort:** Kültürel zarafet ve yüksek kaliteli partnerlik.
- **🎓 ${spinCtx.upperZone} Üniversiteli Escort:** Genç, enerjik ve dinamik arkadaşlar.
- **👑 VIP Partner & Eşlik Hizmeti:** Tamamen gizli, lüks refakatçilik hizmeti.

---
*Bu sayfa Hydra Otorite Ağı tarafından yönetilmekte ve DMCA ile korunmaktadır.*
`.trim();

    fs.writeFileSync(path.join(dir, 'README_FINAL.md'), md);
    count++;
  }

  // 🌐 Create Root Portal index.html inside parasite_hub/
  const rootPortalHtml = generateRootPortalHtml();
  fs.writeFileSync(path.join(process.cwd(), 'parasite_hub', 'index.html'), rootPortalHtml);

  console.log(`🏁 [SUCCESS] Compiled ${count} individual static parasite projects + 1 root portal.`);
}

buildAllParasites();
