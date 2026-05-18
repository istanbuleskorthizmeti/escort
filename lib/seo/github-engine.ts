import { Octokit } from "@octokit/rest";
import { generateGodModeOmniContent } from '@/lib/ai-seo';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 💀 GITHUB STRIKER: PARASITE SEO ENGINE (BLACK HAT v4.0)
 * Uses high-authority GitHub Repos/READMEs to inject backlinks.
 * GitHub DA: 96 | Extremely fast indexing.
 */

class GitHubStriker {
  private _octokit: Octokit | null = null;

  private get octokit(): Octokit {
    if (!this._octokit) {
      this._octokit = new Octokit({
        auth: process.env.GITHUB_PAT
      });
    }
    return this._octokit;
  }


  /**
   * Creates or updates an SEO-optimized repository and its README.
   */
  async strike(params: { city: string, district: string, niche: string, targetUrl: string }) {
    const rawName = `${params.city}-${params.district}-${params.niche}-escort`.toLowerCase();
    const repoName = rawName
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i')
      .replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/i̇/g, 'i')
      .replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
    const description = `💎 ${params.city} ${params.district} ${params.niche} Escort Bayanlar | %100 Gerçek Görsel ve Kaporasız Hizmet 2026.`;
    
    console.log(`🚀 [GITHUB-STRIKER] Initiating strike on: ${repoName}`);

    try {
      // 1. Create Repository (if not exists)
      try {
        await this.octokit.repos.createForAuthenticatedUser({
          name: repoName,
          description: description,
          private: false,
          has_issues: false,
          has_projects: false,
          has_wiki: false
        });
        console.log(`✅ [GITHUB] Repo created: ${repoName}`);
      } catch (e: any) {
        if (e.status === 422) {
          console.log(`ℹ️ [GITHUB] Repo already exists: ${repoName}`);
        } else {
          throw e;
        }
      }

      // 2. Generate Nuclear Content
      const aiContent = await generateGodModeOmniContent({
        city: params.city,
        district: params.district,
        category: params.niche,
        host: 'github.com',
        nicheType: 'Premium Escort'
      });

      const readmeContent = `
# ${params.city} ${params.district} ${params.niche} Escort Bayanlar 💎

${aiContent.wordpress.content}

## 🌹 REZERVASYON VE İLETİŞİM
En güncel katalog ve %100 gerçek resimli profiller için ana sitemizi ziyaret edin:

🚀 **[TIKLA VE GÖRÜŞMEYE BAŞLA](${params.targetUrl})**

---
### Etiketler
#${params.city.replace(/ /g, '')} #escort #vip #kaporasız #istanbul #partner
      `.trim();

      // 3. Create or Update README.md
      const owner = (await this.octokit.users.getAuthenticated()).data.login;
      
      let sha: string | undefined;
      try {
        const { data } = await this.octokit.repos.getContent({
          owner,
          repo: repoName,
          path: 'README.md'
        });
        if (!Array.isArray(data)) sha = data.sha;
      } catch (e) {}

      await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path: 'README.md',
        message: `🔥 Update SEO Matrix: ${params.city} ${params.district}`,
        content: Buffer.from(readmeContent).toString('base64'),
        sha
      });

      console.log(`✅ [GITHUB] README.md strike complete for ${repoName}`);
      return `https://github.com/${owner}/${repoName}`;

    } catch (error: any) {
      console.error(`❌ [GITHUB ERROR] Strike failed:`, error.message);
      throw error;
    }
  }
}

export const gitHubStriker = new GitHubStriker();
