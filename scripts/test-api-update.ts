import dotenv from 'dotenv';
dotenv.config();

const API_KEY = 'rdme_xn8s9h65127df9243b79abce5c172c8b13db7518c2d129598202c2d646dc2fda0d111b';

async function run() {
  console.log("🚀 Testing ReadMe API Update for istanbul-escort...");

  const payload = {
    integrations: {
      google: {
        analytics: "G-TJ3T8823ZP"
      }
    }
  };

  try {
    const res = await fetch('https://api.readme.com/v2/projects/me', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response data:", JSON.stringify(data, null, 2));

  } catch (err: any) {
    console.error("❌ API Error:", err.message);
  }
}

run().catch(console.error);
