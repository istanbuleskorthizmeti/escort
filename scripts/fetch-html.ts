import axios from 'axios';

async function run() {
  const url = "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/";
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = res.data;
    
    // Find all occurrences of "G-" followed by uppercase letters and numbers (Google Analytics Measurement IDs)
    const matches = html.match(/G-[A-Z0-9]+/g);
    console.log("Analytics IDs found on page:", matches);
  } catch (err: any) {
    console.error("Fetch failed:", err.message);
  }
}

run();
