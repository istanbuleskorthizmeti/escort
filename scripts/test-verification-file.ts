import axios from 'axios';

async function run() {
  const url = 'https://istanbul-eskort-hizmeti.readme.io/googlec1422bd3f4fe6463.html';
  console.log(`Checking URL: ${url}`);
  try {
    const res = await axios.get(url);
    console.log("Status:", res.status);
    console.log("Headers:", res.headers);
    console.log("Body Content:", res.data);
  } catch (err: any) {
    console.error("Error fetching verification file:", err.message);
    if (err.response) {
      console.error("Response Status:", err.response.status);
      console.error("Response Body:", err.response.data);
    }
  }
}

run().catch(console.error);
