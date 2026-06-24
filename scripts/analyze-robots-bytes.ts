import axios from 'axios';

async function analyzeBytes() {
  const url = 'https://istanbul-eskort-hizmeti.readme.io/robots.txt';
  try {
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      }
    });
    const buffer = Buffer.from(res.data);
    console.log(`Raw byte length: ${buffer.length}`);
    console.log(`Hex Representation:`);
    console.log(buffer.toString('hex'));
    console.log(`\nASCII Representation:`);
    console.log(buffer.toString('ascii'));
    
    // Check for BOM
    if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
      console.log("\n⚠️ WARNING: UTF-8 BOM detected!");
    } else {
      console.log("\nNo UTF-8 BOM detected.");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

analyzeBytes();
