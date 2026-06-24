import axios from 'axios';

const API_KEY = 'rdme_xn8s9h65127df9243b79abce5c172c8b13db7518c2d129598202c2d646dc2fda0d111b';

async function run() {
  console.log("Checking categories for first project (istanbul-escort)...");
  const authHeader = 'Basic ' + Buffer.from(API_KEY + ':').toString('base64');
  
  try {
    const res = await axios.get('https://dash.readme.com/api/v1/categories', {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });
    console.log("SUCCESS! Categories:", res.data.map((c: any) => ({ title: c.title, slug: c.slug })));
  } catch (err: any) {
    console.error("FAILED! Status:", err.response?.status);
    console.error("Data:", err.response?.data);
  }
}

run();
