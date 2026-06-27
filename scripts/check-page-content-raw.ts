import axios from 'axios';

async function run() {
  const url = "https://istanbul-eskort-hizmeti.readme.io/docs/istanbul-escort";
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = res.data;
    console.log("HTML length:", html.length);
    console.log("Contains 'Unable to render content'?", html.includes('Unable to render content'));
    console.log("Contains 'not renderable with the MDXish renderer'?", html.includes('not renderable with the MDXish renderer'));
    
    // Log a few lines around where it might be
    const index = html.indexOf('Unable to render');
    if (index !== -1) {
      console.log("Snippet around error:");
      console.log(html.substring(index - 100, index + 300));
    } else {
      console.log("No rendering error found in HTML!");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
