import axios from 'axios';

async function checkBranch(branch: string) {
  const token = process.env.GITHUB_TOKEN || '';
  const owner = 'istanbuleskorthizmeti';
  const repo = 'eskortguvenlik';
  
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}`;
    const res = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    console.log(`Branch: ${branch}`);
    if (res.data.length > 0) {
      const commit = res.data[0];
      console.log(`  Commit SHA: ${commit.sha}`);
      console.log(`  Author: ${commit.commit.author.name} <${commit.commit.author.email}>`);
      console.log(`  Date: ${commit.commit.author.date}`);
      console.log(`  Message: ${commit.commit.message}`);
    } else {
      console.log("  No commits found.");
    }
  } catch (err: any) {
    console.error(`Error checking branch ${branch}:`, err.response ? err.response.data : err.message);
  }
}

async function run() {
  await checkBranch('v1.0');
  await checkBranch('main');
}

run();
