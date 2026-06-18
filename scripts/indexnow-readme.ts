import * as https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const INDEX_NOW_KEY = process.env.INDEX_NOW_KEY || "8771e07e4e31024024720e4a348e10f0";
const readmeSubdomain = process.env.README_SUBDOMAIN || "istanbul-escort";
const readmeBaseUrl = `https://${readmeSubdomain}.readme.io`;

const istanbulDistricts = [
  'besiktas', 'sisli', 'beylikduzu', 'kadikoy', 'bakirkoy', 
  'atasehir', 'esenyurt', 'fatih', 'bagcilar', 'bahcelievler',
  'umraniye', 'pendik', 'maltepe', 'kartal', 'sariyer', 
  'uskudar', 'avcilar', 'cekmekoy', 'tuzla', 'arnavutkoy', 
  'gaziosmanpasa', 'sultanbeyli', 'güngören', 'zeytinburnu', 
  'sile', 'catalca', 'silivri', 'buyukcekmece', 'kucukcekmece', 
  'adalar', 'bayrampasa', 'sultangazi'
];

const neighborhoodsMap: { [key: string]: string[] } = {
  adalar: ['burgazada', 'buyukada', 'heybeliada', 'kinaliada'],
  arnavutkoy: ['anadolu', 'bogazkoy', 'bolluca', 'hadimkoy', 'haracci', 'imrahor', 'karaburun', 'tasoluk'],
  atasehir: ['barbaros', 'esatpasa', 'ferhatpasa', 'icerenkoy', 'kayisdagi', 'kucukbakkalkoy', 'mustafa-kemal', 'ornek', 'yenisahra'],
  avcilar: ['ambarli', 'cihangir', 'denizkoskler', 'firuzkoy', 'gumuspala', 'mustafa-kemalpasa', 'parseller', 'tahtakale', 'universite'],
  bagcilar: ['barbaros', 'demirkapi', 'evren', 'gunesli', 'hurriyet', 'kemalpasa', 'kirazli', 'mahmutbey', 'yavuz-selim', 'yuzyil'],
  bahcelievler: ['cobancesme', 'fevzi-cakmak', 'hurriyet', 'kocasinan', 'sahintepe', 'sirinevler', 'soğanli', 'yenibosna', 'zafer'],
  bakirkoy: ['atakoy', 'florya', 'kartaltepe', 'yesilkoy', 'yesilyurt', 'zeytinlik', 'zuhuratbaba'],
  basaksehir: ['bahcesehir', 'guvercintepe', 'ikitelisorganizesanayi', 'kayasehir', 'sahintepe', 'samlar', 'ziya-gokalp'],
  bayrampasa: ['altintepsi', 'cevatedpa', 'kartaltepe', 'muratpasa', 'ortamahalle', 'terazidere', 'vatan', 'yenidogan', 'yildirim'],
  besiktas: ['abbasağa', 'akatlar', 'arnavutkoy', 'balmumcu', 'bebek', 'cihannuma', 'dikilitas', 'etiler', 'gayrettepe', 'konaklar', 'kurucesme', 'ortakoy', 'sinanpasa', 'turkali', 'ulus', 'visnezade', 'yildiz'],
  beykoz: ['acarkent', 'anadoluhisari', 'kavacik', 'ortacesme', 'pasabahce', 'polonezkoy', 'soğuksu', 'tokatkoy'],
  beylikduzu: ['adnan-kahveci', 'baris', 'beylikduzu', 'cumhuriyet', 'dereagzi', 'gurpinar', 'kavakli', 'marmara', 'sahil', 'yakuplu'],
  beyoglu: ['cihangir', 'galata', 'halicioglu', 'istiklal', 'karakoy', 'kasimpasa', 'okmeydani', 'sutluce', 'taksim'],
  buyukcekmece: ['alkent2000', 'celaliye', 'kumburgaz', 'mimaroba', 'sinanoba', 'tepekent', 'turkoba'],
  catalca: ['binkilic', 'karacakoy', 'kestanelik'],
  cekmekoy: ['alemdağ', 'mimar-sinan', 'omerli', 'tasdelen'],
  esenler: ['birlik', 'havaalani', 'karabayir', 'menderes', 'oruc-reis', 'turgut-reis', 'ucyuzlu'],
  esenyurt: ['akcedpa', 'ardicli', 'haramidere', 'mehtercesme', 'saadetdere', 'tabelalarkavsaği', 'talatpasa', 'yeşilyurt'],
  fatih: ['aksaray', 'balat', 'beyazit', 'carşamba', 'cerrahpasa', 'cukurbostan', 'eminonu', 'fener', 'findikzade', 'haseki', 'karagumruk', 'kocamustafapasa', 'laleli', 'samatya', 'sehremini', 'vefa', 'yedikule'],
  gaziosmanpasa: ['50-yil', 'barbaros', 'hurgoren', 'karadeniz', 'karlitepe', 'kucukkoy', 'yildiztabya'],
  gungoren: ['haznedar', 'merter', 'tozkoparan'],
  kadikoy: ['acibadem', 'bostanci', 'caddebostan', 'caferağa', 'erenkoy', 'feneryolu', 'fikirtepe', 'goztepe', 'kosuyolu', 'kozyataği', 'moda', 'merdivenkoy', 'sahrayicedid', 'suadiye'],
  kagithane: ['celaltepe', 'gultepe', 'seyrantepe', 'sirintepe', 'talatpasa'],
  kartal: ['atalar', 'dragos', 'esentepe', 'soğanlik', 'topselvi', 'yakacik'],
  kucukcekmece: ['atakent', 'cennet', 'halkali', 'ikizler', 'kanarya', 'sefakoy', 'sogutlucesme', 'tepeustu', 'yarimburgaz'],
  maltepe: ['altintepe', 'aydinevler', 'basibuyuk', 'idealtepe', 'kucukyali', 'surey野apaji', 'zumrutevler'],
  pendik: ['guzelyali', 'kaynarca', 'kurtkoy', 'sapanbağlari', 'seyhli', 'velibaba', 'yenisehir'],
  sancaktepe: ['ortadağ', 'samandira', 'sarigazi', 'yenidogan'],
  sariyer: ['bahcekoy', 'baltalimani', 'emirgan', 'istinye', 'kilyos', 'maden', 'maslak', 'reşitpasa', 'tarabya', 'yenikoy', 'zekeriyakoy'],
  silivri: ['selimpasa', 'gumuqyaka'],
  sultanbeyli: ['battalgazi', 'hasanpasa', 'mimarsinan'],
  sultangazi: ['cebeci', 'esentepe', 'gazi', 'habibler', 'sultanciftligi', 'ugur-mumcu', 'yayla', 'zubeyde-hanim'],
  sisli: ['bomonti', 'ferikoy', 'fulya', 'harbiye', 'kurtulus', 'mecidiyekoy', 'nisantasi', 'okmeydani', 'tesvikiye'],
  tuzla: ['aydinli', 'cami', 'evliya-celebi', 'icmeler', 'istasyon', 'mimar-sinan', 'postane', 'sifa', 'tepeoren', 'yayla'],
  umraniye: ['altinsehir', 'armaganevler', 'atakent', 'cakmak', 'esenevler', 'istiklal', 'ihlamurkuyu', 'saray', 'serifali', 'tatlisu'],
  uskudar: ['acibadem', 'altunizade', 'beylerbeyi', 'bulgurlu', 'cengelkoy', 'kandilli', 'kucuksu', 'kuzguncuk', 'unalan', 'yavuzturk'],
  zeytinburnu: ['bestelsiz', 'gokalp', 'kazlicesme', 'merkezefendi', 'nuripasa', 'seyitnizam', 'sumer', 'telsiz', 'veliefendi', 'yesiltepe']
};

function submitBulkIndexNow(host: string, urls: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const payload = JSON.stringify({
        host: host,
        key: INDEX_NOW_KEY,
        urlList: urls
      });

      const options = {
        hostname: 'api.indexnow.org',
        port: 443,
        path: '/indexnow',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 10000
      };

      const req = https.request(options, (res) => {
        console.log(`📡 IndexNow status: ${res.statusCode} (${res.statusMessage})`);
        resolve(res.statusCode === 200 || res.statusCode === 202);
      });

      req.on('error', (err) => {
        console.error('❌ IndexNow Connection error:', err.message);
        resolve(false);
      });

      req.write(payload);
      req.end();
    } catch (e) {
      resolve(false);
    }
  });
}

async function run() {
  console.log(`🚀 Loading all 406 ReadMe.io URLs for IndexNow submission...`);
  
  const urls: string[] = [];

  // 0. Main Landing Page
  urls.push(`${readmeBaseUrl}/docs/istanbul-escort`);
  
  // 1. Districts
  istanbulDistricts.forEach(dist => {
    urls.push(`${readmeBaseUrl}/docs/istanbul-${dist}-escort`);
  });

  // 2. Neighborhoods
  Object.keys(neighborhoodsMap).forEach(dist => {
    const neighborhoods = neighborhoodsMap[dist];
    neighborhoods.forEach(neigh => {
      urls.push(`${readmeBaseUrl}/docs/istanbul-${dist}-${neigh}-escort`);
    });
  });

  console.log(`📋 Total URLs loaded: ${urls.length}`);
  console.log(`📡 Submitting URLs to IndexNow API via POST...`);

  const host = `${readmeSubdomain}.readme.io`;
  const success = await submitBulkIndexNow(host, urls);
  
  if (success) {
    console.log(`🎉 IndexNow Bulk Submission Success!`);
  } else {
    console.error(`❌ IndexNow Bulk Submission Failed.`);
  }
}

run().catch(console.error);
