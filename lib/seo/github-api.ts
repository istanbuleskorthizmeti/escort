import axios from 'axios';
import { ProxyHandler } from './proxy-handler';

/**
 * DRKCNAY ELITE: GitHub REST API Engine (DR 100 Backlinks)
 * Automatically creates repositories, commits markdown files, and generates Gists.
 */
export class GitHubAPI {
  private static get token() { return process.env.GITHUB_TOKEN || process.env.GITHUB_PAT; }
  private static get username() { return process.env.GITHUB_USERNAME || 'dorukcanay-digital'; }

  private static getHeaders() {
    return {
      'Authorization': `token ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'DRKCNAYElite-Bot/1.0'
    };
  }

  /**
   * Pushes a markdown file directly to a specified GitHub repository.
   */
  static async pushMarkdownFile(repoName: string, path: string, content: string, message: string = "SEO Content Sync"): Promise<string | null> {
    if (!this.token || !this.username) {
      console.warn('⚠️ [GITHUB-API] Missing GITHUB_TOKEN or GITHUB_USERNAME');
      return null;
    }

    try {
      // 1. Check if repo exists and create if not
      const repoCheck = await ProxyHandler.proxyFetch(`https://api.github.com/repos/${this.username}/${repoName}`, {
        method: 'GET',
        headers: this.getHeaders()
      }, true);
      
      if (repoCheck.status === 404) {
        console.log(`[GITHUB] Repo ${repoName} not found. Creating...`);
        try {
          const createRes = await ProxyHandler.proxyFetch(`https://api.github.com/user/repos`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
              name: repoName,
              description: "DRKCNAY SEO Matrix Network",
              private: false,
              auto_init: true
            })
          }, true);
          
          if (createRes.ok) {
            console.log(`✅ [GITHUB] Repo ${repoName} created successfully.`);
            // Wait a brief moment for GitHub to initialize it
            await new Promise(res => setTimeout(res, 5000));
          } else {
            const errorDump = await createRes.text();
            console.error(`❌ [GITHUB] Failed to create repo. Status: ${createRes.status}. Details: ${errorDump}`);
          }
        } catch (createErr: any) {
          console.error(`❌ [GITHUB] Exception creating repo: ${createErr.message}`);
        }
      }


      const url = `https://api.github.com/repos/${this.username}/${repoName}/contents/${path}`;
      
      // 2. Base64 encode the content
      const contentEncoded = Buffer.from(content).toString('base64');
      
      // 3. Check if file already exists to get its SHA (needed for updates)
      let sha = undefined;
      try {
        // Using our proxy fetcher to avoid IP bans on mass requests
        const getRes = await ProxyHandler.proxyFetch(url, {
          method: 'GET',
          headers: this.getHeaders()
        }, true);
        
        if (getRes.ok) {
          const fileData = await getRes.json();
          sha = fileData.sha;
        }
      } catch (e) {
        // File doesn't exist yet, which is fine
      }

      // 4. Create or update the file
      const payload = {
        message: message,
        content: contentEncoded,
        ...(sha && { sha })
      };

      const putRes = await ProxyHandler.proxyFetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      }, true);

      if (putRes.ok) {
        const result = await putRes.json();
        console.log(`✅ [GITHUB] Successfully pushed ${path} to ${repoName}`);
        return result.content?.html_url || `https://github.com/${this.username}/${repoName}/blob/main/${path}`;
      } else {
        const errText = await putRes.text();
        console.error(`❌ [GITHUB] Failed to push file: ${putRes.status}. Details: ${errText.substring(0, 500)}`);
        return null;
      }
    } catch (error: any) {
      console.error(`🔥 [GITHUB] Exception in pushMarkdownFile: ${error.message}`);
      return null;
    }
  }

  /**
   * Creates a public GitHub Gist (Excellent for indexation)
   */
  static async createGist(filename: string, content: string, description: string): Promise<string | null> {
    if (!this.token) return null;

    try {
      const url = `https://api.github.com/gists`;
      const payload = {
        description: description,
        public: true,
        files: {
          [filename]: {
            content: content
          }
        }
      };

      const res = await ProxyHandler.proxyFetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      }, true);

      if (res.ok) {
        const data = await res.json();
        console.log(`✅ [GITHUB] Successfully created Gist: ${data.html_url}`);
        return data.html_url;
      } else {
         return null;
      }
    } catch (error) {
      return null;
    }
  }
}
