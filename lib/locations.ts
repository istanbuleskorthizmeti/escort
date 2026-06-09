export interface Neighborhood {
  name: string;
  slug: string;
  type?: "neighborhood" | "village" | "township";
  coordinates?: { lat: number; lng: number };
}

export interface Landmark {
  name: string;
  slug: string;
  category: "Hotel" | "Mall" | "Business" | "Historic" | "Park";
  description?: string;
  coordinates?: { lat: number; lng: number };
}

export interface District {
  name: string;
  slug: string;
  neighborhoods: Neighborhood[];
  landmarks?: Landmark[];
  coordinates?: { lat: number; lng: number };
}

export interface City {
  name: string;
  slug: string;
  districts: District[];
  landmarks?: Landmark[];
}

import { adanaCity } from "./locations-registry/adana";
import { adiyamanCity } from "./locations-registry/adiyaman";
import { afyonkarahisarCity } from "./locations-registry/afyonkarahisar";
import { agriCity } from "./locations-registry/agri";
import { aksarayCity } from "./locations-registry/aksaray";
import { amasyaCity } from "./locations-registry/amasya";
import { ankaraCity } from "./locations-registry/ankara";
import { antalyaCity } from "./locations-registry/antalya";
import { ardahanCity } from "./locations-registry/ardahan";
import { artvinCity } from "./locations-registry/artvin";
import { aydinCity } from "./locations-registry/aydin";
import { balikesirCity } from "./locations-registry/balikesir";
import { bartinCity } from "./locations-registry/bartin";
import { batmanCity } from "./locations-registry/batman";
import { bayburtCity } from "./locations-registry/bayburt";
import { bilecikCity } from "./locations-registry/bilecik";
import { bingolCity } from "./locations-registry/bingol";
import { bitlisCity } from "./locations-registry/bitlis";
import { boluCity } from "./locations-registry/bolu";
import { burdurCity } from "./locations-registry/burdur";
import { bursaCity } from "./locations-registry/bursa";
import { canakkaleCity } from "./locations-registry/canakkale";
import { cankiriCity } from "./locations-registry/cankiri";
import { corumCity } from "./locations-registry/corum";
import { denizliCity } from "./locations-registry/denizli";
import { diyarbakirCity } from "./locations-registry/diyarbakir";
import { duzceCity } from "./locations-registry/duzce";
import { edirneCity } from "./locations-registry/edirne";
import { elazigCity } from "./locations-registry/elazig";
import { erzincanCity } from "./locations-registry/erzincan";
import { erzurumCity } from "./locations-registry/erzurum";
import { eskisehirCity } from "./locations-registry/eskisehir";
import { gaziantepCity } from "./locations-registry/gaziantep";
import { giresunCity } from "./locations-registry/giresun";
import { gumushaneCity } from "./locations-registry/gumushane";
import { hakkariCity } from "./locations-registry/hakkari";
import { hatayCity } from "./locations-registry/hatay";
import { igdirCity } from "./locations-registry/igdir";
import { ispartaCity } from "./locations-registry/isparta";
import { istanbulCity } from "./locations-registry/istanbul";
import { izmirCity } from "./locations-registry/izmir";
import { kahramanmarasCity } from "./locations-registry/kahramanmaras";
import { karabukCity } from "./locations-registry/karabuk";
import { karamanCity } from "./locations-registry/karaman";
import { karsCity } from "./locations-registry/kars";
import { kastamonuCity } from "./locations-registry/kastamonu";
import { kayseriCity } from "./locations-registry/kayseri";
import { kilisCity } from "./locations-registry/kilis";
import { kirikkaleCity } from "./locations-registry/kirikkale";
import { kirklareliCity } from "./locations-registry/kirklareli";
import { kirsehirCity } from "./locations-registry/kirsehir";
import { kocaeliCity } from "./locations-registry/kocaeli";
import { konyaCity } from "./locations-registry/konya";
import { kutahyaCity } from "./locations-registry/kutahya";
import { malatyaCity } from "./locations-registry/malatya";
import { manisaCity } from "./locations-registry/manisa";
import { mardinCity } from "./locations-registry/mardin";
import { mersinCity } from "./locations-registry/mersin";
import { muglaCity } from "./locations-registry/mugla";
import { musCity } from "./locations-registry/mus";
import { nevsehirCity } from "./locations-registry/nevsehir";
import { nigdeCity } from "./locations-registry/nigde";
import { orduCity } from "./locations-registry/ordu";
import { osmaniyeCity } from "./locations-registry/osmaniye";
import { rizeCity } from "./locations-registry/rize";
import { sakaryaCity } from "./locations-registry/sakarya";
import { samsunCity } from "./locations-registry/samsun";
import { sanliurfaCity } from "./locations-registry/sanliurfa";
import { siirtCity } from "./locations-registry/siirt";
import { sinopCity } from "./locations-registry/sinop";
import { sirnakCity } from "./locations-registry/sirnak";
import { sivasCity } from "./locations-registry/sivas";
import { tekirdagCity } from "./locations-registry/tekirdag";
import { tokatCity } from "./locations-registry/tokat";
import { trabzonCity } from "./locations-registry/trabzon";
import { tunceliCity } from "./locations-registry/tunceli";
import { usakCity } from "./locations-registry/usak";
import { vanCity } from "./locations-registry/van";
import { yalovaCity } from "./locations-registry/yalova";
import { yozgatCity } from "./locations-registry/yozgat";
import { zonguldakCity } from "./locations-registry/zonguldak";

import { DOMAIN_MATRIX } from "../config/domains";

export const cities: Record<string, City> = {
  "adana": adanaCity,
  "adiyaman": adiyamanCity,
  "afyonkarahisar": afyonkarahisarCity,
  "agri": agriCity,
  "aksaray": aksarayCity,
  "amasya": amasyaCity,
  "ankara": ankaraCity,
  "antalya": antalyaCity,
  "ardahan": ardahanCity,
  "artvin": artvinCity,
  "aydin": aydinCity,
  "balikesir": balikesirCity,
  "bartin": bartinCity,
  "batman": batmanCity,
  "bayburt": bayburtCity,
  "bilecik": bilecikCity,
  "bingol": bingolCity,
  "bitlis": bitlisCity,
  "bolu": boluCity,
  "burdur": burdurCity,
  "bursa": bursaCity,
  "canakkale": canakkaleCity,
  "cankiri": cankiriCity,
  "corum": corumCity,
  "denizli": denizliCity,
  "diyarbakir": diyarbakirCity,
  "duzce": duzceCity,
  "edirne": edirneCity,
  "elazig": elazigCity,
  "erzincan": erzincanCity,
  "erzurum": erzurumCity,
  "eskisehir": eskisehirCity,
  "gaziantep": gaziantepCity,
  "giresun": giresunCity,
  "gumushane": gumushaneCity,
  "hakkari": hakkariCity,
  "hatay": hatayCity,
  "igdir": igdirCity,
  "isparta": ispartaCity,
  "istanbul": istanbulCity,
  "izmir": izmirCity,
  "kahramanmaras": kahramanmarasCity,
  "karabuk": karabukCity,
  "karaman": karamanCity,
  "kars": karsCity,
  "kastamonu": kastamonuCity,
  "kayseri": kayseriCity,
  "kilis": kilisCity,
  "kirikkale": kirikkaleCity,
  "kirklareli": kirklareliCity,
  "kirsehir": kirsehirCity,
  "kocaeli": kocaeliCity,
  "konya": konyaCity,
  "kutahya": kutahyaCity,
  "malatya": malatyaCity,
  "manisa": manisaCity,
  "mardin": mardinCity,
  "mersin": mersinCity,
  "mugla": muglaCity,
  "mus": musCity,
  "nevsehir": nevsehirCity,
  "nigde": nigdeCity,
  "ordu": orduCity,
  "osmaniye": osmaniyeCity,
  "rize": rizeCity,
  "sakarya": sakaryaCity,
  "samsun": samsunCity,
  "sanliurfa": sanliurfaCity,
  "siirt": siirtCity,
  "sinop": sinopCity,
  "sirnak": sirnakCity,
  "sivas": sivasCity,
  "tekirdag": tekirdagCity,
  "tokat": tokatCity,
  "trabzon": trabzonCity,
  "tunceli": tunceliCity,
  "usak": usakCity,
  "van": vanCity,
  "yalova": yalovaCity,
  "yozgat": yozgatCity,
  "zonguldak": zonguldakCity,
};

export function getCitiesForHost(host: string): Record<string, City> {
  const domainConfig = DOMAIN_MATRIX.find(d => host.includes(d.host));
  
  if (!domainConfig) return { "istanbul": istanbulCity };

  // 🔱 MAIN DOMAINS: Access all 81 cities
  if (domainConfig.role === 'MONEY_SITE') {
    return cities;
  }

  // 📡 SATELLITE DOMAINS: Only access their target city
  if (domainConfig.targetCity) {
    const target = domainConfig.targetCity.toLowerCase();
    if (cities[target]) {
      return { [target]: cities[target] };
    }
  }

  // Fallback
  return { "istanbul": istanbulCity };
}