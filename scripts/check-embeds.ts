import axios from 'axios';
import * as cheerio from 'cheerio';

const checkUrls = [
  "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/istanbul-escort/ana-sayfa",
  "https://sites.google.com/dorukcanay.digital/sancaktepe-escort-drkcnay1-v/ana-sayfa"
];

async function runCheck() {
  for (const url of checkUrls) {
    try {
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);
      const iframes = $('iframe').length;
      console.log(`URL: ${url} -> Found ${iframes} iframe(s).`);
    } catch (e: any) {
      console.error(`Error checking ${url}: ${e.message}`);
    }
  }
}

runCheck();
