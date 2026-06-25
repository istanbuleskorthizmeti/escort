import axios from 'axios';

async function run() {
  const token = process.env.GITHUB_TOKEN || '';
  const owner = 'istanbuleskorthizmeti';
  const repo = 'eskortguvenlik';
  
  try {
    console.log("Fetching workflow runs from GitHub...");
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/runs`;
    const res = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    console.log("Total runs found:", res.data.total_count);
    const runs = res.data.workflow_runs || [];
    for (let i = 0; i < Math.min(runs.length, 5); i++) {
      const run = runs[i];
      console.log(`Run #${run.run_number} (${run.name})`);
      console.log(`  Event: ${run.event}`);
      console.log(`  Status: ${run.status}`);
      console.log(`  Conclusion: ${run.conclusion}`);
      console.log(`  URL: ${run.html_url}`);
      console.log("------------------------");
    }
  } catch (err: any) {
    console.error("Error fetching runs:", err.response ? err.response.data : err.message);
  }
}

run();
