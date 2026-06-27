import axios from 'axios';

async function check(url: string) {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = res.data;
    console.log(`URL: ${url}`);
    console.log("HTML length:", html.length);
    console.log("Contains 'Unable to render content'?", html.includes('Unable to render content'));
    console.log("Contains 'not renderable with the MDXish renderer'?", html.includes('not renderable with the MDXish renderer'));
  } catch (err: any) {
    console.error(`Error for ${url}:`, err.message);
  }
}

async function run() {
  await check("https://istanbul-escort.readme.io/docs/istanbul-adalar-burgazada-escort");
  await check("https://istanbul-escort.readme.io/docs/istanbul-adalar-buyukada-escort");
}

run();
