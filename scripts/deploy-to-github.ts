
import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

async function deployParasite(folderName: string) {
  // ASCII Slugify for GitHub
  const slug = folderName.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9-]/g, '-');
    
  const repoName = `drkcnay-${slug}`;
  console.log(`🚀 [CLOUD] Deploying ${folderName} to GitHub: ${repoName}...`);

  try {
    // Get authenticated user
    const { data: user } = await octokit.users.getAuthenticated();
    const owner = user.login;

    // Create repo
    await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      private: false,
      auto_init: true
    }).catch(() => console.log(`ℹ️ Repo ${repoName} already exists.`));

    // Wait for GitHub to initialize the repo
    await new Promise(r => setTimeout(r, 2000));

    const projectPath = path.join(process.cwd(), 'parasite_hub', folderName);
    const files = fs.readdirSync(projectPath);

    for (const fileName of files) {
      const filePath = path.join(projectPath, fileName);
      if (fs.lstatSync(filePath).isDirectory()) continue;

      const content = fs.readFileSync(filePath).toString('base64');
      
      // Get file SHA if exists
      let sha: string | undefined;
      try {
        const { data: fileData } = await octokit.repos.getContent({
          owner,
          repo: repoName,
          path: fileName
        });
        if (!Array.isArray(fileData)) sha = fileData.sha;
      } catch (e) {}

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path: fileName,
        message: '🧛‍♂️ Hydra Cloud Infusion',
        content: content,
        sha: sha
      });
    }

    console.log(`✅ [SUCCESS] https://github.com/guondyshop-del/${repoName}`);
  } catch (err: any) {
    console.error(`❌ Deployment Failed for ${folderName}:`, err.message);
  }
}

(async () => {
  const folders = fs.readdirSync(path.join(process.cwd(), 'parasite_hub')).filter(f => fs.lstatSync(path.join(process.cwd(), 'parasite_hub', f)).isDirectory());
  for (const folder of folders) {
    await deployParasite(folder);
  }
})();
