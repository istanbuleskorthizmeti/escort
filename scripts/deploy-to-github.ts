
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

    // Enable GitHub Pages for this repository to resolve the 404 errors
    console.log(`🔧 [PAGES] Enabling GitHub Pages for ${repoName} (main branch)...`);
    try {
      await octokit.repos.createPagesSite({
        owner,
        repo: repoName,
        source: {
          branch: 'main',
          path: '/'
        }
      });
      console.log(`✅ [PAGES SUCCESS] GitHub Pages enabled for ${repoName}`);
    } catch (pagesErr: any) {
      // If pages site already exists, ignore
      if (pagesErr.status === 409 || pagesErr.message?.includes('already exists')) {
        console.log(`ℹ️ GitHub Pages is already active for ${repoName}.`);
      } else {
        console.warn(`⚠️ Failed to enable Pages directly for ${repoName}:`, pagesErr.message);
      }
    }

    console.log(`✅ [SUCCESS] https://${owner}.github.io/${repoName}`);
  } catch (err: any) {
    console.error(`❌ Deployment Failed for ${folderName}:`, err.message);
  }
}


async function deployRootPortal(owner: string) {
  const repoName = `${owner.toLowerCase()}.github.io`;
  console.log(`🚀 [CLOUD] Deploying ROOT PORTAL to GitHub: ${repoName}...`);

  try {
    // Create root repo if it does not exist
    await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      private: false,
      auto_init: true
    }).catch(() => console.log(`ℹ️ Root Repo ${repoName} already exists.`));

    await new Promise(r => setTimeout(r, 2000));

    const rootIndexPath = path.join(process.cwd(), 'parasite_hub', 'index.html');
    if (!fs.existsSync(rootIndexPath)) {
      console.warn("⚠️ Root index.html not found in parasite_hub. Skipping root deployment.");
      return;
    }

    const content = fs.readFileSync(rootIndexPath).toString('base64');
    let sha: string | undefined;
    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner,
        repo: repoName,
        path: 'index.html'
      });
      if (!Array.isArray(fileData)) sha = fileData.sha;
    } catch (e) {}

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo: repoName,
      path: 'index.html',
      message: '🧛‍♂️ Hydra Root Portal Update',
      content: content,
      sha: sha
    });

    console.log(`🔧 [PAGES] Enabling GitHub Pages for ROOT ${repoName} (main branch)...`);
    try {
      await octokit.repos.createPagesSite({
        owner,
        repo: repoName,
        source: {
          branch: 'main',
          path: '/'
        }
      });
      console.log(`✅ [PAGES SUCCESS] GitHub Pages enabled for root portal.`);
    } catch (pagesErr: any) {
      if (pagesErr.status === 409 || pagesErr.message?.includes('already exists')) {
        console.log(`ℹ️ GitHub Pages is already active for root portal.`);
      } else {
        console.warn(`⚠️ Failed to enable Pages for root portal:`, pagesErr.message);
      }
    }
  } catch (err: any) {
    console.error(`❌ Root Portal Deployment Failed:`, err.message);
  }
}

(async () => {
  try {
    const { data: user } = await octokit.users.getAuthenticated();
    const owner = user.login;

    // Deploy root index.html to owner.github.io first to solve domain 404s
    await deployRootPortal(owner);
    await new Promise(r => setTimeout(r, 3000));

    const folders = fs.readdirSync(path.join(process.cwd(), 'parasite_hub'))
      .filter(f => fs.lstatSync(path.join(process.cwd(), 'parasite_hub', f)).isDirectory())
      .filter(f => !['Bağcılar', 'Beylikdüzü', 'Beşiktaş', 'Beşyol', 'Kadıköy', 'İstanbul', 'Şişli'].includes(f)); 

    console.log(`⚡ Found ${folders.length} district folders to process...`);
    for (const folder of folders) {
      await deployParasite(folder);
      // Adaptive throttling: sleep 2 seconds between repos to avoid secondary API limit checks
      await new Promise(r => setTimeout(r, 2000));
    }
    console.log("🏆 [DEPLOYMENT] All operations complete.");
  } catch (err: any) {
    console.error("❌ Fatal deployment coordinator error:", err.message);
  }
})();

