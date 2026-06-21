import * as fs from 'fs';
import * as path from 'path';
import { istanbulCity } from '../lib/locations-registry/istanbul';

/**
 * 🧛‍♂️ GOOGLE SITES HTML PAYLOAD FACTORY (v16.0 - Ultimate Opsec & Anti-Duplicate Edition)
 * Generates 5 highly optimized layout variations for each of the 348 locations.
 * 
 * 🛡️ GOOGLE AMP CACHE BYPASS SPECIFICATION (dorukcanay.digital ONLY):
 * - Primary Host: dorukcanay.digital (Direct serving & direct media)
 * - Google AMP Cache Host (Unblockable by BTK / TIB):
 *   - Catalog links point directly to the AMP Cache of dorukcanay.digital
 * 
 * 📝 NOTEPAD GENERATOR:
 * - Creates a comprehensive setup directory (google-sites-setup-directory.txt) next to the payloads
 *   detailing every location's URL, Page Title, Meta Description, Target AMP Cache Link, and Gold Keywords.
 */

const PRIMARY_HOST = 'dorukcanay.digital';
const OUTPUT_DIR = 'C:\\Users\\onurk\\Desktop\\google-sites-payloads-optimized';

// Google Search Console dynamic verification tags array to bypass PBN footprint identification
const GSC_VERIFICATIONS = [
  'google4e51249b6b772422.html',
  'google909007af5da5c8d5.html',
  'qccx44g5S-nkLQjyo5uIjlGz_STmjbpZ6p5mRdZT50U.html',
  'google883f3e9c6158d881.html',
  'google773bba77c1d3311c.html'
];

// 24 Premium Profiles with verified images from PBN database
const ORIGINAL_VITRIN = [
  { name: 'Melissa', img: 'istanbul-kaporasiz-escort-melissa-1.webp', race: 'Türk', cat: 'Elite VIP Partner', phone: '12495448982' },
  { name: 'Aynur', img: 'istanbul-kaporasiz-escort-aynur-1.webp', race: 'Türk', cat: 'VIP Sarışın Model', phone: '12495448982' },
  { name: 'Svetlana', img: 'istanbul-kaporasiz-escort-svetlana-1.webp', race: 'Rus', cat: 'Elit Rus Model', phone: '12495448982' },
  { name: 'Ceren', img: 'istanbul-kaporasiz-escort-ceren-1.webp', race: 'Türk', cat: 'VIP Elit Model', phone: '12495448982' },
  { name: 'Ayla', img: 'istanbul-kaporasiz-escort-ayla-1.webp', race: 'Türk', cat: 'Premium Esmer Lady', phone: '12495448982' },
  { name: 'Esila', img: 'istanbul-kaporasiz-escort-esila-1.webp', race: 'Boşnak', cat: 'Ateşli Sarışın Partner', phone: '12495448982' },
  { name: 'Berfin', img: 'vip-profil-1.webp', race: 'Türk', cat: 'Elit Üniversiteli', phone: '12495448982' },
  { name: 'Dilan', img: 'vip-profil-6.webp', race: 'Türk', cat: 'Premium Esmer Güzeli', phone: '12495448982' },
  { name: 'Jînda', img: 'vip-profil-11.webp', race: 'Türk', cat: 'Kızıl Fantezi Uzmanı', phone: '12495448982' },
  { name: 'Narin', img: 'vip-profil-16.webp', race: 'Türk', cat: 'Zarif Çıtır Partner', phone: '12495448982' },
  { name: 'Rojîn', img: 'vip-profil-21.webp', race: 'Türk', cat: 'VIP Lady Partner', phone: '12495448982' },
  { name: 'Zilan', img: 'vip-profil-26.webp', race: 'Türk', cat: 'Lüks Sarışın Model', phone: '12495448982' },
  { name: 'Asya', img: 'vip-profil-31.webp', race: 'Türk', cat: 'Sınırsız Randevu Partneri', phone: '12495448982' },
  { name: 'Buse', img: 'vip-profil-36.webp', race: 'Türk', cat: 'VIP Üniversiteli Çıtır', phone: '12495448982' },
  { name: 'Cansel', img: 'vip-profil-41.webp', race: 'Türk', cat: 'Gizemli Fantezi Model', phone: '12495448982' },
  { name: 'Damla', img: 'vip-profil-46.webp', race: 'Türk', cat: 'Lüks Rezidans Partneri', phone: '12495448982' },
  { name: 'Elif', img: 'vip-profil-51.webp', race: 'Türk', cat: 'VIP Sarışın Bomba', phone: '12495448982' },
  { name: 'Figen', img: 'vip-profil-56.webp', race: 'Türk', cat: 'Olgun Lady Uzmanı', phone: '12495448982' },
  { name: 'Gizem', img: 'vip-profil-61.webp', race: 'Türk', cat: 'Zarif Çıtır Model', phone: '12495448982' },
  { name: 'Hande', img: 'vip-profil-66.webp', race: 'Türk', cat: 'Ateşli Kızıl Lady', phone: '12495448982' },
  { name: 'Işıl', img: 'vip-profil-71.webp', race: 'Türk', cat: 'Lüks Rezidans Modeli', phone: '12495448982' },
  { name: 'Kübra', img: 'vip-profil-76.webp', race: 'Türk', cat: 'VIP Partner Seçeneği', phone: '12495448982' },
  { name: 'Leyla', img: 'vip-profil-81.webp', race: 'Türk', cat: 'Gizemli Esmer Model', phone: '12495448982' },
  { name: 'Merve', img: 'vip-profil-86.webp', race: 'Türk', cat: 'Elite VIP Model', phone: '12495448982' }
];

const EDITORIAL_DESCRIPTIONS = [
  'Melissa, lüks yaşamı ve elit refakat hizmetlerini benimsemiş seçkin bir partnerdir. Kendisiyle geçireceğiniz her dakika unutulmaz anlara dönüşecektir.',
  'Aynur, zarif duruşu ve yüksek iletişim becerileriyle ön plana çıkan seçkin bir modeldir. Özel davetlerinizde ve iş toplantılarınızda yanınızda olmaktan keyif alır.',
  'Svetlana, Rusya\'nın zarafetini ve kusursuz fiziki hatlarını İstanbul\'a taşımış profesyonel bir modeldir. Sınır tanımayan fantezi dünyasıyla hayallerinizi gerçeğe dönüştürür.',
  'Ceren, samimi tavırları ve doğal güzelliğiyle kalbinizi fethedecek bireysel bir partnerdir. Kendi evinin konforunda veya seçkin otellerde hizmet vermektedir.',
  'Ayla, esmer teni ve atletik vücuduyla dikkat çeken son derece çekici bir modeldir. Sıcak ve samimi refakat hizmeti sunmaktadır.',
  'Esila, sarı saçları ve büyüleyici gözleriyle size rüya gibi bir gece yaşatacak Boşnak asıllı bir partnerdir. Hizmette sınır tanımaz.',
  'Berfin, enerjik yapısı ve cana yakın tavırlarıyla bilinen genç ve çıtır bir partnerdir. Sohbetiyle de gecenize renk katacaktır.',
  'Dilan, elit zevklere sahip beyler için özenle seçilmiş lüks bir partnerdir. Rezidansında veya otelinizde teyitli hizmet sunar.',
  'Jînda, kızıl saçlarının büyüsü ve tutkulu karakteriyle sizi baştan çıkaracak tecrübeli bir modeldir. Gizlilik prensibine son derece sadıktır.',
  'Narin, minyon fiziği ve zarif hatlarıyla narin bir çiçek gibi parlayan bireysel bir refakatçidir. Tatlı sohbetiyle içinizi ısıtır.',
  'Rojîn, kendinden emin duruşu ve kusursuz diksiyonuyla seçkin beylerin en çok tercih ettiği elit VIP partnerlerdendir.',
  'Zilan, sarışın güzelliği ve kusursuz fiziğiyle her buluşmada heyecanı zirveye taşıyan profesyonel bir partnerdir.',
  'Asya, güler yüzlü hizmeti ve sınırsız randevu konseptleriyle unutulmaz bir eskort deneyimi yaşatmak için sizi bekliyor.',
  'Buse, üniversite eğitimine devam eden, son derece kültürlü ve hoş sohbet bir partnerdir. Özel günlerinize eşlik etmekten keyif alır.',
  'Cansel, fantezi dünyası geniş ve açık fikirli beyler için harika bir partner seçeneğidir. Randevuda zamanında adreste olur.',
  'Damla, rezidans konforunda veya lüks otellerde görüşmeyi kabul eden, son derece titiz ve güvenilir bir refakatçidir.',
  'Elif, göz alıcı fiziği ve pozitif enerjisiyle günün tüm yorgunluğunu unutturacak samimi bir VIP partnerdir.',
  'Figen, olgun kadın cazibesini ve tecrübesini sonuna kadar hissettirecek seçkin bir partnerdir. Konuşması ve tavırlarıyla sizi büyüleyecek.',
  'Gizem, çıtır fiziği ve cana yakın tavırlarıyla her buluşmada yüksek memnuniyet sağlayan bağımsız bir modeldir.',
  'Hande, kızıl saçları ve çekici hatlarıyla sizi fantezi dolu bir dünyaya davet eden son derece aktif bir partnerdir.',
  'Işıl, pürüzsüz teni ve büyüleyici gülüşüyle her anınızı özel kılacak lüks rezidans partneriniz olmaya adaydır.',
  'Kübra, eskort rehberimizin en beğenilen üyelerinden olup, tam gizlilik ve maksimum güvenilirlik garantisiyle hizmet verir.',
  'Leyla, gizemli bakışları ve esmer teninin sıcaklığıyla unutamayacağınız bir refakat deneyimi sunmak için sabırsızlanıyor.',
  'Merve, elit duruşu ve profesyonel hizmet anlayışıyla her randevuda fark yaratan kusursuz bir VIP modeldir.'
];

const ADULT_NICHES = [
  "Outdoor", "Office", "Gym", "Hotel", "Massage", "Spa", "Beach", "Public", "Party", "Club", "Luxury", "Elite", "VIP",
  "Lüks", "Gizli", "Kaçamak", "Otel", "Rezidans", "Evlere Servis", "Otele Servis", "Kaporasız", "Güvenilir"
];

const ADULT_PROFILE_ADJECTIVES = [
  "Ateşli", "Sıcak", "Nefes Kesen", "Baştan Çıkarıcı", "Vahşi", "Doyumsuz", "Kışkırtıcı", "Egzotik",
  "Tanrıça", "Afet", "Bomba", "Pırlanta", "Elite", "VIP"
];

const ADULT_QUALITIES = [
  "4K Ultra HD", "1080p Full HD", "Sansürsüz", "Gerçek Görsel", "Videolu Onay", "Canlı Teyit", "Kaporasız"
];

const V1_P1_TEMPLATES = [
  "{sehir} {ilce} civarında kapora vermeden, güvenilir İstanbul escort arayanlar için en yeni ilanları tek sayfada topladık. Buradaki kızlar {sehir} genelinde {hizmet} veren bireysel partnerlerdir.",
  "{ilce} {ilan} arıyorsanız, doğrudan görüşebileceğiniz teyitli kızların profillerini inceleyin. Ön ödemesiz buluşmalar için en iyi seçenekler listelenmiştir.",
  "{sehir} {ilce} escort bayan ilanlarında sahteciliğe yer yok. %100 {quality} görseller ve kaporasız buluşma imkanıyla en aktif profiller burada.",
  "Güvenli ve temiz bir refakat için {sehir} {ilce} escort ilanlarımıza göz atın. Tamamı adreste elden ödeme alan bağımsız kızlardan oluşmaktadır.",
  "{sehir} {ilce} eskort listesinde yer alan popüler ve {adj} kızlarla doğrudan iletişim kurun. Herhangi bir ön ödeme riski yoktur."
];

const V1_P2_TEMPLATES = [
  "Buluşmalar {niche} konseptinde ve tamamen kaporasızdır. Görsellerin altındaki linklerden kızlara doğrudan ulaşabilirsiniz. İstanbul escort hizmeti için 7/24 teyit alabilirsiniz.",
  "Önceliğimiz güvenlik ve sorunsuz randevudur. Bu yüzden {sehir} {ilce} eskort listesindeki tüm profiller kapıda elden nakit ödeme kabul eder.",
  "Paranızı riske atmadan, kapora veya depozito ödemeden {sehir} {ilce} escort modelleriyle görüşün. Kızlar rezidans ya da otel adreslerine servis sağlamaktadır.",
  "Rehberimizdeki bağımsız kızlar {sehir} genelinde popüler {niche} buluşmalar yapar ve gizliliğinizi korur. İletişim için profillere tıklamanız yeterlidir.",
  "Gizliliğe önem veren {ilce} escort bayan ilanları, kapora tuzağı olmadan elden ödemeyle çalışır. Kızlarla hızlı randevu için butonları kullanın."
];

const V2_P1_TEMPLATES = [
  "{sehir} {ilce} {ilan} seçenekleriyle günün yorgunluğunu geride bırakın. Kaporasız ve elden ödemeli İstanbul escort profilleri listelenmiştir.",
  "{sehir} {ilce} bölgesinde kaporasız partner bulmak artık çok kolay. Tamamı doğrulanmış görsellerle en aktif kızlar vitrinde yer alıyor.",
  "{sehir} {ilce} escort ilanlarında en popüler and {adj} modelleri sizin için seçtik. Sıfır risk ve tam gizlilik esasıyla randevunuzu alın.",
  "Sıradan ilanlardan sıkılanlar için {sehir} {ilce} eskort vitrinini güncelledik. Bağımsız partnerlerin güncel ilanları aşağıdadır.",
  "Kendi yerinde veya otelde görüşebileceğiniz {sehir} {ilce} escort kızları, gerçek resimleriyle sizleri bekliyor. Hemen kataloğu inceleyin."
];

const V2_P2_TEMPLATES = [
  "Buluşmalarda güvenlik ve gizlilik kuralları geçerlidir. Semtteki bağımsız VIP kızlar {niche} randevular kabul eder ve kapora istemez. Görüşme için profil linklerini takip edin.",
  "Kopya ilanlardan uzak durarak {sehir} {ilce} eskort profillerine güvenle ulaşabilirsiniz. Buluşmada nakit ödeme yapılır.",
  "Kaldığınız otel veya kendi rezidansınızda görüşmek için kaporasız çalışan {sehir} {ilce} escort bayan ilanlarını tercih edin. Parasal kayıp riski yoktur.",
  "Ön ödemesiz çalışan kızlar {sehir} genelinde en çok tercih edilen {niche} hizmetleri sunar. İletişim numaraları ve detaylar profillerde mevcuttur.",
  "Güvenli buluşma için kapora istemeyen {ilce} escort bayan ilanlarını seçin. Ödemeyi adreste elden nakit olarak yapabilirsiniz."
];

const V3_P1_TEMPLATES = [
  "{sehir} {ilce} bölgesindeki en aktif bağımsız {secenek} listesi güncellendi. Güvenilir ve gizli İstanbul escort profillerini aşağıda bulabilirsiniz.",
  "{sehir} {ilce} lokasyonunda {adj} ve tutkulu partner arayanlar için en iyi ilanlar vitrinde. Kızlarla doğrudan WhatsApp üzerinden görüşün.",
  "Gizlilik prensibiyle çalışan {sehir} {ilce} eskort ilanları arasından seçiminizi yapın. Gerçek resimlerle sorunsuz randevu alın.",
  "{sehir} {ilce} çevresinde hızlı servis veren bağımsız partnerlerin iletişim bilgilerine bu sayfadan ulaşabilirsiniz.",
  "{sehir} {ilce} escort arayışınızda tecrübeli ve kaporasız {secenek} alternatifleri burada listelenmiştir."
];

const V3_P2_TEMPLATES = [
  "Tüm ilanlarımız teyitli ve gerçek resimlidir. Size en yakın {sehir} {ilce} escort profilini seçip kaporasız elden ödemeyle hemen randevunuzu ayarlayın.",
  "Sistemdeki tüm kızlar doğrulanmıştır. Herhangi bir ön ödeme yapmadan, adreste elden ödeme güvencesiyle görüşebilirsiniz.",
  "Buluşmalarda sürpriz ücretler veya kapora talepleri yoktur. {sehir} {ilce} eskort kızlarıyla doğrudan iletişim kurabilirsiniz.",
  "Güvenilir ve keyifli bir görüşme için yukarıdaki ilanları kullanın. Memnuniyet odaklı çalışan bağımsız modeller aktif hizmet veriyor.",
  "Kapora ödeme riski olmadan, tamamen elden ödemeyle çalışan {sehir} {ilce} escort partnerleriyle randevunuzu hızlıca oluşturun."
];

const V4_P1_TEMPLATES = [
  "{sehir} {ilce} bölgesinde güncel {secenek} ilanları bir araya getirildi. Kaporasız ve elden ödemeli çalışan İstanbul escort partnerleriyle hemen görüşün.",
  "Teyitli resimler ve güncel ilanlarla {sehir} {ilce} eskort listesini hazırladık. Kızlara doğrudan ulaşmak için profillerdeki linkleri kullanın.",
  "{sehir} {ilce} bölgesinde kaporasız escort bulmak artık çok kolay. Doğrulanmış profiller arasından dilediğinizi seçip hemen iletişime geçin.",
  "{sehir} {ilce} escort modelleriyle günün stresini atın. Tamamı kaporasız ve adrese servis veren bağımsız kızlar listelenmiştir.",
  "{sehir} {ilce} {ilan} listemizden tecrübeli ve güvenilir bağımsız partnerleri inceleyerek randevunuzu teyit edin."
];

const V4_P2_TEMPLATES = [
  "Sitemizde sadece kaporasız ve doğrulanmış {sehir} {ilce} eskort profilleri yer alır. Randevuda ödemenizi adreste elden nakit olarak yapabilirsiniz.",
  "Ön koşul veya rezervasyon ücreti ödemeden doğrudan buluşabileceğiniz {sehir} {ilce} escort modelleriyle görüşmek için linkleri takip edin.",
  "Sahte resimli ilanlardan uzak durun. Bu sayfada sadece gerçek resimli ve kaporasız çalışan İstanbul escort kızları listelenmektedir.",
  "Görüşmelerde gizlilik esastır. Kapora dolandırıcılarına bulaşmadan, adreste nakit ödemeyle çalışan teyitli kızlarla görüşün.",
  "Maddi kayıp yaşamadan, güvenilir ve kaporasız {sehir} {ilce} eskort ilanlarımızla randevunuzu sıfır riskle ayarlayın."
];

const V5_P1_TEMPLATES = [
  "İstanbul {sehir} {ilce} escort ilanları arayan beyler için kaporasız çalışan güncel kızları listeledik. Tamamı doğrulanmış ve gerçek fotoğraflı {sehir} {ilce} eskort modelleri arasından dilediğiniz profille hemen iletişime geçebilirsiniz. Sahte profillerle vakit kaybetmeden doğrudan adrese servis veren bağımsız kızları tercih edin.",
  "{sehir} {ilce} {ilan} seçenekleriyle kaporasız ve güvenli partner bulmak çok kolay. Bu listede yer alan bağımsız çalışan {ilce} escort kızları, ön ödeme talep etmeden tamamen karşılıklı güven esasıyla randevu kabul etmektedir."
];

const V5_P2_TEMPLATES = [
  "Bölgedeki rezidanslarda ve lüks otellerde görüşebileceğiniz kızlar, hem fizikleri hem de güler yüzlü hizmetleriyle dikkat çekiyor. {sehir} {ilce} escort ilanlarımızda zamanında adreste olan ve gizliliğe önem veren profesyoneller yer alır.",
  "Sorunsuz bir görüşme ve kaporasız randevu için {sehir} {ilce} eskort kızlarımızı tercih edin. Otelinize veya kendi rezidansınıza teyitli servis imkanı bulunmaktadır."
];

const V5_P3_TEMPLATES = [
  "Kapora dolandırıcılarından uzak durarak {sehir} {ilce} escort ilanlarındaki doğrulanmış kızlarla görüşün. Buluşma anında elden nakit ödeme sayesinde maddi kayıp riski yaşamadan randevunuzu gerçekleştirebilirsiniz.",
  "Ön ödeme istemeyen ve adreste ödeme alan {sehir} {ilce} eskort kızlarıyla güvenli şekilde görüşün. Rezervasyon için profil kartlarındaki yönlendirme bağlantılarını kullanın."
];

const V5_P4_TEMPLATES = [
  "Ulaşım yönünden {sehir} {ilce} bölgesi oldukça rahattır. Metro, metrobüs ve ana yollara yakın rezidanslarda veya otellerde kalıyorsanız, partneriniz randevu saatinde gecikme olmadan adresinizde olur.",
  "İster saatlik ister gecelik randevular için olsun, {sehir} {ilce} eskort kızları en kısa sürede belirttiğiniz adrese ulaşarak keyifli anlarınızı başlatacaktır."
];

const V5_P5_TEMPLATES = [
  "Görüşme esnasında gizliliğiniz tamamen korunur. Üçüncü şahıslarla hiçbir bilgi paylaşılmaz. Sıkıntısız ve güvenli bir eskort deneyimi için en doğru ilanları sizler için derledik.",
  "Karşılıklı saygı ve gizlilik çerçevesinde gerçekleşen buluşmalarda, partnerinizle keyifli vakit geçirebilirsiniz. {ilan} alternatifleri içinden en uygun profili seçin."
];

const V5_P6_TEMPLATES = [
  "Sonuç olarak, {sehir} {ilce} escort ilanlarında kaporasız ve gerçek resimli kızları sizlerle buluşturuyoruz. Hemen yukarıdaki bağlantıları tıklayarak kızlarla WhatsApp üzerinden sohbet etmeye başlayın.",
  "Sıradan reklam sitelerindeki sahte resimlerden bıktıysanız, {sehir} {ilce} eskort listemizdeki kaporasız ve doğrulanmış modellerle hemen randevunuzu oluşturun."
];

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

function parseSpin(text: string, sehir: string, ilce: string, context: { race: string, category: string, niche: string, adj: string, quality: string }): string {
  return text
    .replace(/{sehir}/g, sehir)
    .replace(/{ilce}/g, ilce)
    .replace(/{race}/g, context.race)
    .replace(/{category}/g, context.category)
    .replace(/{niche}/g, context.niche)
    .replace(/{adj}/g, context.adj)
    .replace(/{quality}/g, context.quality)
    .replace(/{secenek}/g, () => getRandomElement(['escort bayan', 'VIP refakatçi', 'bireysel partner']))
    .replace(/{hizmet}/g, () => getRandomElement(['VIP escort hizmeti', 'doğrulanmış eskort rehberi', 'bireysel refakat']))
    .replace(/{ilan}/g, () => getRandomElement(['kaporasız escort ilanları', 'bireysel escort bayan vitrini', 'VIP eskort seçenekleri']))
    .replace(/{luks}/g, () => getRandomElement(['lüks', 'elit', 'ayrıcalıklı', 'gerçek fotoğraflı']))
    .replace(/{([^{}]+)}/g, (_, choices) => {
      const arr = choices.split('|');
      return getRandomElement(arr);
    });
}

export function generateGoogleSitesHTML(sehir: string, ilce: string, pathCounter: number, version: number, title: string, verificationCode: string): string {
  const currentYear = new Date().getFullYear();
  const niche = getRandomElement(ADULT_NICHES);
  const adj = getRandomElement(ADULT_PROFILE_ADJECTIVES);
  const quality = getRandomElement(ADULT_QUALITIES);
  const context = { race: 'Turkish', category: 'VIP', niche, adj, quality };
  
  let lead = '';
  let body = '';
  if (version === 1) {
    lead = parseSpin(getRandomElement(V1_P1_TEMPLATES), sehir, ilce, context);
    body = parseSpin(getRandomElement(V1_P2_TEMPLATES), sehir, ilce, context);
  } else if (version === 2) {
    lead = parseSpin(getRandomElement(V2_P1_TEMPLATES), sehir, ilce, context);
    body = parseSpin(getRandomElement(V2_P2_TEMPLATES), sehir, ilce, context);
  } else if (version === 3) {
    lead = parseSpin(getRandomElement(V3_P1_TEMPLATES), sehir, ilce, context);
    body = parseSpin(getRandomElement(V3_P2_TEMPLATES), sehir, ilce, context);
  } else if (version === 4) {
    lead = parseSpin(getRandomElement(V4_P1_TEMPLATES), sehir, ilce, context);
    body = parseSpin(getRandomElement(V4_P2_TEMPLATES), sehir, ilce, context);
  } else {
    lead = parseSpin(getRandomElement(V5_P1_TEMPLATES), sehir, ilce, context);
    const p2 = parseSpin(getRandomElement(V5_P2_TEMPLATES), sehir, ilce, context);
    const p3 = parseSpin(getRandomElement(V5_P3_TEMPLATES), sehir, ilce, context);
    const p4 = parseSpin(getRandomElement(V5_P4_TEMPLATES), sehir, ilce, context);
    const p5 = parseSpin(getRandomElement(V5_P5_TEMPLATES), sehir, ilce, context);
    const p6 = parseSpin(getRandomElement(V5_P6_TEMPLATES), sehir, ilce, context);
    body = `${p2} <br><br> ${p3} <br><br> ${p4} <br><br> ${p5} <br><br> ${p6}`;
  }

  // Generate ~100 targeted keys
  const firstPrefixes = ["", "istanbul ", "vip ", "elit ", "kaporasız ", "bireysel ", "bağımsız "];
  const midKeywords = [`${ilce} escort`, `${ilce} eskort`, `${ilce} escort bayan`, `${ilce} eskort bayan`];
  const lastSuffixes = ["", " ilanları", " fiyatları", " numaraları", " yorumları", " buluşma"];
  
  const goldKeywords: string[] = [];
  for (const prefix of firstPrefixes) {
    for (const mid of midKeywords) {
      for (const suffix of lastSuffixes) {
        goldKeywords.push(`${prefix}${mid}${suffix}`);
      }
    }
  }

  const uniqueKeywords = Array.from(new Set(goldKeywords)).slice(0, 100);
  const keywordsHtml = uniqueKeywords.map((k, idx) => {
    // Distribute soft opacities (0.35 to 0.9) to make them look like a natural stylized tag cloud
    const opacity = (0.35 + (idx % 6) * 0.1).toFixed(2);
    return `      <a href="https://${PRIMARY_HOST}/istanbul/${slugify(ilce)}" class="tag-link" style="opacity: ${opacity}; font-size: 11px; margin: 4px; display: inline-block;">${k}</a>`;
  }).join('\n');
  const hiddenKeywordsHtml = ``; // Banned stealth wrapper eliminated

  const subdomain = PRIMARY_HOST.replace(/\./g, '-');
  const ampCacheUrl = `https://${subdomain}.cdn.ampproject.org/c/s/${PRIMARY_HOST}/amp?loc=${slugify(ilce)}`;

  // FAQ section targeting user concerns (icons, other profiles search, safety, verification)
  const faqHtml = `
    <div class="faq-item">
      <div class="faq-q">📍 S: Diğer escort profillerini ve ilan vitrinini nerede bulabilirim?</div>
      <div class="faq-a">C: Diğer tüm doğrulanmış bağımsız eskort profillerine ve vitrin görsellerine ulaşmak için sayfanın altındaki "Tüm ${ilce} Görüşmelerini Listele" butonuna tıklayarak doğrudan <a href="https://${PRIMARY_HOST}/istanbul/${slugify(ilce)}" style="color:var(--accent); font-weight:bold;">${PRIMARY_HOST}</a> ana dizinine erişebilirsiniz.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">💬 S: Profil kartlarındaki simgeler ve ikonlar ne anlama geliyor?</div>
      <div class="faq-a">C: Profil kartlarının üst köşelerinde yer alan onay rozetleri ve yıldız ikonları, modellerin canlı video teyidinden geçerek sistemde %100 doğrulanmış, kaporasız ve güvenilir VIP eskort üyesi olduğunu simgeler.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">🛡️ S: ${ilce} escort arayanlar güvenli buluşmaya nasıl ulaşır?</div>
      <div class="faq-a">C: Güvenli eskort buluşması için en kritik kural kapora veya rezervasyon bedeli adı altında hiçbir ön ödeme yapmamaktır. Listemizde yer alan tüm ${ilce} escort bayan üyeleri ödemeyi buluşma anında adreste elden nakit olarak kabul eder.</div>
    </div>
  `;

  // Name arrays for absolute randomization
  const ERKEK_ISIMLERI = ["Azad", "Baran", "Civan", "Dijwar", "Şervan", "Zinar"];
  const KIZ_ISIMLERI = ["Berfin", "Dilan", "Jînda", "Narin", "Rojîn", "Zilan"];
  const SOYADLAR = ["Gewad", "Reşo", "Zaza", "Botan", "Kaya", "Demir", "Çelik"];

  const managerName = getRandomElement(ERKEK_ISIMLERI);
  const managerSurname = getRandomElement(SOYADLAR);
  const publisherGirl = getRandomElement(KIZ_ISIMLERI);

  const authorBranding = `${publisherGirl} Hanım`;
  const seoTitleVariations = [
    `${authorBranding} ${ilce} Escort İlanları ${currentYear} - %100 Kaporasız`,
    `${ilce} Premium Escort İlanları ${currentYear} - Elden Ödeme VIP`,
    `Kaporasız ${ilce} Escort İlanları ${currentYear} - ${managerName} ${managerSurname} Güvencesiyle`,
    `Bireysel ${ilce} Eskort Bayan İlanları ${currentYear} - Teyitli Vitrin`
  ];
  
  const selectedTitle = seoTitleVariations[version % seoTitleVariations.length];
  const dynamicAuthor = version % 2 === 0 ? `${managerName} ${managerSurname}` : authorBranding;

  // JSON-LD Schema
  const schema = `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "${ampCacheUrl}#webpage",
      "url": "${ampCacheUrl}",
      "name": "${selectedTitle}",
      "description": "${lead.replace(/"/g, '&quot;').slice(0, 155)}"
    },
    {
      "@type": "FAQPage",
      "@id": "${ampCacheUrl}#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Diğer escort profillerini ve ilan vitrinini nerede bulabilirim?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Diğer tüm doğrulanmış bağımsız eskort profillerine ve vitrin görsellerine ulaşmak için sayfanın altındaki buton ile doğrudan dorukcanay.digital ana dizinine erişebilirsiniz."
          }
        },
        {
          "@type": "Question",
          "name": "Profil kartlarındaki simgeler ve ikonlar ne anlama geliyor?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Profil kartlarındaki rozet ve onay simgeleri modellerin doğrulanmış, kaporasız ve VIP üye olduğunu gösterir."
          }
        },
        {
          "@type": "Question",
          "name": "${ilce} escort arayanlar güvenli buluşmaya nasıl ulaşır?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kesinlikle kapora veya ön ödeme göndermeyerek, sadece buluşma anında elden ödeme yöntemiyle güvenli buluşma gerçekleştirebilirsiniz."
          }
        }
      ]
    },
    {
      "@type": "LocalBusiness",
      "name": "${ilce} VIP Escort Ajansı",
      "image": "https://${PRIMARY_HOST}/_media/vitrin/istanbul-kaporasiz-escort-melissa-1.webp",
      "telephone": "+12495448982",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "${ilce} Caddesi No 34",
        "addressLocality": "${ilce}",
        "addressRegion": "İstanbul",
        "postalCode": "34000",
        "addressCountry": "TR"
      }
    }
  ]
}
</script>`;

  let slidesHtml = '';

  if (version === 1) {
    // ----------------------------------------------------
    // VERSION 1: Continuous Smooth Left Marquee
    // ----------------------------------------------------
    for (let i = 0; i < ORIGINAL_VITRIN.length; i++) {
      const profile = ORIGINAL_VITRIN[i];
      const imageUrl = `https://${PRIMARY_HOST}/_media/vitrin/${profile.img}`;
      const profileUrl = `https://${PRIMARY_HOST}/go/${slugify(profile.name)}`;
      const mQual = getRandomElement(ADULT_QUALITIES);
      const mNiche = getRandomElement(ADULT_NICHES);
      const priorityAttr = i === 0 ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';

      slidesHtml += `
      <div class="v1-slide">
        <div class="v1-card">
          <div class="v1-img-container">
            <img src="${imageUrl}" alt="${profile.name} - ${ilce} Escort" width="260" height="338" ${priorityAttr}>
            <span class="v1-badge">${mQual}</span>
          </div>
          <div class="v1-content">
            <h4 class="v1-title">${profile.name}</h4>
            <div class="v1-meta">${profile.race} Model | ${ilce}</div>
            <div class="v1-tags">
              <span class="v1-tag">${profile.cat}</span>
              <span class="v1-tag">${mNiche}</span>
            </div>
            <a href="${profileUrl}" target="_blank" rel="noopener" class="v1-btn">Profili Gör</a>
          </div>
        </div>
      </div>`;
    }

    return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="google-site-verification" content="${verificationCode.replace('.html', '')}" />
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg-primary: #040407;
    --bg-secondary: rgba(13, 13, 21, 0.75);
    --accent: #ff2a5f;
    --accent-hover: #e01b4c;
    --text-main: #ffffff;
    --text-muted: #a0aec0;
    --border: rgba(255, 42, 95, 0.2);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background-color: var(--bg-primary);
    color: var(--text-main);
    font-family: 'Outfit', sans-serif;
    line-height: 1.6;
    padding: 16px;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    background: var(--bg-secondary);
    border-radius: 24px;
    border: 1px solid var(--border);
    padding: 30px 20px;
    box-shadow: 0 16px 50px rgba(255, 42, 95, 0.1);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid var(--border); padding-bottom: 25px; }
  h1 {
    font-size: 2.1rem;
    font-weight: 700;
    line-height: 1.25;
    background: linear-gradient(135deg, #ffffff 30%, var(--accent) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 15px;
  }
  .lead { font-size: 1rem; color: var(--text-muted); max-width: 800px; margin: 0 auto; }
  .lead strong, .lead b { color: var(--accent); }

  /* V1 AUTO MARQUEE LEFT */
  .v1-marquee {
    overflow: hidden;
    width: 100%;
    margin: 30px 0;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 20px 0;
  }
  .v1-track {
    display: flex;
    gap: 16px;
    width: max-content;
    animation: marqueeLeftAnimation 45s linear infinite;
  }
  .v1-track:hover { animation-play-state: paused; }
  .v1-slide { width: 260px; flex-shrink: 0; }
  
  @keyframes marqueeLeftAnimation {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-260px * ${ORIGINAL_VITRIN.length} - 16px * ${ORIGINAL_VITRIN.length})); }
  }

  .v1-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .v1-img-container { position: relative; width: 260px; height: 338px; background: #000; }
  .v1-img-container img { width: 100%; height: 100%; object-fit: cover; }
  .v1-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: var(--accent);
    color: #fff;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 600;
  }
  .v1-content { padding: 16px; }
  .v1-title { font-size: 1.15rem; color: #fff; margin-bottom: 4px; }
  .v1-meta { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px; }
  .v1-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
  .v1-tag { background: var(--bg-primary); color: var(--accent); border: 1px solid var(--border); padding: 2px 8px; border-radius: 6px; font-size: 0.7rem; }
  .v1-btn {
    display: block; width: 100%; text-align: center; background: var(--accent); color: #fff;
    padding: 10px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.85rem;
  }

  .info-box { background: var(--bg-primary); border-left: 4px solid var(--accent); padding: 20px; border-radius: 0 16px 16px 0; margin: 30px 0; }
  .info-box h3 { color: #fff; margin-bottom: 6px; }
  .info-box p { font-size: 0.95rem; color: var(--text-muted); }
  .keyword-section { margin-top: 30px; padding-top: 25px; border-top: 1px solid var(--border); }
  .keyword-title { font-size: 1.1rem; color: var(--accent); margin-bottom: 12px; }
  .keywords { display: flex; flex-wrap: wrap; gap: 6px; }
  .keyword-tag { background: var(--bg-primary); border: 1px solid var(--border); color: var(--text-muted); padding: 4px 10px; border-radius: 20px; font-size: 0.76rem; }
  .faq-section { margin-top: 30px; }
  .faq-title { font-size: 1.35rem; font-weight: 600; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 16px; }
  .faq-item { margin-bottom: 16px; }
  .faq-q { font-weight: 600; color: #fff; }
  .faq-a { color: var(--text-muted); }
  .footer-cta { text-align: center; margin-top: 35px; }
  .footer-btn {
    display: inline-block; background: linear-gradient(135deg, var(--accent) 0%, #ff5a7f 100%);
    color: #fff; padding: 12px 28px; border-radius: 30px; text-decoration: none; font-weight: 600;
  }
  .brand-signature {
    text-align: center; margin-top: 30px; font-size: 0.8rem; color: var(--text-muted); opacity: 0.6;
    border-top: 1px dashed var(--border); padding-top: 15px; font-weight: 600; letter-spacing: 1.5px;
  }
</style>
</head>
<body>
<iframe id="innerFrame" name="innerFrame" 
  sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads allow-storage-access-by-user-activation" 
  frameborder="0" 
  allowfullscreen="" 
  src="https://${PRIMARY_HOST}/istanbul/${slugify(ilce)}"
  style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none; z-index: 999999; overflow: auto;">
</iframe>
<div class="container">
  <header>
    <h1>${selectedTitle}</h1>
    <p class="lead">${lead}</p>
    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:10px;">Yazar / Editör: <strong>${dynamicAuthor}</strong></div>
  </header>
  
  <div class="v1-marquee">
    <div class="v1-track">
      ${slidesHtml}
      ${slidesHtml}
    </div>
  </div>

  <div class="info-box">
    <h3>🍀 Kaporasız Randevu & %100 Güvenlik Garantisi</h3>
    <p>${body}</p>
  </div>

  <div class="faq-section">
    <h3 class="faq-title">💬 Sıkça Sorulan Sorular</h3>
    ${faqHtml}
  </div>

  <div class="keyword-section">
    <h4 class="keyword-title">📍 İlgili Arama Başlıkları:</h4>
    <div class="keywords">
      ${keywordsHtml}
    </div>
  </div>

  ${hiddenKeywordsHtml}

  <div class="footer-cta">
    <a href="https://${PRIMARY_HOST}/istanbul/${slugify(ilce)}" class="footer-btn">🍀 Tüm ${ilce} Escort Kataloğunu Gör</a>
  </div>

  <div class="brand-signature">⚡ EŞREF TEK ⚡</div>
</div>
${schema}
</body>
</html>`;

  } else if (version === 2) {
    // ----------------------------------------------------
    // VERSION 2: Continuous Smooth Right Marquee
    // ----------------------------------------------------
    for (let i = 0; i < ORIGINAL_VITRIN.length; i++) {
      const profile = ORIGINAL_VITRIN[i];
      const imageUrl = `https://${PRIMARY_HOST}/_media/vitrin/${profile.img}`;
      const profileUrl = `https://${PRIMARY_HOST}/go/${slugify(profile.name)}`;
      const mQual = getRandomElement(ADULT_QUALITIES);
      const mNiche = getRandomElement(ADULT_NICHES);
      const priorityAttr = i === 0 ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';

      slidesHtml += `
      <div class="v2-slide">
        <div class="v2-card">
          <div class="v2-img-wrapper">
            <img src="${imageUrl}" alt="${profile.name} - ${ilce} Escort" width="280" height="364" ${priorityAttr}>
            <div class="v2-badge"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" style="display:inline-block; vertical-align:middle; margin-right:3px;"><polyline points="20 6 9 17 4 12"></polyline></svg>${mQual}</div>
          </div>
          <div class="v2-body">
            <h3 class="v2-card-title">${profile.name} <svg viewBox="0 0 24 24" width="14" height="14" fill="#00f0ff" style="display:inline-block; vertical-align:middle; margin-left:4px;"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> <span class="v2-online-dot"></span></h3>
            <p class="v2-cat-meta">${profile.race} Refakatçi | ${ilce}</p>
            <div class="v2-tag-cloud">
              <span class="v2-subtag">${profile.cat}</span>
              <span class="v2-subtag">${mNiche}</span>
            </div>
            <a href="${profileUrl}" target="_blank" rel="noopener" class="v2-cta-link">Detayları İncele</a>
          </div>
        </div>
      </div>`;
    }

    return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="google-site-verification" content="${verificationCode.replace('.html', '')}" />
<title>${selectedTitle}</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --purple-main: #060416;
    --purple-light: rgba(27, 22, 62, 0.75);
    --neon-pink: #00f0ff;
    --text-color: #e0e7ff;
    --border-color: rgba(0, 240, 255, 0.25);
    --text-muted: #888899;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--purple-main);
    color: var(--text-color);
    font-family: 'Outfit', sans-serif;
    padding: 16px;
  }
  .wrapper {
    max-width: 1200px;
    margin: 0 auto;
    background: var(--purple-light);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 30px 20px;
    box-shadow: 0 16px 50px rgba(0, 240, 255, 0.1);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .heading-block { text-align: center; margin-bottom: 35px; }
  .heading-block h1 { font-size: 2.2rem; font-weight: 700; color: #fff; margin-bottom: 12px; }
  .heading-block p { color: #a5b4fc; font-size: 0.95rem; line-height: 1.6; }
  .heading-block p b, .heading-block p strong { color: var(--neon-pink); }
  .brand-signature {
    text-align: center; margin-top: 30px; font-size: 0.8rem; color: var(--text-muted); opacity: 0.6;
    border-top: 1px dashed var(--border-color); padding-top: 15px; font-weight: 600; letter-spacing: 1.5px;
  }
  
  /* V2 AUTO MARQUEE RIGHT */
  .v2-marquee-container {
    overflow: hidden;
    width: 100%;
    margin-bottom: 30px;
    background: var(--purple-main);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 20px 0;
  }
  .v2-slider-track {
    display: flex;
    gap: 16px;
    width: max-content;
    animation: marqueeRightAnimation 45s linear infinite;
  }
  .v2-slider-track:hover { animation-play-state: paused; }
  .v2-slide { flex: 0 0 280px; }
  
  @keyframes marqueeRightAnimation {
    0% { transform: translateX(calc(-280px * ${ORIGINAL_VITRIN.length} - 16px * ${ORIGINAL_VITRIN.length})); }
    100% { transform: translateX(0); }
  }
  
  .v2-card {
    background: var(--purple-light);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .v2-img-wrapper { position: relative; width: 100%; aspect-ratio: 3/4; overflow: hidden; background: #000; }
  .v2-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
  .v2-badge {
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: var(--neon-pink);
    color: #000;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 4px;
    text-transform: uppercase;
  }
  .v2-body { padding: 16px; display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1; }
  .v2-card-title { font-size: 1.2rem; color: #fff; display: flex; align-items: center; justify-content: space-between; }
  .v2-online-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; }
  .v2-cat-meta { font-size: 0.82rem; color: #a5b4fc; margin-bottom: 12px; }
  .v2-tag-cloud { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
  .v2-subtag { background: var(--purple-main); border: 1px solid var(--border-color); color: #fff; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; }
  .v2-cta-link {
    display: block; width: 100%; text-align: center; background: linear-gradient(90deg, var(--neon-pink) 0%, #f7630c 100%);
    color: #fff; padding: 12px; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 0.88rem;
  }
  
  .v2-info { background: rgba(39, 34, 84, 0.4); border: 1px solid var(--border-color); padding: 20px; border-radius: 12px; margin: 30px 0; }
  .v2-info h3 { margin-bottom: 6px; font-size: 1.1rem; color: #fff; }
  .v2-info p { font-size: 0.9rem; color: #a5b4fc; }
  .v2-keywords-box { margin-top: 30px; border-top: 1px solid var(--border-color); padding-top: 20px; }
  .v2-keywords-title { font-size: 1rem; color: var(--neon-pink); margin-bottom: 12px; font-weight: 600; }
  .v2-tags-container { display: flex; flex-wrap: wrap; gap: 6px; }
  .v2-tag-item { background: var(--purple-main); border: 1px solid var(--border-color); color: #a5b4fc; padding: 4px 8px; border-radius: 6px; font-size: 0.76rem; text-decoration: none; transition: border-color 0.2s, color 0.2s; }
  .v2-tag-item:hover { border-color: var(--neon-pink); color: #fff; }
  
  .faq-block { margin-top: 30px; }
  .faq-head { font-size: 1.3rem; border-bottom: 1px solid var(--border-color); padding-bottom: 6px; margin-bottom: 15px; color: #fff; }
  .faq-row { margin-bottom: 15px; }
  .faq-q { font-size: 0.92rem; font-weight: 600; color: #fff; margin-bottom: 3px; }
  .faq-a { font-size: 0.88rem; color: #a5b4fc; }
  .v2-footer { text-align: center; margin-top: 35px; }
  .v2-footer-btn {
    display: inline-block; background: #fff; color: var(--purple-main); padding: 12px 30px;
    border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 0.92rem;
  }
</style>
</head>
<body>
<iframe id="innerFrame" name="innerFrame" 
  sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads allow-storage-access-by-user-activation" 
  frameborder="0" 
  allowfullscreen="" 
  src="https://${PRIMARY_HOST}/istanbul/${slugify(ilce)}"
  style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none; z-index: 999999; overflow: auto;">
</iframe>
<div class="wrapper">
  <div class="heading-block">
    <h1>${selectedTitle}</h1>
    <p>${lead}</p>
    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:10px;">Yazar / Editör: <strong>${dynamicAuthor}</strong></div>
  </div>
  
  <div class="v2-marquee-container">
    <div class="v2-slider-track">
      ${slidesHtml}
      ${slidesHtml}
    </div>
  </div>

  <div class="v2-info">
    <h3>🌿 Kaporasız Randevu & VIP Standartlar</h3>
    <p>${body}</p>
  </div>

  <div class="faq-block">
    <h3 class="faq-head">💬 Sıkça Sorulan Sorular</h3>
    ${faqHtml}
  </div>

  <div class="v2-keywords-box">
    <h4 class="v2-keywords-title">📍 İlgili Arama Başlıkları:</h4>
    <div class="v2-tags-container">
      ${keywordsHtml.replace(/class="tag-link"/g, 'class="v2-tag-item"')}
    </div>
  </div>

  ${hiddenKeywordsHtml}

  <div class="v2-footer">
    <a href="https://${PRIMARY_HOST}/istanbul/${slugify(ilce)}" class="v2-footer-btn">🟢 Tüm ${ilce} Kataloğunu Gör</a>
  </div>

  <div class="brand-signature">⚡ EŞREF TEK ⚡</div>
</div>
${schema}
</body>
</html>`;

  } else if (version === 3) {
    // ----------------------------------------------------
    // VERSION 3: Continuous Vertical Auto-Scroll Marquee
    // ----------------------------------------------------
    for (let i = 0; i < ORIGINAL_VITRIN.length; i++) {
      const profile = ORIGINAL_VITRIN[i];
      const imageUrl = `https://${PRIMARY_HOST}/_media/vitrin/${profile.img}`;
      const profileUrl = `https://${PRIMARY_HOST}/go/${slugify(profile.name)}`;
      const mQual = getRandomElement(ADULT_QUALITIES);
      const mNiche = getRandomElement(ADULT_NICHES);
      const priorityAttr = i === 0 ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';

      slidesHtml += `
      <div class="v3-slide">
        <div class="v3-card">
          <img src="${imageUrl}" alt="${profile.name} - ${ilce} Escort" class="v3-img" width="150" height="195" ${priorityAttr}>
          <div class="v3-details">
            <div>
              <h4 class="v3-name">${profile.name} <svg viewBox="0 0 24 24" width="14" height="14" fill="#d4af37" style="display:inline-block; vertical-align:middle; margin-left:4px;"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> <span class="v3-gold-badge"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" style="display:inline-block; vertical-align:middle; margin-right:3px;"><polyline points="20 6 9 17 4 12"></polyline></svg>${mQual}</span></h4>
              <p class="v3-sub">${profile.race} Refakatçi | ${mNiche}</p>
              <p class="v3-cat">${profile.cat}</p>
            </div>
            <a href="${profileUrl}" target="_blank" rel="noopener" class="v3-btn-gold">İletişime Geç</a>
          </div>
        </div>
      </div>`;
    }

    return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="google-site-verification" content="${verificationCode.replace('.html', '')}" />
<title>${selectedTitle}</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --gold: #d4af37;
    --gold-dark: #b89327;
    --dark-bg: #09090b;
    --card-bg: #151518;
    --text-grey: #a1a1aa;
    --border: #27272a;
    --text-muted: #888899;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--dark-bg);
    color: #fff;
    font-family: 'Outfit', sans-serif;
    padding: 16px;
  }
  .box {
    max-width: 1000px;
    margin: 0 auto;
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 30px 20px;
  }
  h1 { font-size: 1.8rem; text-align: center; color: var(--gold); margin-bottom: 15px; }
  .lead-desc { text-align: center; color: var(--text-grey); font-size: 0.95rem; margin-bottom: 30px; }
  .lead-desc b, .lead-desc strong { color: #fff; }

  /* V3 VERTICAL AUTO-MARQUEE */
  .v3-marquee-vertical {
    height: 520px;
    overflow: hidden;
    position: relative;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--dark-bg);
    padding: 16px 12px;
    margin-bottom: 25px;
  }
  .v3-slider-track {
    display: flex;
    flex-direction: column;
    gap: 16px;
    animation: verticalMarquee 45s linear infinite;
  }
  .v3-slider-track:hover { animation-play-state: paused; }
  .v3-slide { width: 100%; }
  
  @keyframes verticalMarquee {
    0% { transform: translateY(0); }
    100% { transform: translateY(calc(-227px * ${ORIGINAL_VITRIN.length})); }
  }
  
  .v3-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    gap: 20px;
    align-items: center;
    height: 211px;
  }
  .v3-img { width: 130px; height: 177px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
  .v3-details { display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1; height: 177px; }
  .v3-name { font-size: 1.3rem; color: #fff; display: flex; align-items: center; gap: 8px; }
  .v3-gold-badge { background: var(--gold); color: #000; font-size: 0.65rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
  .v3-sub { font-size: 0.9rem; color: var(--text-grey); }
  .v3-cat { font-size: 0.85rem; color: var(--gold); margin-top: 4px; }
  .v3-btn-gold {
    align-self: flex-start; background: transparent; border: 1px solid var(--gold); color: var(--gold);
    padding: 8px 20px; border-radius: 6px; text-decoration: none; font-size: 0.88rem; font-weight: 600;
    transition: background 0.2s;
  }
  .v3-btn-gold:hover { background: var(--gold); color: #000; }

  .v3-box-p { padding: 15px; background: var(--dark-bg); border-left: 3px solid var(--gold); border-radius: 4px; margin: 25px 0; }
  .v3-box-p h4 { color: #fff; margin-bottom: 4px; }
  .v3-box-p p { font-size: 0.88rem; color: var(--text-grey); }

  .kw-title { font-size: 1rem; color: var(--gold); margin-bottom: 12px; }
  .kw-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .kw-tag-item { background: var(--dark-bg); border: 1px solid var(--border); color: var(--text-grey); padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; text-decoration: none; transition: border-color 0.2s, color 0.2s; }
  .kw-tag-item:hover { border-color: var(--gold); color: #fff; }

  .faq-wrap { margin-top: 30px; border-top: 1px solid var(--border); padding-top: 20px; }
  .faq-wrap-title { font-size: 1.2rem; color: #fff; margin-bottom: 15px; }
  .faq-box { margin-bottom: 12px; }
  .faq-box-q { font-size: 0.9rem; font-weight: 600; color: var(--gold); }
  .faq-box-a { font-size: 0.85rem; color: var(--text-grey); }

  .footer-btn-gold {
    display: block; width: 100%; text-align: center; background: var(--gold); color: #000;
    padding: 12px; border-radius: 8px; text-decoration: none; font-weight: 700; margin-top: 30px;
  }
  .brand-signature {
    text-align: center; margin-top: 30px; font-size: 0.8rem; color: var(--text-muted); opacity: 0.6;
    border-top: 1px dashed var(--border); padding-top: 15px; font-weight: 600; letter-spacing: 1.5px;
  }
</style>
</head>
<body>
<iframe id="innerFrame" name="innerFrame" 
  sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads allow-storage-access-by-user-activation" 
  frameborder="0" 
  allowfullscreen="" 
  src="https://${PRIMARY_HOST}/istanbul/${slugify(ilce)}"
  style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none; z-index: 999999; overflow: auto;">
</iframe>
<div class="box">
  <h1>${selectedTitle}</h1>
  <p class="lead-desc">${lead}</p>
  <div style="font-size:0.8rem; color:var(--text-muted); text-align:center; margin-top:-15px; margin-bottom:25px;">Yazar / Editör: <strong>${dynamicAuthor}</strong></div>
  
  <div class="v3-marquee-vertical">
    <div class="v3-slider-track">
      ${slidesHtml}
      ${slidesHtml}
    </div>
  </div>

  <div class="v3-box-p">
    <h4>✅ %100 Doğrulanmış Profil Garantisi</h4>
    <p>${body}</p>
  </div>

  <div class="faq-wrap">
    <h3 class="faq-wrap-title">💬 Merak Edilenler</h3>
    ${faqHtml.replace(/class="faq-item"/g, 'class="faq-box"').replace(/class="faq-q"/g, 'class="faq-box-q"').replace(/class="faq-a"/g, 'class="faq-box-a"')}
  </div>

  <div style="margin-top: 30px;">
    <h4 class="kw-title">📍 İlgili Arama Başlıkları:</h4>
    <div class="kw-tags">
      ${keywordsHtml.replace(/class="tag-link"/g, 'class="kw-tag-item"')}
    </div>
  </div>

  ${hiddenKeywordsHtml}

  <a href="https://${PRIMARY_HOST}/istanbul/${slugify(ilce)}" class="footer-btn-gold">🍀 Tüm ${ilce} Kataloğunu Keşfet</a>

  <div class="brand-signature">⚡ EŞREF TEK ⚡</div>
</div>
${schema}
</body>
</html>`;

  } else if (version === 4) {
    // ----------------------------------------------------
    // VERSION 4: Double-Row Left & Right Marquees
    // ----------------------------------------------------
    let row1Slides = '';
    let row2Slides = '';
    for (let i = 0; i < ORIGINAL_VITRIN.length; i++) {
      const profile = ORIGINAL_VITRIN[i];
      const imageUrl = `https://${PRIMARY_HOST}/_media/vitrin/${profile.img}`;
      const profileUrl = `https://${PRIMARY_HOST}/go/${slugify(profile.name)}`;
      const mQual = getRandomElement(ADULT_QUALITIES);
      const mNiche = getRandomElement(ADULT_NICHES);
      const priorityAttr = i === 0 ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';

      const slideHtml = `
      <div class="v4-slide">
        <div class="v4-inner">
          <div class="v4-img-box">
            <img src="${imageUrl}" alt="${profile.name} - ${ilce} Escort" width="260" height="338" ${priorityAttr}>
            <span class="v4-badge"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" style="display:inline-block; vertical-align:middle; margin-right:3px;"><polyline points="20 6 9 17 4 12"></polyline></svg>${mQual}</span>
          </div>
          <div class="v4-content">
            <h4 class="v4-card-title">${profile.name} <svg viewBox="0 0 24 24" width="14" height="14" fill="#00bcd4" style="display:inline-block; vertical-align:middle; margin-left:4px;"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></h4>
            <div class="v4-meta">${profile.race} VIP | ${mNiche}</div>
            <a href="${profileUrl}" target="_blank" rel="noopener" class="v4-btn">Hemen Ulaş</a>
          </div>
        </div>
      </div>`;

      if (i < 12) {
        row1Slides += slideHtml;
      } else {
        row2Slides += slideHtml;
      }
    }

    return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="google-site-verification" content="${verificationCode.replace('.html', '')}" />
<title>${selectedTitle}</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg-dark: #000000;
    --bg-box: #0a0a0c;
    --neon-blue: #00bcd4;
    --border-color: #16161c;
    --text-muted: #888899;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--bg-dark);
    color: #fff;
    font-family: 'Outfit', sans-serif;
    padding: 16px;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    background: var(--bg-box);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 30px 20px;
  }
  header { text-align: center; margin-bottom: 25px; }
  h1 { font-size: 2rem; font-weight: 700; color: #fff; margin-bottom: 12px; }
  .lead-p { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; }
  .lead-p b, .lead-p strong { color: var(--neon-blue); }
  .brand-signature {
    text-align: center; margin-top: 30px; font-size: 0.8rem; color: var(--text-muted); opacity: 0.6;
    border-top: 1px dashed var(--border-color); padding-top: 15px; font-weight: 600; letter-spacing: 1.5px;
  }

  /* V4 DOUBLE ROW MARQUEE */
  .v4-wrapper {
    overflow: hidden;
    width: 100%;
    margin: 30px 0;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    background: var(--bg-dark);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .v4-marquee-row {
    overflow: hidden;
    width: 100%;
  }
  .v4-slider-track-left {
    display: flex;
    gap: 16px;
    width: max-content;
    animation: marqueeLeftAnimationV4 25s linear infinite;
  }
  .v4-slider-track-right {
    display: flex;
    gap: 16px;
    width: max-content;
    animation: marqueeRightAnimationV4 25s linear infinite;
  }
  .v4-slider-track-left:hover, .v4-slider-track-right:hover {
    animation-play-state: paused;
  }
  .v4-slide { width: 260px; flex-shrink: 0; }
  
  @keyframes marqueeLeftAnimationV4 {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-260px * 12 - 16px * 12)); }
  }
  @keyframes marqueeRightAnimationV4 {
    0% { transform: translateX(calc(-260px * 12 - 16px * 12)); }
    100% { transform: translateX(0); }
  }

  .v4-inner {
    background: var(--bg-box);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
  }
  .v4-img-box { position: relative; width: 260px; height: 338px; }
  .v4-img-box img { width: 100%; height: 100%; object-fit: cover; }
  .v4-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: var(--neon-blue);
    color: #000;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px;
  }
  .v4-content { padding: 12px; }
  .v4-card-title { font-size: 1.1rem; color: #fff; margin-bottom: 3px; }
  .v4-meta { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px; }
  .v4-btn {
    display: block; width: 100%; text-align: center; background: var(--neon-blue); color: #000;
    padding: 8px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 0.85rem;
  }

  .v4-info-box { background: var(--bg-dark); border-left: 4px solid var(--neon-blue); padding: 16px; margin: 25px 0; border-radius: 0 8px 8px 0; }
  .v4-info-box h3 { font-size: 1rem; margin-bottom: 4px; }
  .v4-info-box p { font-size: 0.88rem; color: var(--text-muted); }

  .tags-box { margin-top: 25px; border-top: 1px solid var(--border-color); padding-top: 20px; }
  .tags-box h4 { font-size: 0.95rem; color: var(--neon-blue); margin-bottom: 10px; }
  .tags-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag-link { background: var(--bg-dark); border: 1px solid var(--border-color); color: var(--text-muted); padding: 4px 8px; border-radius: 4px; font-size: 0.76rem; text-decoration: none; transition: border-color 0.2s, color 0.2s; }
  .tag-link:hover { border-color: var(--neon-blue); color: #fff; }

  .faq-wrap { margin-top: 25px; }
  .faq-title { font-size: 1.25rem; border-bottom: 1px solid var(--border-color); padding-bottom: 6px; margin-bottom: 15px; }
  .faq-item { margin-bottom: 12px; }
  .faq-q { font-weight: 600; color: #fff; }
  .faq-a { color: var(--text-muted); }

  .footer-cta-btn {
    display: block; width: 100%; text-align: center; border: 1px solid var(--neon-blue); color: var(--neon-blue);
    padding: 12px; border-radius: 8px; text-decoration: none; font-weight: 700; margin-top: 30px;
  }
</style>
</head>
<body>
<iframe id="innerFrame" name="innerFrame" 
  sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads allow-storage-access-by-user-activation" 
  frameborder="0" 
  allowfullscreen="" 
  src="https://${PRIMARY_HOST}/istanbul/${slugify(ilce)}"
  style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none; z-index: 999999; overflow: auto;">
</iframe>
<div class="container">
  <header>
    <h1>${selectedTitle}</h1>
    <p class="lead-p">${lead}</p>
    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:10px;">Yazar / Editör: <strong>${dynamicAuthor}</strong></div>
  </header>

  <div class="v4-wrapper">
    <div class="v4-marquee-row v4-row-left">
      <div class="v4-slider-track-left">
        ${row1Slides}
        ${row1Slides}
      </div>
    </div>
    <div class="v4-marquee-row v4-row-right">
      <div class="v4-slider-track-right">
        ${row2Slides}
        ${row2Slides}
      </div>
    </div>
  </div>

  <div class="v4-info-box">
    <h3>🟢 Güvenli ve Kaporasız Elit Görüşmeler</h3>
    <p>${body}</p>
  </div>

  <div class="faq-wrap">
    <h3 class="faq-title">💬 Sıkça Sorulan Sorular</h3>
    ${faqHtml}
  </div>

  <div class="tags-box">
    <h4>📍 İlgili Arama Başlıkları:</h4>
    <div class="tags-list">
      ${keywordsHtml}
    </div>
  </div>

  ${hiddenKeywordsHtml}

  <a href="https://${PRIMARY_HOST}/istanbul/${slugify(ilce)}" class="footer-cta-btn">🟢 Tüm ${ilce} Görüşmelerini Listele</a>

  <div class="brand-signature">⚡ EŞREF TEK ⚡</div>
</div>
${schema}
</body>
</html>`;
  } else {
    // ----------------------------------------------------
    // VERSION 5: Premium Blog/Editorial layout (500+ words)
    // ----------------------------------------------------
    let profilesHtml = '';
    for (let i = 0; i < ORIGINAL_VITRIN.length; i++) {
      if (i === 5) {
        profilesHtml += `
        <div class="v5-profile-card" style="border-color: #fbbf24;">
          <div class="v5-img-container">
            <a href="https://${PRIMARY_HOST}/go/reklam-ver" target="_blank" rel="noopener">
              <img src="https://${PRIMARY_HOST}/vitrin/reklam-ver-banner.png" alt="Reklam Vermek İçin Tıklayınız!" width="260" height="338" loading="lazy" decoding="async">
            </a>
          </div>
          <div class="v5-profile-info">
            <h4 class="v5-profile-name" style="color: #fbbf24;">Reklam Vermek İçin Tıklayınız! <svg viewBox="0 0 24 24" width="14" height="14" fill="#fbbf24" style="display:inline-block; vertical-align:middle; margin-left:4px;"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></h4>
            <p class="v5-profile-cat" style="color: #fbbf24;">Premium Sponsor Reklam</p>
            <p class="v5-profile-desc">Web sitelerimizde ve sitemizin vitrin bölümlerinde kendi ilanınızı yayınlamak için hemen bizimle iletişime geçin.</p>
            <div class="v5-profile-tags">
              <span class="v5-tag">Reklam</span>
              <span class="v5-tag">Sponsor</span>
            </div>
            <a href="https://${PRIMARY_HOST}/go/reklam-ver" target="_blank" rel="noopener" class="v5-profile-btn" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color:#000;">Reklam Ver</a>
          </div>
        </div>`;
      }

      const profile = ORIGINAL_VITRIN[i];
      const imageUrl = `https://${PRIMARY_HOST}/_media/vitrin/${profile.img}`;
      const profileUrl = `https://${PRIMARY_HOST}/go/${slugify(profile.name)}`;
      const mQual = getRandomElement(ADULT_QUALITIES);
      const mNiche = getRandomElement(ADULT_NICHES);
      const priorityAttr = i === 0 ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';

      profilesHtml += `
      <div class="v5-profile-card">
        <div class="v5-img-container">
          <img src="${imageUrl}" alt="${profile.name} - ${ilce} Escort" width="260" height="338" ${priorityAttr}>
          <span class="v5-badge"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" style="display:inline-block; vertical-align:middle; margin-right:3px;"><polyline points="20 6 9 17 4 12"></polyline></svg>${mQual}</span>
        </div>
        <div class="v5-profile-info">
          <h4 class="v5-profile-name">${profile.name} <svg viewBox="0 0 24 24" width="14" height="14" fill="#10b981" style="display:inline-block; vertical-align:middle; margin-left:4px;"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> <span class="v5-online-dot"></span></h4>
          <p class="v5-profile-cat">${profile.race} Model | ${profile.cat}</p>
          <p class="v5-profile-desc">${EDITORIAL_DESCRIPTIONS[i]}</p>
          <div class="v5-profile-tags">
            <span class="v5-tag">${mNiche}</span>
            <span class="v5-tag">Kaporasız</span>
          </div>
          <a href="${profileUrl}" target="_blank" rel="noopener" class="v5-profile-btn">İletişime Geç</a>
        </div>
      </div>`;
    }

    return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="google-site-verification" content="${verificationCode.replace('.html', '')}" />
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg-dark: #060608;
    --bg-box: #0f0f15;
    --accent: #10b981;
    --accent-hover: #059669;
    --border-color: #1e1e2f;
    --text-muted: #94a3b8;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--bg-dark);
    color: #fff;
    font-family: 'Outfit', sans-serif;
    padding: 16px;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    background: var(--bg-box);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    padding: 40px 24px;
    box-shadow: 0 16px 50px rgba(0,0,0,0.8);
  }
  header { text-align: center; margin-bottom: 35px; border-bottom: 1px solid var(--border-color); padding-bottom: 30px; }
  h1 { font-size: 2.2rem; font-weight: 700; color: #fff; margin-bottom: 15px; background: linear-gradient(135deg, #fff 40%, var(--accent) 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
  .lead-p { font-size: 1.05rem; color: var(--text-muted); line-height: 1.7; max-width: 850px; margin: 0 auto; }
  .lead-p b, .lead-p strong { color: var(--accent); }

  /* V5 EDITORIAL GRID */
  .v5-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin: 35px 0;
  }
  .v5-profile-card {
    background: var(--bg-dark);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s, border-color 0.3s;
  }
  .v5-profile-card:hover { transform: translateY(-4px); border-color: var(--accent); }
  .v5-img-container { position: relative; width: 100%; aspect-ratio: 3/4; background: #000; }
  .v5-img-container img { width: 100%; height: 100%; object-fit: cover; }
  .v5-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: var(--accent);
    color: #000;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 6px;
  }
  .v5-profile-info { padding: 20px; display: flex; flex-direction: column; flex-grow: 1; }
  .v5-profile-name { font-size: 1.25rem; color: #fff; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between; }
  .v5-online-dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; display: inline-block; }
  .v5-profile-cat { font-size: 0.85rem; color: var(--accent); margin-bottom: 12px; }
  .v5-profile-desc { font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px; flex-grow: 1; }
  .v5-profile-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
  .v5-tag { background: var(--bg-box); border: 1px solid var(--border-color); color: #fff; font-size: 0.72rem; padding: 2px 8px; border-radius: 6px; }
  .v5-profile-btn {
    display: block; width: 100%; text-align: center; background: linear-gradient(135deg, var(--accent) 0%, #34d399 100%); color: #000;
    padding: 10px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.88rem; transition: opacity 0.2s;
  }
  .v5-profile-btn:hover { opacity: 0.9; }

  .v5-editorial-content {
    background: var(--bg-dark);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 30px;
    margin: 35px 0;
    font-size: 1rem;
    line-height: 1.8;
    color: #e2e8f0;
  }
  .v5-editorial-content h3 { font-size: 1.35rem; color: #fff; margin-bottom: 15px; border-left: 4px solid var(--accent); padding-left: 12px; }
  
  .tags-box { margin-top: 30px; border-top: 1px solid var(--border-color); padding-top: 20px; }
  .tags-box h4 { font-size: 1rem; color: var(--accent); margin-bottom: 12px; }
  .tags-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag-link { background: var(--bg-dark); border: 1px solid var(--border-color); color: var(--text-muted); padding: 4px 10px; border-radius: 20px; font-size: 0.76rem; text-decoration: none; transition: border-color 0.2s, color 0.2s; }
  .tag-link:hover { border-color: var(--accent); color: #fff; }

  .faq-wrap { margin-top: 30px; }
  .faq-title { font-size: 1.4rem; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; margin-bottom: 20px; color: #fff; }
  .faq-item { margin-bottom: 16px; }
  .faq-q { font-weight: 600; color: #fff; margin-bottom: 4px; }
  .faq-a { color: var(--text-muted); }

  .footer-cta-btn {
    display: block; width: 100%; text-align: center; background: transparent; border: 1px solid var(--accent); color: var(--accent);
    padding: 14px; border-radius: 12px; text-decoration: none; font-weight: 700; margin-top: 35px; transition: background 0.3s, color 0.3s;
  }
  .footer-cta-btn:hover { background: var(--accent); color: #000; }
</style>
</head>
<body>
<iframe id="innerFrame" name="innerFrame" 
  sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads allow-storage-access-by-user-activation" 
  frameborder="0" 
  allowfullscreen="" 
  src="https://${PRIMARY_HOST}/istanbul/${slugify(ilce)}"
  style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none; z-index: 999999; overflow: auto;">
</iframe>
<div class="container">
  <header>
    <h1>${selectedTitle}</h1>
    <p class="lead-p">${lead}</p>
    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:10px;">Yazar / Editör: <strong>${dynamicAuthor}</strong></div>
  </header>

  <div class="v5-grid">
    ${profilesHtml}
  </div>

  <div class="v5-editorial-content">
    <h3>🍀 VIP Refakat ve Seçkin Hizmet Detayları</h3>
    <p>${body}</p>
  </div>

  <div class="faq-wrap">
    <h3 class="faq-title">💬 Sıkça Sorulan Sorular</h3>
    ${faqHtml}
  </div>

  <div class="tags-box">
    <h4>📍 İlgili Arama Başlıkları:</h4>
    <div class="tags-list">
      ${keywordsHtml}
    </div>
  </div>

  ${hiddenKeywordsHtml}

  <a href="https://${PRIMARY_HOST}/istanbul/${slugify(ilce)}" class="footer-cta-btn">🟢 Tüm ${ilce} Görüşmelerini Listele</a>

  <div class="brand-signature" style="text-align:center; margin-top:30px; font-size:0.8rem; color:var(--text-muted); opacity:0.6; border-top:1px dashed var(--border-color); padding-top:15px; font-weight:600; letter-spacing:1.5px;">⚡ EŞREF TEK ⚡</div>
</div>
${schema}
</body>
</html>`;
  }
}

export async function buildGoogleSitesPayloads() {
  console.log(`🔨 Generating Google Sites HTML Payloads at: ${OUTPUT_DIR}`);
  
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const v1Dir = path.join(OUTPUT_DIR, 'version-1');
  const v2Dir = path.join(OUTPUT_DIR, 'version-2');
  const v3Dir = path.join(OUTPUT_DIR, 'version-3');
  const v4Dir = path.join(OUTPUT_DIR, 'version-4');
  const v5Dir = path.join(OUTPUT_DIR, 'version-5');

  fs.mkdirSync(v1Dir, { recursive: true });
  fs.mkdirSync(v2Dir, { recursive: true });
  fs.mkdirSync(v3Dir, { recursive: true });
  fs.mkdirSync(v4Dir, { recursive: true });
  fs.mkdirSync(v5Dir, { recursive: true });

  let pathCounter = 0;
  const processedDistricts = new Set<string>();

  let notepadContent = `========================================================================\n`;
  notepadContent += `🟢 GOOGLE SITES SYSTEM DIRECTORY & METADATA MAP (dorukcanay.digital Edition)\n`;
  notepadContent += `Generated: ${new Date().toISOString()}\n`;
  notepadContent += `Total Locations: 348\n`;
  notepadContent += `========================================================================\n\n`;

  for (const district of istanbulCity.districts) {
    const cleanDistrictName = district.name.replace(/\s+escort/gi, '').trim();
    const districtSlug = slugify(cleanDistrictName);

    if (processedDistricts.has(districtSlug)) continue;
    processedDistricts.add(districtSlug);

    const districtFileName = `istanbul-${districtSlug}-escort.html`;
    const districtTitle = `${cleanDistrictName} Escort | ${cleanDistrictName} Eskort Bayan İlanları`;
    const targetAmpCache = `https://${PRIMARY_HOST}/istanbul/${districtSlug}`;

    // Select a dynamic verification code to rotate footprints
    const vCode = GSC_VERIFICATIONS[pathCounter % GSC_VERIFICATIONS.length];

    // Write to HTML payload versions
    const html1 = generateGoogleSitesHTML("İstanbul", cleanDistrictName, pathCounter, 1, districtTitle, vCode);
    const html2 = generateGoogleSitesHTML("İstanbul", cleanDistrictName, pathCounter, 2, districtTitle, vCode);
    const html3 = generateGoogleSitesHTML("İstanbul", cleanDistrictName, pathCounter, 3, districtTitle, vCode);
    const html4 = generateGoogleSitesHTML("İstanbul", cleanDistrictName, pathCounter, 4, districtTitle, vCode);
    const html5 = generateGoogleSitesHTML("İstanbul", cleanDistrictName, pathCounter, 5, districtTitle, vCode);

    fs.writeFileSync(path.join(v1Dir, districtFileName), html1);
    fs.writeFileSync(path.join(v2Dir, districtFileName), html2);
    fs.writeFileSync(path.join(v3Dir, districtFileName), html3);
    fs.writeFileSync(path.join(v4Dir, districtFileName), html4);
    fs.writeFileSync(path.join(v5Dir, districtFileName), html5);

    // Extract dynamic lead description
    const leadMatch = html1.match(/<p class="lead-p">([\s\S]*?)<\/p>/) || html1.match(/<p class="lead">([\s\S]*?)<\/p>/) || html1.match(/<p>([\s\S]*?)<\/p>/);
    const descText = leadMatch ? leadMatch[1].replace(/<[^>]*>/g, '').trim() : `${cleanDistrictName} bölgesinde kaporasız ve %100 gerçek escort bayan ilanları.`;

    // Append district metadata to notepad content
    notepadContent += `------------------------------------------------------------------------\n`;
    notepadContent += `📍 LOCATION: ${cleanDistrictName} (District)\n`;
    notepadContent += `📂 GOOGLE SITES PAGE SLUG/URL: istanbul-${districtSlug}-escort\n`;
    notepadContent += `👑 PAGE TITLE (Başlık): ${districtTitle}\n`;
    notepadContent += `🚀 TARGET REDIRECT (Canonical): ${targetAmpCache}\n`;
    notepadContent += `🛡️ VERIFICATION ID (GSC): ${vCode}\n`;
    notepadContent += `📝 DESCRIPTION: ${descText.replace(/\s+/g, ' ').slice(0, 155)}\n`;
    notepadContent += `🔑 KEYWORDS: ${cleanDistrictName} escort, ${cleanDistrictName} eskort, istanbul ${cleanDistrictName} escort, kaporasız ${cleanDistrictName} escort, escort, eskort\n`;
    notepadContent += `------------------------------------------------------------------------\n\n`;

    pathCounter++;

    const processedNeighborhoods = new Set<string>();
    for (const neighborhood of district.neighborhoods) {
      const neighborhoodSlug = slugify(neighborhood.name);

      if (processedNeighborhoods.has(neighborhoodSlug)) continue;
      processedNeighborhoods.add(neighborhoodSlug);

      const neighborhoodFileName = `istanbul-${districtSlug}-${neighborhoodSlug}-escort.html`;
      const searchTarget = `${cleanDistrictName} ${neighborhood.name}`;
      const neighborhoodTitle = `${searchTarget} Escort - ${searchTarget} Eskort İlanları`;
      const targetAmpCacheN = `https://${PRIMARY_HOST}/istanbul/${districtSlug}-${neighborhoodSlug}`;
      const nVCode = GSC_VERIFICATIONS[pathCounter % GSC_VERIFICATIONS.length];

      // Write to HTML payload versions
      const nHtml1 = generateGoogleSitesHTML("İstanbul", searchTarget, pathCounter, 1, neighborhoodTitle, nVCode);
      const nHtml2 = generateGoogleSitesHTML("İstanbul", searchTarget, pathCounter, 2, neighborhoodTitle, nVCode);
      const nHtml3 = generateGoogleSitesHTML("İstanbul", searchTarget, pathCounter, 3, neighborhoodTitle, nVCode);
      const nHtml4 = generateGoogleSitesHTML("İstanbul", searchTarget, pathCounter, 4, neighborhoodTitle, nVCode);
      const nHtml5 = generateGoogleSitesHTML("İstanbul", searchTarget, pathCounter, 5, neighborhoodTitle, nVCode);

      fs.writeFileSync(path.join(v1Dir, neighborhoodFileName), nHtml1);
      fs.writeFileSync(path.join(v2Dir, neighborhoodFileName), nHtml2);
      fs.writeFileSync(path.join(v3Dir, neighborhoodFileName), nHtml3);
      fs.writeFileSync(path.join(v4Dir, neighborhoodFileName), nHtml4);
      fs.writeFileSync(path.join(v5Dir, neighborhoodFileName), nHtml5);

      // Extract dynamic lead description
      const nLeadMatch = nHtml1.match(/<p class="lead-p">([\s\S]*?)<\/p>/) || nHtml1.match(/<p class="lead">([\s\S]*?)<\/p>/) || nHtml1.match(/<p>([\s\S]*?)<\/p>/);
      const nDescText = nLeadMatch ? nLeadMatch[1].replace(/<[^>]*>/g, '').trim() : `${searchTarget} escort arayanlar için kaporasız ve elden ödemeli VIP model ilanları.`;

      // Append neighborhood metadata to notepad content
      notepadContent += `  📍 NEIGHBORHOOD: ${searchTarget}\n`;
      notepadContent += `  📂 GOOGLE SITES PAGE SLUG/URL: istanbul-${districtSlug}-${neighborhoodSlug}-escort\n`;
      notepadContent += `  👑 PAGE TITLE (Başlık): ${neighborhoodTitle}\n`;
      notepadContent += `  🚀 TARGET REDIRECT (Canonical): ${targetAmpCacheN}\n`;
      notepadContent += `  🛡️ VERIFICATION ID (GSC): ${nVCode}\n`;
      notepadContent += `  📝 DESCRIPTION: ${nDescText.replace(/\s+/g, ' ').slice(0, 155)}\n`;
      notepadContent += `  🔑 KEYWORDS: ${searchTarget} escort, ${searchTarget} eskort, ${cleanDistrictName} ${neighborhood.name} escort, escort, eskort\n`;
      notepadContent += `  ----------------------------------------------------------------------\n\n`;

      pathCounter++;
    }
  }

  const notepadPath = path.join(OUTPUT_DIR, 'google-sites-setup-directory.txt');
  fs.writeFileSync(notepadPath, notepadContent);

  console.log(`-- AMP Cache Optimized (Anti-Duplicate v16) --`);
  console.log(`✅ Successfully generated ${pathCounter} locations * 5 versions = ${pathCounter * 5} HTML pages inside version subfolders.`);
  console.log(`📝 Created comprehensive notepad directory at: ${notepadPath}`);
}

if (require.main === module) {
  buildGoogleSitesPayloads().catch(console.error);
}
