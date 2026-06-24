import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  const key = process.env.README_API_KEY;
  if (!key) {
    console.error("❌ README_API_KEY is not defined in env!");
    return;
  }
  console.log("Using API Key:", key.substring(0, 12) + "...");
  try {
    const res = await fetch('https://api.readme.com/api/v1/categories', {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(key + ':').toString('base64'),
        'Accept': 'application/json'
      }
    });
    console.log("Status:", res.status);
    const body = await res.text();
    console.log("Response body:", body);
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
