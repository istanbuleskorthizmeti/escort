import axios from 'axios';

async function run() {
  const token = process.env.GITHUB_TOKEN || '';
  const owner = 'istanbuleskorthizmeti';
  const repo = 'eskortguvenlik';
  
  try {
    console.log("Fetching webhooks from GitHub repository...");
    const url = `https://api.github.com/repos/${owner}/${repo}/hooks`;
    const res = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    console.log("Webhooks found:", res.data.length);
    for (const hook of res.data) {
      console.log(`Hook ID: ${hook.id}`);
      console.log(`Name: ${hook.name}`);
      console.log(`Active: ${hook.active}`);
      console.log(`Config:`, hook.config);
      console.log(`Events:`, hook.events);
      console.log(`Last Response:`, hook.last_response);
      console.log("------------------------");
    }
  } catch (err: any) {
    console.error("Error fetching webhooks:", err.response ? err.response.data : err.message);
  }
}

run();
