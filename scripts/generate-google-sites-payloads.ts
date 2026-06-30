import * as fs from 'fs';
import * as path from 'path';
import { istanbulCity } from '../lib/locations-registry/istanbul';
import { callGemini } from './utils/gemini-client';

/**
 * ğŸ§›â€â™‚ï¸ GOOGLE SITES HTML PAYLOAD FACTORY (v16.0 - Ultimate Opsec & Anti-Duplicate Edition)
 * Generates 5 highly optimized layout variations for each of the 348 locations.
 * 
 * ğŸ›¡ï¸ GOOGLE AMP CACHE BYPASS SPECIFICATION (dorukcanay.digital ONLY):
 * - Primary Host: dorukcanay.digital (Direct serving & direct media)
 * - Google AMP Cache Host (Unblockable by BTK / TIB):
 *   - Catalog links point directly to the AMP Cache of dorukcanay.digital
 * 
 * ğŸ“ NOTEPAD GENERATOR:
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
  { name: 'Melissa', img: 'istanbul-kaporasiz-escort-melissa-1.webp', race: 'TÃ¼rk', cat: 'Elite VIP Partner', phone: '905016355053' },
  { name: 'Aynur', img: 'istanbul-kaporasiz-escort-aynur-1.webp', race: 'TÃ¼rk', cat: 'VIP SarÄ±ÅŸÄ±n Model', phone: '905016355053' },
  { name: 'Svetlana', img: 'istanbul-kaporasiz-escort-svetlana-1.webp', race: 'Rus', cat: 'Elit Rus Model', phone: '905016355053' },
  { name: 'Ceren', img: 'istanbul-kaporasiz-escort-ceren-1.webp', race: 'TÃ¼rk', cat: 'VIP Elit Model', phone: '905016355053' },
  { name: 'Ayla', img: 'istanbul-kaporasiz-escort-ayla-1.webp', race: 'TÃ¼rk', cat: 'Premium Esmer Lady', phone: '905016355053' },
  { name: 'Esila', img: 'istanbul-kaporasiz-escort-esila-1.webp', race: 'BoÅŸnak', cat: 'AteÅŸli SarÄ±ÅŸÄ±n Partner', phone: '905016355053' },
  { name: 'Berfin', img: 'vip-profil-1.webp', race: 'TÃ¼rk', cat: 'Elit Ãœniversiteli', phone: '905016355053' },
  { name: 'Dilan', img: 'vip-profil-6.webp', race: 'TÃ¼rk', cat: 'Premium Esmer GÃ¼zeli', phone: '905016355053' },
  { name: 'JÃ®nda', img: 'vip-profil-11.webp', race: 'TÃ¼rk', cat: 'KÄ±zÄ±l Fantezi UzmanÄ±', phone: '905016355053' },
  { name: 'Narin', img: 'vip-profil-16.webp', race: 'TÃ¼rk', cat: 'Zarif Ã‡Ä±tÄ±r Partner', phone: '905016355053' },
  { name: 'RojÃ®n', img: 'vip-profil-21.webp', race: 'TÃ¼rk', cat: 'VIP Lady Partner', phone: '905016355053' },
  { name: 'Zilan', img: 'vip-profil-26.webp', race: 'TÃ¼rk', cat: 'LÃ¼ks SarÄ±ÅŸÄ±n Model', phone: '905016355053' },
  { name: 'Asya', img: 'vip-profil-31.webp', race: 'TÃ¼rk', cat: 'SÄ±nÄ±rsÄ±z Randevu Partneri', phone: '905016355053' },
  { name: 'Buse', img: 'vip-profil-36.webp', race: 'TÃ¼rk', cat: 'VIP Ãœniversiteli Ã‡Ä±tÄ±r', phone: '905016355053' },
  { name: 'Cansel', img: 'vip-profil-41.webp', race: 'TÃ¼rk', cat: 'Gizemli Fantezi Model', phone: '905016355053' },
  { name: 'Damla', img: 'vip-profil-46.webp', race: 'TÃ¼rk', cat: 'LÃ¼ks Rezidans Partneri', phone: '905016355053' },
  { name: 'Elif', img: 'vip-profil-51.webp', race: 'TÃ¼rk', cat: 'VIP SarÄ±ÅŸÄ±n Bomba', phone: '905016355053' },
  { name: 'Figen', img: 'vip-profil-56.webp', race: 'TÃ¼rk', cat: 'Olgun Lady UzmanÄ±', phone: '905016355053' },
  { name: 'Gizem', img: 'vip-profil-61.webp', race: 'TÃ¼rk', cat: 'Zarif Ã‡Ä±tÄ±r Model', phone: '905016355053' },
  { name: 'Hande', img: 'vip-profil-66.webp', race: 'TÃ¼rk', cat: 'AteÅŸli KÄ±zÄ±l Lady', phone: '905016355053' },
  { name: 'IÅŸÄ±l', img: 'vip-profil-71.webp', race: 'TÃ¼rk', cat: 'LÃ¼ks Rezidans Modeli', phone: '905016355053' },
  { name: 'KÃ¼bra', img: 'vip-profil-76.webp', race: 'TÃ¼rk', cat: 'VIP Partner SeÃ§eneÄŸi', phone: '905016355053' },
  { name: 'Leyla', img: 'vip-profil-81.webp', race: 'TÃ¼rk', cat: 'Gizemli Esmer Model', phone: '905016355053' },
  { name: 'Merve', img: 'vip-profil-86.webp', race: 'TÃ¼rk', cat: 'Elite VIP Model', phone: '905016355053' }
];

const EDITORIAL_DESCRIPTIONS = [
  'Melissa, lÃ¼ks yaÅŸamÄ± ve elit refakat hizmetlerini benimsemiÅŸ seÃ§kin bir partnerdir. Kendisiyle geÃ§ireceÄŸiniz her dakika unutulmaz anlara dÃ¶nÃ¼ÅŸecektir.',
  'Aynur, zarif duruÅŸu ve yÃ¼ksek iletiÅŸim becerileriyle Ã¶n plana Ã§Ä±kan seÃ§kin bir modeldir. Ã–zel davetlerinizde ve iÅŸ toplantÄ±larÄ±nÄ±zda yanÄ±nÄ±zda olmaktan keyif alÄ±r.',
  'Svetlana, Rusya\'nÄ±n zarafetini ve kusursuz fiziki hatlarÄ±nÄ± Ä°stanbul\'a taÅŸÄ±mÄ±ÅŸ profesyonel bir modeldir. SÄ±nÄ±r tanÄ±mayan fantezi dÃ¼nyasÄ±yla hayallerinizi gerÃ§eÄŸe dÃ¶nÃ¼ÅŸtÃ¼rÃ¼r.',
  'Ceren, samimi tavÄ±rlarÄ± ve doÄŸal gÃ¼zelliÄŸiyle kalbinizi fethedecek bireysel bir partnerdir. Kendi evinin konforunda veya seÃ§kin otellerde hizmet vermektedir.',
  'Ayla, esmer teni ve atletik vÃ¼cuduyla dikkat Ã§eken son derece Ã§ekici bir modeldir. SÄ±cak ve samimi refakat hizmeti sunmaktadÄ±r.',
  'Esila, sarÄ± saÃ§larÄ± ve bÃ¼yÃ¼leyici gÃ¶zleriyle size rÃ¼ya gibi bir gece yaÅŸatacak BoÅŸnak asÄ±llÄ± bir partnerdir. Hizmette sÄ±nÄ±r tanÄ±maz.',
  'Berfin, enerjik yapÄ±sÄ± ve cana yakÄ±n tavÄ±rlarÄ±yla bilinen genÃ§ ve Ã§Ä±tÄ±r bir partnerdir. Sohbetiyle de gecenize renk katacaktÄ±r.',
  'Dilan, elit zevklere sahip beyler iÃ§in Ã¶zenle seÃ§ilmiÅŸ lÃ¼ks bir partnerdir. RezidansÄ±nda veya otelinizde teyitli hizmet sunar.',
  'JÃ®nda, kÄ±zÄ±l saÃ§larÄ±nÄ±n bÃ¼yÃ¼sÃ¼ ve tutkulu karakteriyle sizi baÅŸtan Ã§Ä±karacak tecrÃ¼beli bir modeldir. Gizlilik prensibine son derece sadÄ±ktÄ±r.',
  'Narin, minyon fiziÄŸi ve zarif hatlarÄ±yla narin bir Ã§iÃ§ek gibi parlayan bireysel bir refakatÃ§idir. TatlÄ± sohbetiyle iÃ§inizi Ä±sÄ±tÄ±r.',
  'RojÃ®n, kendinden emin duruÅŸu ve kusursuz diksiyonuyla seÃ§kin beylerin en Ã§ok tercih ettiÄŸi elit VIP partnerlerdendir.',
  'Zilan, sarÄ±ÅŸÄ±n gÃ¼zelliÄŸi ve kusursuz fiziÄŸiyle her buluÅŸmada heyecanÄ± zirveye taÅŸÄ±yan profesyonel bir partnerdir.',
  'Asya, gÃ¼ler yÃ¼zlÃ¼ hizmeti ve sÄ±nÄ±rsÄ±z randevu konseptleriyle unutulmaz bir eskort deneyimi yaÅŸatmak iÃ§in sizi bekliyor.',
  'Buse, Ã¼niversite eÄŸitimine devam eden, son derece kÃ¼ltÃ¼rlÃ¼ ve hoÅŸ sohbet bir partnerdir. Ã–zel gÃ¼nlerinize eÅŸlik etmekten keyif alÄ±r.',
  'Cansel, fantezi dÃ¼nyasÄ± geniÅŸ ve aÃ§Ä±k fikirli beyler iÃ§in harika bir partner seÃ§eneÄŸidir. Randevuda zamanÄ±nda adreste olur.',
  'Damla, rezidans konforunda veya lÃ¼ks otellerde gÃ¶rÃ¼ÅŸmeyi kabul eden, son derece titiz ve gÃ¼venilir bir refakatÃ§idir.',
  'Elif, gÃ¶z alÄ±cÄ± fiziÄŸi ve pozitif enerjisiyle gÃ¼nÃ¼n tÃ¼m yorgunluÄŸunu unutturacak samimi bir VIP partnerdir.',
  'Figen, olgun kadÄ±n cazibesini ve tecrÃ¼besini sonuna kadar hissettirecek seÃ§kin bir partnerdir. KonuÅŸmasÄ± ve tavÄ±rlarÄ±yla sizi bÃ¼yÃ¼leyecek.',
  'Gizem, Ã§Ä±tÄ±r fiziÄŸi ve cana yakÄ±n tavÄ±rlarÄ±yla her buluÅŸmada yÃ¼ksek memnuniyet saÄŸlayan baÄŸÄ±msÄ±z bir modeldir.',
  'Hande, kÄ±zÄ±l saÃ§larÄ± ve Ã§ekici hatlarÄ±yla sizi fantezi dolu bir dÃ¼nyaya davet eden son derece aktif bir partnerdir.',
  'IÅŸÄ±l, pÃ¼rÃ¼zsÃ¼z teni ve bÃ¼yÃ¼leyici gÃ¼lÃ¼ÅŸÃ¼yle her anÄ±nÄ±zÄ± Ã¶zel kÄ±lacak lÃ¼ks rezidans partneriniz olmaya adaydÄ±r.',
  'KÃ¼bra, eskort rehberimizin en beÄŸenilen Ã¼yelerinden olup, tam gizlilik ve maksimum gÃ¼venilirlik garantisiyle hizmet verir.',
  'Leyla, gizemli bakÄ±ÅŸlarÄ± ve esmer teninin sÄ±caklÄ±ÄŸÄ±yla unutamayacaÄŸÄ±nÄ±z bir refakat deneyimi sunmak iÃ§in sabÄ±rsÄ±zlanÄ±yor.',
  'Merve, elit duruÅŸu ve profesyonel hizmet anlayÄ±ÅŸÄ±yla her randevuda fark yaratan kusursuz bir VIP modeldir.'
];

const ADULT_NICHES = [
  "Outdoor", "Office", "Gym", "Hotel", "Massage", "Spa", "Beach", "Public", "Party", "Club", "Luxury", "Elite", "VIP",
  "LÃ¼ks", "Gizli", "KaÃ§amak", "Otel", "Rezidans", "Evlere Servis", "Otele Servis", "KaporasÄ±z", "GÃ¼venilir"
];

const ADULT_PROFILE_ADJECTIVES = [
  "AteÅŸli", "SÄ±cak", "Nefes Kesen", "BaÅŸtan Ã‡Ä±karÄ±cÄ±", "VahÅŸi", "Doyumsuz", "KÄ±ÅŸkÄ±rtÄ±cÄ±", "Egzotik",
  "TanrÄ±Ã§a", "Afet", "Bomba", "PÄ±rlanta", "Elite", "VIP"
];

const ADULT_QUALITIES = [
  "4K Ultra HD", "1080p Full HD", "SansÃ¼rsÃ¼z", "GerÃ§ek GÃ¶rsel", "Videolu Onay", "CanlÄ± Teyit", "KaporasÄ±z"
];

const V1_P1_TEMPLATES = [
  "{sehir} {ilce} civarÄ±nda kapora vermeden, gÃ¼venilir Ä°stanbul escort arayanlar iÃ§in en yeni ilanlarÄ± tek sayfada topladÄ±k. Buradaki kÄ±zlar {sehir} genelinde {hizmet} veren bireysel partnerlerdir.",
  "{ilce} {ilan} arÄ±yorsanÄ±z, doÄŸrudan gÃ¶rÃ¼ÅŸebileceÄŸiniz teyitli kÄ±zlarÄ±n profillerini inceleyin. Ã–n Ã¶demesiz buluÅŸmalar iÃ§in en iyi seÃ§enekler listelenmiÅŸtir.",
  "{sehir} {ilce} escort bayan ilanlarÄ±nda sahteciliÄŸe yer yok. %100 {quality} gÃ¶rseller ve kaporasÄ±z buluÅŸma imkanÄ±yla en aktif profiller burada.",
  "GÃ¼venli ve temiz bir refakat iÃ§in {sehir} {ilce} escort ilanlarÄ±mÄ±za gÃ¶z atÄ±n. TamamÄ± adreste elden Ã¶deme alan baÄŸÄ±msÄ±z kÄ±zlardan oluÅŸmaktadÄ±r.",
  "{sehir} {ilce} eskort listesinde yer alan popÃ¼ler ve {adj} kÄ±zlarla doÄŸrudan iletiÅŸim kurun. Herhangi bir Ã¶n Ã¶deme riski yoktur."
];

const V1_P2_TEMPLATES = [
  "BuluÅŸmalar {niche} konseptinde ve tamamen kaporasÄ±zdÄ±r. GÃ¶rsellerin altÄ±ndaki linklerden kÄ±zlara doÄŸrudan ulaÅŸabilirsiniz. Ä°stanbul escort hizmeti iÃ§in 7/24 teyit alabilirsiniz.",
  "Ã–nceliÄŸimiz gÃ¼venlik ve sorunsuz randevudur. Bu yÃ¼zden {sehir} {ilce} eskort listesindeki tÃ¼m profiller kapÄ±da elden nakit Ã¶deme kabul eder.",
  "ParanÄ±zÄ± riske atmadan, kapora veya depozito Ã¶demeden {sehir} {ilce} escort modelleriyle gÃ¶rÃ¼ÅŸÃ¼n. KÄ±zlar rezidans ya da otel adreslerine servis saÄŸlamaktadÄ±r.",
  "Rehberimizdeki baÄŸÄ±msÄ±z kÄ±zlar {sehir} genelinde popÃ¼ler {niche} buluÅŸmalar yapar ve gizliliÄŸinizi korur. Ä°letiÅŸim iÃ§in profillere tÄ±klamanÄ±z yeterlidir.",
  "GizliliÄŸe Ã¶nem veren {ilce} escort bayan ilanlarÄ±, kapora tuzaÄŸÄ± olmadan elden Ã¶demeyle Ã§alÄ±ÅŸÄ±r. KÄ±zlarla hÄ±zlÄ± randevu iÃ§in butonlarÄ± kullanÄ±n."
];

const V2_P1_TEMPLATES = [
  "{sehir} {ilce} {ilan} seÃ§enekleriyle gÃ¼nÃ¼n yorgunluÄŸunu geride bÄ±rakÄ±n. KaporasÄ±z ve elden Ã¶demeli Ä°stanbul escort profilleri listelenmiÅŸtir.",
  "{sehir} {ilce} bÃ¶lgesinde kaporasÄ±z partner bulmak artÄ±k Ã§ok kolay. TamamÄ± doÄŸrulanmÄ±ÅŸ gÃ¶rsellerle en aktif kÄ±zlar vitrinde yer alÄ±yor.",
  "{sehir} {ilce} escort ilanlarÄ±nda en popÃ¼ler and {adj} modelleri sizin iÃ§in seÃ§tik. SÄ±fÄ±r risk ve tam gizlilik esasÄ±yla randevunuzu alÄ±n.",
  "SÄ±radan ilanlardan sÄ±kÄ±lanlar iÃ§in {sehir} {ilce} eskort vitrinini gÃ¼ncelledik. BaÄŸÄ±msÄ±z partnerlerin gÃ¼ncel ilanlarÄ± aÅŸaÄŸÄ±dadÄ±r.",
  "Kendi yerinde veya otelde gÃ¶rÃ¼ÅŸebileceÄŸiniz {sehir} {ilce} escort kÄ±zlarÄ±, gerÃ§ek resimleriyle sizleri bekliyor. Hemen kataloÄŸu inceleyin."
];

const V2_P2_TEMPLATES = [
  "BuluÅŸmalarda gÃ¼venlik ve gizlilik kurallarÄ± geÃ§erlidir. Semtteki baÄŸÄ±msÄ±z VIP kÄ±zlar {niche} randevular kabul eder ve kapora istemez. GÃ¶rÃ¼ÅŸme iÃ§in profil linklerini takip edin.",
  "Kopya ilanlardan uzak durarak {sehir} {ilce} eskort profillerine gÃ¼venle ulaÅŸabilirsiniz. BuluÅŸmada nakit Ã¶deme yapÄ±lÄ±r.",
  "KaldÄ±ÄŸÄ±nÄ±z otel veya kendi rezidansÄ±nÄ±zda gÃ¶rÃ¼ÅŸmek iÃ§in kaporasÄ±z Ã§alÄ±ÅŸan {sehir} {ilce} escort bayan ilanlarÄ±nÄ± tercih edin. Parasal kayÄ±p riski yoktur.",
  "Ã–n Ã¶demesiz Ã§alÄ±ÅŸan kÄ±zlar {sehir} genelinde en Ã§ok tercih edilen {niche} hizmetleri sunar. Ä°letiÅŸim numaralarÄ± ve detaylar profillerde mevcuttur.",
  "GÃ¼venli buluÅŸma iÃ§in kapora istemeyen {ilce} escort bayan ilanlarÄ±nÄ± seÃ§in. Ã–demeyi adreste elden nakit olarak yapabilirsiniz."
];

const V3_P1_TEMPLATES = [
  "{sehir} {ilce} bÃ¶lgesindeki en aktif baÄŸÄ±msÄ±z {secenek} listesi gÃ¼ncellendi. GÃ¼venilir ve gizli Ä°stanbul escort profillerini aÅŸaÄŸÄ±da bulabilirsiniz.",
  "{sehir} {ilce} lokasyonunda {adj} ve tutkulu partner arayanlar iÃ§in en iyi ilanlar vitrinde. KÄ±zlarla doÄŸrudan WhatsApp Ã¼zerinden gÃ¶rÃ¼ÅŸÃ¼n.",
  "Gizlilik prensibiyle Ã§alÄ±ÅŸan {sehir} {ilce} eskort ilanlarÄ± arasÄ±ndan seÃ§iminizi yapÄ±n. GerÃ§ek resimlerle sorunsuz randevu alÄ±n.",
  "{sehir} {ilce} Ã§evresinde hÄ±zlÄ± servis veren baÄŸÄ±msÄ±z partnerlerin iletiÅŸim bilgilerine bu sayfadan ulaÅŸabilirsiniz.",
  "{sehir} {ilce} escort arayÄ±ÅŸÄ±nÄ±zda tecrÃ¼beli ve kaporasÄ±z {secenek} alternatifleri burada listelenmiÅŸtir."
];

const V3_P2_TEMPLATES = [
  "TÃ¼m ilanlarÄ±mÄ±z teyitli ve gerÃ§ek resimlidir. Size en yakÄ±n {sehir} {ilce} escort profilini seÃ§ip kaporasÄ±z elden Ã¶demeyle hemen randevunuzu ayarlayÄ±n.",
  "Sistemdeki tÃ¼m kÄ±zlar doÄŸrulanmÄ±ÅŸtÄ±r. Herhangi bir Ã¶n Ã¶deme yapmadan, adreste elden Ã¶deme gÃ¼vencesiyle gÃ¶rÃ¼ÅŸebilirsiniz.",
  "BuluÅŸmalarda sÃ¼rpriz Ã¼cretler veya kapora talepleri yoktur. {sehir} {ilce} eskort kÄ±zlarÄ±yla doÄŸrudan iletiÅŸim kurabilirsiniz.",
  "GÃ¼venilir ve keyifli bir gÃ¶rÃ¼ÅŸme iÃ§in yukarÄ±daki ilanlarÄ± kullanÄ±n. Memnuniyet odaklÄ± Ã§alÄ±ÅŸan baÄŸÄ±msÄ±z modeller aktif hizmet veriyor.",
  "Kapora Ã¶deme riski olmadan, tamamen elden Ã¶demeyle Ã§alÄ±ÅŸan {sehir} {ilce} escort partnerleriyle randevunuzu hÄ±zlÄ±ca oluÅŸturun."
];

const V4_P1_TEMPLATES = [
  "{sehir} {ilce} bÃ¶lgesinde gÃ¼ncel {secenek} ilanlarÄ± bir araya getirildi. KaporasÄ±z ve elden Ã¶demeli Ã§alÄ±ÅŸan Ä°stanbul escort partnerleriyle hemen gÃ¶rÃ¼ÅŸÃ¼n.",
  "Teyitli resimler ve gÃ¼ncel ilanlarla {sehir} {ilce} eskort listesini hazÄ±rladÄ±k. KÄ±zlara doÄŸrudan ulaÅŸmak iÃ§in profillerdeki linkleri kullanÄ±n.",
  "{sehir} {ilce} bÃ¶lgesinde kaporasÄ±z escort bulmak artÄ±k Ã§ok kolay. DoÄŸrulanmÄ±ÅŸ profiller arasÄ±ndan dilediÄŸinizi seÃ§ip hemen iletiÅŸime geÃ§in.",
  "{sehir} {ilce} escort modelleriyle gÃ¼nÃ¼n stresini atÄ±n. TamamÄ± kaporasÄ±z ve adrese servis veren baÄŸÄ±msÄ±z kÄ±zlar listelenmiÅŸtir.",
  "{sehir} {ilce} {ilan} listemizden tecrÃ¼beli ve gÃ¼venilir baÄŸÄ±msÄ±z partnerleri inceleyerek randevunuzu teyit edin."
];

const V4_P2_TEMPLATES = [
  "Sitemizde sadece kaporasÄ±z ve doÄŸrulanmÄ±ÅŸ {sehir} {ilce} eskort profilleri yer alÄ±r. Randevuda Ã¶demenizi adreste elden nakit olarak yapabilirsiniz.",
  "Ã–n koÅŸul veya rezervasyon Ã¼creti Ã¶demeden doÄŸrudan buluÅŸabileceÄŸiniz {sehir} {ilce} escort modelleriyle gÃ¶rÃ¼ÅŸmek iÃ§in linkleri takip edin.",
  "Sahte resimli ilanlardan uzak durun. Bu sayfada sadece gerÃ§ek resimli ve kaporasÄ±z Ã§alÄ±ÅŸan Ä°stanbul escort kÄ±zlarÄ± listelenmektedir.",
  "GÃ¶rÃ¼ÅŸmelerde gizlilik esastÄ±r. Kapora dolandÄ±rÄ±cÄ±larÄ±na bulaÅŸmadan, adreste nakit Ã¶demeyle Ã§alÄ±ÅŸan teyitli kÄ±zlarla gÃ¶rÃ¼ÅŸÃ¼n.",
  "Maddi kayÄ±p yaÅŸamadan, gÃ¼venilir ve kaporasÄ±z {sehir} {ilce} eskort ilanlarÄ±mÄ±zla randevunuzu sÄ±fÄ±r riskle ayarlayÄ±n."
];

const V5_P1_TEMPLATES = [
  "Ä°stanbul {sehir} {ilce} escort ilanlarÄ± arayan beyler iÃ§in kaporasÄ±z Ã§alÄ±ÅŸan gÃ¼ncel kÄ±zlarÄ± listeledik. TamamÄ± doÄŸrulanmÄ±ÅŸ ve gerÃ§ek fotoÄŸraflÄ± {sehir} {ilce} eskort modelleri arasÄ±ndan dilediÄŸiniz profille hemen iletiÅŸime geÃ§ebilirsiniz. Sahte profillerle vakit kaybetmeden doÄŸrudan adrese servis veren baÄŸÄ±msÄ±z kÄ±zlarÄ± tercih edin.",
  "{sehir} {ilce} {ilan} seÃ§enekleriyle kaporasÄ±z ve gÃ¼venli partner bulmak Ã§ok kolay. Bu listede yer alan baÄŸÄ±msÄ±z Ã§alÄ±ÅŸan {ilce} escort kÄ±zlarÄ±, Ã¶n Ã¶deme talep etmeden tamamen karÅŸÄ±lÄ±klÄ± gÃ¼ven esasÄ±yla randevu kabul etmektedir."
];

const V5_P2_TEMPLATES = [
  "BÃ¶lgedeki rezidanslarda ve lÃ¼ks otellerde gÃ¶rÃ¼ÅŸebileceÄŸiniz kÄ±zlar, hem fizikleri hem de gÃ¼ler yÃ¼zlÃ¼ hizmetleriyle dikkat Ã§ekiyor. {sehir} {ilce} escort ilanlarÄ±mÄ±zda zamanÄ±nda adreste olan ve gizliliÄŸe Ã¶nem veren profesyoneller yer alÄ±r.",
  "Sorunsuz bir gÃ¶rÃ¼ÅŸme ve kaporasÄ±z randevu iÃ§in {sehir} {ilce} eskort kÄ±zlarÄ±mÄ±zÄ± tercih edin. Otelinize veya kendi rezidansÄ±nÄ±za teyitli servis imkanÄ± bulunmaktadÄ±r."
];

const V5_P3_TEMPLATES = [
  "Kapora dolandÄ±rÄ±cÄ±larÄ±ndan uzak durarak {sehir} {ilce} escort ilanlarÄ±ndaki doÄŸrulanmÄ±ÅŸ kÄ±zlarla gÃ¶rÃ¼ÅŸÃ¼n. BuluÅŸma anÄ±nda elden nakit Ã¶deme sayesinde maddi kayÄ±p riski yaÅŸamadan randevunuzu gerÃ§ekleÅŸtirebilirsiniz.",
  "Ã–n Ã¶deme istemeyen ve adreste Ã¶deme alan {sehir} {ilce} eskort kÄ±zlarÄ±yla gÃ¼venli ÅŸekilde gÃ¶rÃ¼ÅŸÃ¼n. Rezervasyon iÃ§in profil kartlarÄ±ndaki yÃ¶nlendirme baÄŸlantÄ±larÄ±nÄ± kullanÄ±n."
];

const V5_P4_TEMPLATES = [
  "UlaÅŸÄ±m yÃ¶nÃ¼nden {sehir} {ilce} bÃ¶lgesi oldukÃ§a rahattÄ±r. Metro, metrobÃ¼s ve ana yollara yakÄ±n rezidanslarda veya otellerde kalÄ±yorsanÄ±z, partneriniz randevu saatinde gecikme olmadan adresinizde olur.",
  "Ä°ster saatlik ister gecelik randevular iÃ§in olsun, {sehir} {ilce} eskort kÄ±zlarÄ± en kÄ±sa sÃ¼rede belirttiÄŸiniz adrese ulaÅŸarak keyifli anlarÄ±nÄ±zÄ± baÅŸlatacaktÄ±r."
];

const V5_P5_TEMPLATES = [
  "GÃ¶rÃ¼ÅŸme esnasÄ±nda gizliliÄŸiniz tamamen korunur. ÃœÃ§Ã¼ncÃ¼ ÅŸahÄ±slarla hiÃ§bir bilgi paylaÅŸÄ±lmaz. SÄ±kÄ±ntÄ±sÄ±z ve gÃ¼venli bir eskort deneyimi iÃ§in en doÄŸru ilanlarÄ± sizler iÃ§in derledik.",
  "KarÅŸÄ±lÄ±klÄ± saygÄ± ve gizlilik Ã§erÃ§evesinde gerÃ§ekleÅŸen buluÅŸmalarda, partnerinizle keyifli vakit geÃ§irebilirsiniz. {ilan} alternatifleri iÃ§inden en uygun profili seÃ§in."
];

const V5_P6_TEMPLATES = [
  "SonuÃ§ olarak, {sehir} {ilce} escort ilanlarÄ±nda kaporasÄ±z ve gerÃ§ek resimli kÄ±zlarÄ± sizlerle buluÅŸturuyoruz. Hemen yukarÄ±daki baÄŸlantÄ±larÄ± tÄ±klayarak kÄ±zlarla WhatsApp Ã¼zerinden sohbet etmeye baÅŸlayÄ±n.",
  "SÄ±radan reklam sitelerindeki sahte resimlerden bÄ±ktÄ±ysanÄ±z, {sehir} {ilce} eskort listemizdeki kaporasÄ±z ve doÄŸrulanmÄ±ÅŸ modellerle hemen randevunuzu oluÅŸturun."
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function slugify(text: string): string {
  if (!text) return '';
  return text
    .replace(/Ä°/g, 'i')
    .replace(/I/g, 'Ä±')
    .replace(/Ä/g, 'g')
    .replace(/ÄŸ/g, 'g')
    .replace(/Ãœ/g, 'u')
    .replace(/Ã¼/g, 'u')
    .replace(/Å/g, 's')
    .replace(/ÅŸ/g, 's')
    .replace(/Ã–/g, 'o')
    .replace(/Ã¶/g, 'o')
    .replace(/Ã‡/g, 'c')
    .replace(/Ã§/g, 'c')
    .toLowerCase()
    .replace(/Ä±/g, 'i')
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
    .replace(/{secenek}/g, () => getRandomElement(['escort bayan', 'VIP refakatÃ§i', 'bireysel partner']))
    .replace(/{hizmet}/g, () => getRandomElement(['VIP escort hizmeti', 'doÄŸrulanmÄ±ÅŸ eskort rehberi', 'bireysel refakat']))
    .replace(/{ilan}/g, () => getRandomElement(['kaporasÄ±z escort ilanlarÄ±', 'bireysel escort bayan vitrini', 'VIP eskort seÃ§enekleri']))
    .replace(/{luks}/g, () => getRandomElement(['lÃ¼ks', 'elit', 'ayrÄ±calÄ±klÄ±', 'gerÃ§ek fotoÄŸraflÄ±']))
    .replace(/{([^{}]+)}/g, (_, choices) => {
      const arr = choices.split('|');
      return getRandomElement(arr);
    });
}

export function generateGoogleSitesHTML(sehir: string, ilce: string, pathCounter: number, version: number, title: string, verificationCode: string, geminiText: string = '', iframePath?: string): string {
  const targetPath = iframePath || `istanbul/${slugify(ilce)}`;
  const lastSlug = targetPath.split('/').pop() || 'istanbul';
  const iframeUrl = `https://${PRIMARY_HOST}/embed/vitrin?city=${lastSlug}`;
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

  if (geminiText) {
    lead = `<div class="gemini-local-guide" style="margin-bottom: 20px; padding: 15px; border-left: 4px solid var(--accent); background: rgba(16, 185, 129, 0.05); font-size: 0.95rem; line-height: 1.6; color: var(--text-muted);"><strong style="color: #fff;">ğŸ“ Yerel Rehber & CoÄŸrafi Bilgi:</strong> ${geminiText}</div>${lead}`;
  }

  // Generate ~100 targeted keys
  const firstPrefixes = ["", "istanbul ", "vip ", "elit ", "kaporasÄ±z ", "bireysel ", "baÄŸÄ±msÄ±z "];
  const midKeywords = [`${ilce} escort`, `${ilce} eskort`, `${ilce} escort bayan`, `${ilce} eskort bayan`];
  const lastSuffixes = ["", " ilanlarÄ±", " fiyatlarÄ±", " numaralarÄ±", " yorumlarÄ±", " buluÅŸma"];
  
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
    return `      <a href="https://${PRIMARY_HOST}/${targetPath}" class="tag-link" style="opacity: ${opacity}; font-size: 11px; margin: 4px; display: inline-block;">${k}</a>`;
  }).join('\n');
  const hiddenKeywordsHtml = ``; // Banned stealth wrapper eliminated

  const subdomain = PRIMARY_HOST.replace(/\./g, '-');
  const ampCacheUrl = `https://${subdomain}.cdn.ampproject.org/c/s/${PRIMARY_HOST}/amp?loc=${slugify(ilce)}`;

  // FAQ section targeting user concerns (icons, other profiles search, safety, verification)
  const faqHtml = `
    <div class="faq-item">
      <div class="faq-q">ğŸ“ S: DiÄŸer escort profillerini ve ilan vitrinini nerede bulabilirim?</div>
      <div class="faq-a">C: DiÄŸer tÃ¼m doÄŸrulanmÄ±ÅŸ baÄŸÄ±msÄ±z eskort profillerine ve vitrin gÃ¶rsellerine ulaÅŸmak iÃ§in sayfanÄ±n altÄ±ndaki "TÃ¼m ${ilce} GÃ¶rÃ¼ÅŸmelerini Listele" butonuna tÄ±klayarak doÄŸrudan <a href="https://${PRIMARY_HOST}/${targetPath}" style="color:var(--accent); font-weight:bold;">${PRIMARY_HOST}</a> ana dizinine eriÅŸebilirsiniz.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">ğŸ’¬ S: Profil kartlarÄ±ndaki simgeler ve ikonlar ne anlama geliyor?</div>
      <div class="faq-a">C: Profil kartlarÄ±nÄ±n Ã¼st kÃ¶ÅŸelerinde yer alan onay rozetleri ve yÄ±ldÄ±z ikonlarÄ±, modellerin canlÄ± video teyidinden geÃ§erek sistemde %100 doÄŸrulanmÄ±ÅŸ, kaporasÄ±z ve gÃ¼venilir VIP eskort Ã¼yesi olduÄŸunu simgeler.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">ğŸ›¡ï¸ S: ${ilce} escort arayanlar gÃ¼venli buluÅŸmaya nasÄ±l ulaÅŸÄ±r?</div>
      <div class="faq-a">C: GÃ¼venli eskort buluÅŸmasÄ± iÃ§in en kritik kural kapora veya rezervasyon bedeli adÄ± altÄ±nda hiÃ§bir Ã¶n Ã¶deme yapmamaktÄ±r. Listemizde yer alan tÃ¼m ${ilce} escort bayan Ã¼yeleri Ã¶demeyi buluÅŸma anÄ±nda adreste elden nakit olarak kabul eder.</div>
    </div>
  `;

  // Name arrays for absolute randomization
  const ERKEK_ISIMLERI = ["Azad", "Baran", "Civan", "Dijwar", "Åervan", "Zinar"];
  const KIZ_ISIMLERI = ["Berfin", "Dilan", "JÃ®nda", "Narin", "RojÃ®n", "Zilan"];
  const SOYADLAR = ["Gewad", "ReÅŸo", "Zaza", "Botan", "Kaya", "Demir", "Ã‡elik"];

  const managerName = getRandomElement(ERKEK_ISIMLERI);
  const managerSurname = getRandomElement(SOYADLAR);
  const publisherGirl = getRandomElement(KIZ_ISIMLERI);

  const authorBranding = `${publisherGirl} HanÄ±m`;
  const seoTitleVariations = [
    `${authorBranding} ${ilce} Escort Ä°lanlarÄ± ${currentYear} - %100 KaporasÄ±z`,
    `${ilce} Premium Escort Ä°lanlarÄ± ${currentYear} - Elden Ã–deme VIP`,
    `KaporasÄ±z ${ilce} Escort Ä°lanlarÄ± ${currentYear} - ${managerName} ${managerSurname} GÃ¼vencesiyle`,
    `Bireysel ${ilce} Eskort Bayan Ä°lanlarÄ± ${currentYear} - Teyitli Vitrin`
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
          "name": "DiÄŸer escort profillerini ve ilan vitrinini nerede bulabilirim?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "DiÄŸer tÃ¼m doÄŸrulanmÄ±ÅŸ baÄŸÄ±msÄ±z eskort profillerine ve vitrin gÃ¶rsellerine ulaÅŸmak iÃ§in sayfanÄ±n altÄ±ndaki buton ile doÄŸrudan dorukcanay.digital ana dizinine eriÅŸebilirsiniz."
          }
        },
        {
          "@type": "Question",
          "name": "Profil kartlarÄ±ndaki simgeler ve ikonlar ne anlama geliyor?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Profil kartlarÄ±ndaki rozet ve onay simgeleri modellerin doÄŸrulanmÄ±ÅŸ, kaporasÄ±z ve VIP Ã¼ye olduÄŸunu gÃ¶sterir."
          }
        },
        {
          "@type": "Question",
          "name": "${ilce} escort arayanlar gÃ¼venli buluÅŸmaya nasÄ±l ulaÅŸÄ±r?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kesinlikle kapora veya Ã¶n Ã¶deme gÃ¶ndermeyerek, sadece buluÅŸma anÄ±nda elden Ã¶deme yÃ¶ntemiyle gÃ¼venli buluÅŸma gerÃ§ekleÅŸtirebilirsiniz."
          }
        }
      ]
    },
    {
      "@type": "LocalBusiness",
      "name": "${ilce} VIP Escort AjansÄ±",
      "image": "https://${PRIMARY_HOST}/_media/vitrin/istanbul-kaporasiz-escort-melissa-1.webp",
      "telephone": "+90 501 635 50 53",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "${ilce} Caddesi No 34",
        "addressLocality": "${ilce}",
        "addressRegion": "Ä°stanbul",
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
            <a href="${profileUrl}" target="_blank" rel="noopener" class="v1-btn">Profili GÃ¶r</a>
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
    100% { transform: translateX(calc(-260px * ${ORIGINAL_VITRIN.length + 1} - 16px * ${ORIGINAL_VITRIN.length + 1})); }
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
  src="${iframeUrl}"
  style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none; z-index: 999999; overflow: auto;">
</iframe>
<div class="container">
  <header>
    <h1>${selectedTitle}</h1>
    <p class="lead">${lead}</p>
    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:10px;">Yazar / EditÃ¶r: <strong>${dynamicAuthor}</strong></div>
  </header>
  
  <div class="v1-marquee">
    <div class="v1-track">
      ${slidesHtml}
      ${slidesHtml}
    </div>
  </div>

  <div class="info-box">
    <h3>ğŸ€ KaporasÄ±z Randevu & %100 GÃ¼venlik Garantisi</h3>
    <p>${body}</p>
  </div>

  <div class="faq-section">
    <h3 class="faq-title">ğŸ’¬ SÄ±kÃ§a Sorulan Sorular</h3>
    ${faqHtml}
  </div>

  <div class="keyword-section">
    <h4 class="keyword-title">ğŸ“ Ä°lgili Arama BaÅŸlÄ±klarÄ±:</h4>
    <div class="keywords">
      ${keywordsHtml}
    </div>
  </div>

  ${hiddenKeywordsHtml}

  <div class="footer-cta">
    <a href="https://${PRIMARY_HOST}/${targetPath}" class="footer-btn">ğŸ€ TÃ¼m ${ilce} Escort KataloÄŸunu GÃ¶r</a>
  </div>

  <div class="brand-signature">âš¡ EÅREF TEK âš¡</div>
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
            <p class="v2-cat-meta">${profile.race} RefakatÃ§i | ${ilce}</p>
            <div class="v2-tag-cloud">
              <span class="v2-subtag">${profile.cat}</span>
              <span class="v2-subtag">${mNiche}</span>
            </div>
            <a href="${profileUrl}" target="_blank" rel="noopener" class="v2-cta-link">DetaylarÄ± Ä°ncele</a>
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
    0% { transform: translateX(calc(-280px * ${ORIGINAL_VITRIN.length + 1} - 16px * ${ORIGINAL_VITRIN.length + 1})); }
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
  src="${iframeUrl}"
  style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none; z-index: 999999; overflow: auto;">
</iframe>
<div class="wrapper">
  <div class="heading-block">
    <h1>${selectedTitle}</h1>
    <p>${lead}</p>
    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:10px;">Yazar / EditÃ¶r: <strong>${dynamicAuthor}</strong></div>
  </div>
  
  <div class="v2-marquee-container">
    <div class="v2-slider-track">
      ${slidesHtml}
      ${slidesHtml}
    </div>
  </div>

  <div class="v2-info">
    <h3>ğŸŒ¿ KaporasÄ±z Randevu & VIP Standartlar</h3>
    <p>${body}</p>
  </div>

  <div class="faq-block">
    <h3 class="faq-head">ğŸ’¬ SÄ±kÃ§a Sorulan Sorular</h3>
    ${faqHtml}
  </div>

  <div class="v2-keywords-box">
    <h4 class="v2-keywords-title">ğŸ“ Ä°lgili Arama BaÅŸlÄ±klarÄ±:</h4>
    <div class="v2-tags-container">
      ${keywordsHtml.replace(/class="tag-link"/g, 'class="v2-tag-item"')}
    </div>
  </div>

  ${hiddenKeywordsHtml}

  <div class="v2-footer">
    <a href="https://${PRIMARY_HOST}/${targetPath}" class="v2-footer-btn">ğŸŸ¢ TÃ¼m ${ilce} KataloÄŸunu GÃ¶r</a>
  </div>

  <div class="brand-signature">âš¡ EÅREF TEK âš¡</div>
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
              <p class="v3-sub">${profile.race} RefakatÃ§i | ${mNiche}</p>
              <p class="v3-cat">${profile.cat}</p>
            </div>
            <a href="${profileUrl}" target="_blank" rel="noopener" class="v3-btn-gold">Ä°letiÅŸime GeÃ§</a>
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
    100% { transform: translateY(calc(-227px * ${ORIGINAL_VITRIN.length + 1})); }
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
  src="${iframeUrl}"
  style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none; z-index: 999999; overflow: auto;">
</iframe>
<div class="box">
  <h1>${selectedTitle}</h1>
  <p class="lead-desc">${lead}</p>
  <div style="font-size:0.8rem; color:var(--text-muted); text-align:center; margin-top:-15px; margin-bottom:25px;">Yazar / EditÃ¶r: <strong>${dynamicAuthor}</strong></div>
  
  <div class="v3-marquee-vertical">
    <div class="v3-slider-track">
      ${slidesHtml}
      ${slidesHtml}
    </div>
  </div>

  <div class="v3-box-p">
    <h4>âœ… %100 DoÄŸrulanmÄ±ÅŸ Profil Garantisi</h4>
    <p>${body}</p>
  </div>

  <div class="faq-wrap">
    <h3 class="faq-wrap-title">ğŸ’¬ Merak Edilenler</h3>
    ${faqHtml.replace(/class="faq-item"/g, 'class="faq-box"').replace(/class="faq-q"/g, 'class="faq-box-q"').replace(/class="faq-a"/g, 'class="faq-box-a"')}
  </div>

  <div style="margin-top: 30px;">
    <h4 class="kw-title">ğŸ“ Ä°lgili Arama BaÅŸlÄ±klarÄ±:</h4>
    <div class="kw-tags">
      ${keywordsHtml.replace(/class="tag-link"/g, 'class="kw-tag-item"')}
    </div>
  </div>

  ${hiddenKeywordsHtml}

  <a href="https://${PRIMARY_HOST}/${targetPath}" class="footer-btn-gold">ğŸ€ TÃ¼m ${ilce} KataloÄŸunu KeÅŸfet</a>

  <div class="brand-signature">âš¡ EÅREF TEK âš¡</div>
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
            <a href="${profileUrl}" target="_blank" rel="noopener" class="v4-btn">Hemen UlaÅŸ</a>
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
    100% { transform: translateX(calc(-260px * 13 - 16px * 13)); }
  }
  @keyframes marqueeRightAnimationV4 {
    0% { transform: translateX(calc(-260px * 13 - 16px * 13)); }
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
  src="${iframeUrl}"
  style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none; z-index: 999999; overflow: auto;">
</iframe>
<div class="container">
  <header>
    <h1>${selectedTitle}</h1>
    <p class="lead-p">${lead}</p>
    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:10px;">Yazar / EditÃ¶r: <strong>${dynamicAuthor}</strong></div>
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
    <h3>ğŸŸ¢ GÃ¼venli ve KaporasÄ±z Elit GÃ¶rÃ¼ÅŸmeler</h3>
    <p>${body}</p>
  </div>

  <div class="faq-wrap">
    <h3 class="faq-title">ğŸ’¬ SÄ±kÃ§a Sorulan Sorular</h3>
    ${faqHtml}
  </div>

  <div class="tags-box">
    <h4>ğŸ“ Ä°lgili Arama BaÅŸlÄ±klarÄ±:</h4>
    <div class="tags-list">
      ${keywordsHtml}
    </div>
  </div>

  ${hiddenKeywordsHtml}

  <a href="https://${PRIMARY_HOST}/${targetPath}" class="footer-cta-btn">ğŸŸ¢ TÃ¼m ${ilce} GÃ¶rÃ¼ÅŸmelerini Listele</a>

  <div class="brand-signature">âš¡ EÅREF TEK âš¡</div>
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
            <span class="v5-tag">KaporasÄ±z</span>
          </div>
          <a href="${profileUrl}" target="_blank" rel="noopener" class="v5-profile-btn">Ä°letiÅŸime GeÃ§</a>
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
  src="${iframeUrl}"
  style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none; z-index: 999999; overflow: auto;">
</iframe>
<div class="container">
  <header>
    <h1>${selectedTitle}</h1>
    <p class="lead-p">${lead}</p>
    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:10px;">Yazar / EditÃ¶r: <strong>${dynamicAuthor}</strong></div>
  </header>

  <div class="v5-grid">
    ${profilesHtml}
  </div>

  <div class="v5-editorial-content">
    <h3>ğŸ€ VIP Refakat ve SeÃ§kin Hizmet DetaylarÄ±</h3>
    <p>${body}</p>
  </div>

  <div class="faq-wrap">
    <h3 class="faq-title">ğŸ’¬ SÄ±kÃ§a Sorulan Sorular</h3>
    ${faqHtml}
  </div>

  <div class="tags-box">
    <h4>ğŸ“ Ä°lgili Arama BaÅŸlÄ±klarÄ±:</h4>
    <div class="tags-list">
      ${keywordsHtml}
    </div>
  </div>

  ${hiddenKeywordsHtml}

  <a href="https://${PRIMARY_HOST}/${targetPath}" class="footer-cta-btn">ğŸŸ¢ TÃ¼m ${ilce} GÃ¶rÃ¼ÅŸmelerini Listele</a>

  <div class="brand-signature" style="text-align:center; margin-top:30px; font-size:0.8rem; color:var(--text-muted); opacity:0.6; border-top:1px dashed var(--border-color); padding-top:15px; font-weight:600; letter-spacing:1.5px;">âš¡ EÅREF TEK âš¡</div>
</div>
${schema}
</body>
</html>`;
  }
}

export async function buildGoogleSitesPayloads() {
  console.log(`ğŸ”¨ Generating Google Sites HTML Payloads at: ${OUTPUT_DIR}`);
  
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
  notepadContent += `ğŸŸ¢ GOOGLE SITES SYSTEM DIRECTORY & METADATA MAP (dorukcanay.digital Edition)\n`;
  notepadContent += `Generated: ${new Date().toISOString()}\n`;
  notepadContent += `Total Locations: 348\n`;
  notepadContent += `========================================================================\n\n`;

  for (const district of istanbulCity.districts) {
    const cleanDistrictName = district.name.replace(/\s+escort/gi, '').trim();
    const districtSlug = slugify(cleanDistrictName);

    if (processedDistricts.has(districtSlug)) continue;
    processedDistricts.add(districtSlug);

    const districtFileName = `istanbul-${districtSlug}-escort.html`;
    const districtTitle = `${cleanDistrictName} Escort | ${cleanDistrictName} Eskort Bayan Ä°lanlarÄ±`;
    const targetAmpCache = `https://${PRIMARY_HOST}/istanbul/${districtSlug}`;

    // Select a dynamic verification code to rotate footprints
    const vCode = GSC_VERIFICATIONS[pathCounter % GSC_VERIFICATIONS.length];

    // Call Gemini API for district description
    const geminiText = await callGemini(cleanDistrictName, "");

    // Write to HTML payload versions
    const html1 = generateGoogleSitesHTML("Ä°stanbul", cleanDistrictName, pathCounter, 1, districtTitle, vCode, geminiText);
    const html2 = generateGoogleSitesHTML("Ä°stanbul", cleanDistrictName, pathCounter, 2, districtTitle, vCode, geminiText);
    const html3 = generateGoogleSitesHTML("Ä°stanbul", cleanDistrictName, pathCounter, 3, districtTitle, vCode, geminiText);
    const html4 = generateGoogleSitesHTML("Ä°stanbul", cleanDistrictName, pathCounter, 4, districtTitle, vCode, geminiText);
    const html5 = generateGoogleSitesHTML("Ä°stanbul", cleanDistrictName, pathCounter, 5, districtTitle, vCode, geminiText);

    fs.writeFileSync(path.join(v1Dir, districtFileName), html1);
    fs.writeFileSync(path.join(v2Dir, districtFileName), html2);
    fs.writeFileSync(path.join(v3Dir, districtFileName), html3);
    fs.writeFileSync(path.join(v4Dir, districtFileName), html4);
    fs.writeFileSync(path.join(v5Dir, districtFileName), html5);

    // Extract dynamic lead description
    const leadMatch = html1.match(/<p class="lead-p">([\s\S]*?)<\/p>/) || html1.match(/<p class="lead">([\s\S]*?)<\/p>/) || html1.match(/<p>([\s\S]*?)<\/p>/);
    const descText = leadMatch ? leadMatch[1].replace(/<[^>]*>/g, '').trim() : `${cleanDistrictName} bÃ¶lgesinde kaporasÄ±z ve %100 gerÃ§ek escort bayan ilanlarÄ±.`;

    // Append district metadata to notepad content
    notepadContent += `------------------------------------------------------------------------\n`;
    notepadContent += `ğŸ“ LOCATION: ${cleanDistrictName} (District)\n`;
    notepadContent += `ğŸ“‚ GOOGLE SITES PAGE SLUG/URL: istanbul-${districtSlug}-escort\n`;
    notepadContent += `ğŸ‘‘ PAGE TITLE (BaÅŸlÄ±k): ${districtTitle}\n`;
    notepadContent += `ğŸš€ TARGET REDIRECT (Canonical): ${targetAmpCache}\n`;
    notepadContent += `ğŸ›¡ï¸ VERIFICATION ID (GSC): ${vCode}\n`;
    notepadContent += `ğŸ“ DESCRIPTION: ${descText.replace(/\s+/g, ' ').slice(0, 155)}\n`;
    notepadContent += `ğŸ”‘ KEYWORDS: ${cleanDistrictName} escort, ${cleanDistrictName} eskort, istanbul ${cleanDistrictName} escort, kaporasÄ±z ${cleanDistrictName} escort, escort, eskort\n`;
    notepadContent += `------------------------------------------------------------------------\n\n`;

    pathCounter++;

    const processedNeighborhoods = new Set<string>();
    for (const neighborhood of district.neighborhoods) {
      const neighborhoodSlug = slugify(neighborhood.name);

      if (processedNeighborhoods.has(neighborhoodSlug)) continue;
      processedNeighborhoods.add(neighborhoodSlug);

      const neighborhoodFileName = `istanbul-${districtSlug}-${neighborhoodSlug}-escort.html`;
      const searchTarget = `${cleanDistrictName} ${neighborhood.name}`;
      const neighborhoodTitle = `${searchTarget} Escort - ${searchTarget} Eskort Ä°lanlarÄ±`;
      const targetAmpCacheN = `https://${PRIMARY_HOST}/istanbul/${districtSlug}/${neighborhoodSlug}`;
      const nVCode = GSC_VERIFICATIONS[pathCounter % GSC_VERIFICATIONS.length];

      // Call Gemini API for neighborhood description
      const nGeminiText = await callGemini(searchTarget, "");

      // Write to HTML payload versions
      const nIframePath = `istanbul/${districtSlug}/${neighborhoodSlug}`;
      const nHtml1 = generateGoogleSitesHTML("Ä°stanbul", searchTarget, pathCounter, 1, neighborhoodTitle, nVCode, nGeminiText, nIframePath);
      const nHtml2 = generateGoogleSitesHTML("Ä°stanbul", searchTarget, pathCounter, 2, neighborhoodTitle, nVCode, nGeminiText, nIframePath);
      const nHtml3 = generateGoogleSitesHTML("Ä°stanbul", searchTarget, pathCounter, 3, neighborhoodTitle, nVCode, nGeminiText, nIframePath);
      const nHtml4 = generateGoogleSitesHTML("Ä°stanbul", searchTarget, pathCounter, 4, neighborhoodTitle, nVCode, nGeminiText, nIframePath);
      const nHtml5 = generateGoogleSitesHTML("Ä°stanbul", searchTarget, pathCounter, 5, neighborhoodTitle, nVCode, nGeminiText, nIframePath);

      fs.writeFileSync(path.join(v1Dir, neighborhoodFileName), nHtml1);
      fs.writeFileSync(path.join(v2Dir, neighborhoodFileName), nHtml2);
      fs.writeFileSync(path.join(v3Dir, neighborhoodFileName), nHtml3);
      fs.writeFileSync(path.join(v4Dir, neighborhoodFileName), nHtml4);
      fs.writeFileSync(path.join(v5Dir, neighborhoodFileName), nHtml5);

      // Extract dynamic lead description
      const nLeadMatch = nHtml1.match(/<p class="lead-p">([\s\S]*?)<\/p>/) || nHtml1.match(/<p class="lead">([\s\S]*?)<\/p>/) || nHtml1.match(/<p>([\s\S]*?)<\/p>/);
      const nDescText = nLeadMatch ? nLeadMatch[1].replace(/<[^>]*>/g, '').trim() : `${searchTarget} escort arayanlar iÃ§in kaporasÄ±z ve elden Ã¶demeli VIP model ilanlarÄ±.`;

      // Append neighborhood metadata to notepad content
      notepadContent += `  ğŸ“ NEIGHBORHOOD: ${searchTarget}\n`;
      notepadContent += `  ğŸ“‚ GOOGLE SITES PAGE SLUG/URL: istanbul-${districtSlug}-${neighborhoodSlug}-escort\n`;
      notepadContent += `  ğŸ‘‘ PAGE TITLE (BaÅŸlÄ±k): ${neighborhoodTitle}\n`;
      notepadContent += `  ğŸš€ TARGET REDIRECT (Canonical): ${targetAmpCacheN}\n`;
      notepadContent += `  ğŸ›¡ï¸ VERIFICATION ID (GSC): ${nVCode}\n`;
      notepadContent += `  ğŸ“ DESCRIPTION: ${nDescText.replace(/\s+/g, ' ').slice(0, 155)}\n`;
      notepadContent += `  ğŸ”‘ KEYWORDS: ${searchTarget} escort, ${searchTarget} eskort, ${cleanDistrictName} ${neighborhood.name} escort, escort, eskort\n`;
      notepadContent += `  ----------------------------------------------------------------------\n\n`;

      pathCounter++;
    }
  }

  // ----------------------------------------------------
  // ğŸ§›â€â™‚ï¸ SPECIAL SITE SLUGS GENERATOR (Paravan Sites Sync)
  // ----------------------------------------------------
  const CUSTOM_SITES = [
    { slug: "sefakoyistanbul-drkcnay2026", district: "SefakÃ¶y", path: "istanbul/kucukcekmece/sefakoy" },
    { slug: "bakrkyescort-drkcnayv1", district: "BakÄ±rkÃ¶y", path: "istanbul/bakirkoy" },
    { slug: "catalca-escort-drkcnay1-v", district: "Ã‡atalca", path: "istanbul/catalca" },
    { slug: "beylikduzu-vip-escort", district: "BeylikdÃ¼zÃ¼", path: "istanbul/beylikduzu" },
    { slug: "besyol-universiteli-escort", district: "BeÅŸyol", path: "istanbul/kucukcekmece/besyol" },
    { slug: "besyol-escort-drkcnay1-v", district: "BeÅŸyol", path: "istanbul/kucukcekmece/besyol" },
    { slug: "istanbul-escort", district: "Ä°stanbul", path: "istanbul" },
    { slug: "sancaktepe-escort-drkcnay1-v", district: "Sancaktepe", path: "istanbul/sancaktepe" },
    { slug: "kartal-escort-drkcnay1-v", district: "Kartal", path: "istanbul/kartal" },
    { slug: "cekmekoy-escort-drkcnay1-v", district: "Ã‡ekmekÃ¶y", path: "istanbul/cekmekoy" },
    { slug: "arnavutkoy-escort-drkcnay1-v", district: "ArnavutkÃ¶y", path: "istanbul/arnavutkoy" },
    { slug: "basaksehir-escort-drkcnay1-v", district: "BaÅŸakÅŸehir", path: "istanbul/basaksehir" },
    { slug: "esenler-escort-drkcnay1-v", district: "Esenler", path: "istanbul/esenler" },
    { slug: "adalar-escort-drkcnay1-v", district: "Adalar", path: "istanbul/adalar" },
    { slug: "silivriescort-drkcnay2026", district: "Silivri", path: "istanbul/silivri" },
    { slug: "beyoglu-escort-drkcnay1-v", district: "BeyoÄŸlu", path: "istanbul/beyoglu" }
  ];

  for (const item of CUSTOM_SITES) {
    const districtFileName = `${item.slug}.html`;
    const districtTitle = `${item.district} Escort | ${item.district} Eskort Bayan Ä°lanlarÄ±`;
    const vCode = GSC_VERIFICATIONS[pathCounter % GSC_VERIFICATIONS.length];
    const geminiText = await callGemini(item.district, "");

    const html1 = generateGoogleSitesHTML("Ä°stanbul", item.district, pathCounter, 1, districtTitle, vCode, geminiText, item.path);
    const html2 = generateGoogleSitesHTML("Ä°stanbul", item.district, pathCounter, 2, districtTitle, vCode, geminiText, item.path);
    const html3 = generateGoogleSitesHTML("Ä°stanbul", item.district, pathCounter, 3, districtTitle, vCode, geminiText, item.path);
    const html4 = generateGoogleSitesHTML("Ä°stanbul", item.district, pathCounter, 4, districtTitle, vCode, geminiText, item.path);
    const html5 = generateGoogleSitesHTML("Ä°stanbul", item.district, pathCounter, 5, districtTitle, vCode, geminiText, item.path);

    fs.writeFileSync(path.join(v1Dir, districtFileName), html1);
    fs.writeFileSync(path.join(v2Dir, districtFileName), html2);
    fs.writeFileSync(path.join(v3Dir, districtFileName), html3);
    fs.writeFileSync(path.join(v4Dir, districtFileName), html4);
    fs.writeFileSync(path.join(v5Dir, districtFileName), html5);

    pathCounter++;
  }

  const notepadPath = path.join(OUTPUT_DIR, 'google-sites-setup-directory.txt');
  fs.writeFileSync(notepadPath, notepadContent);

  console.log(`-- AMP Cache Optimized (Anti-Duplicate v16) --`);
  console.log(`âœ… Successfully generated ${pathCounter} locations * 5 versions = ${pathCounter * 5} HTML pages inside version subfolders.`);
  console.log(`ğŸ“ Created comprehensive notepad directory at: ${notepadPath}`);
}

if (require.main === module) {
  buildGoogleSitesPayloads().catch(console.error);
}

