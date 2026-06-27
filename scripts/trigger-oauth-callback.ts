import axios from 'axios';

async function run() {
  const url = "http://127.0.0.1:61751/?code=45bbdb051f09ae7b7de4&state=44487606ac7849279993528d8944bcbe";
  console.log(`Sending GET request to local callback: ${url}`);
  try {
    const res = await axios.get(url);
    console.log("Status:", res.status);
    console.log("Response headers:", res.headers);
    console.log("Response body:", res.data);
  } catch (err: any) {
    console.error("Error making request:", err.message);
  }
}

run();
