
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 🛡️ HYDRA GIST ADAPTER (GITHUB PARASITE)
 * Leverages GitHub Gists (DR 99) for permanent, high-authority backlinks.
 */
export class GistAdapter {
    private static GITHUB_TOKEN = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN;

    static async createGist(filename: string, content: string): Promise<string | null> {
        console.log(`🛡️ [GIST] Creating high-authority payload: ${filename}...`);

        if (!this.GITHUB_TOKEN) {
            console.error("❌ [GIST] GITHUB_TOKEN missing in .env");
            return null;
        }

        try {
            const response = await axios.post(
                'https://api.github.com/gists',
                {
                    description: `Official Hydra Network Authority - ${filename}`,
                    public: true,
                    files: {
                        [filename]: {
                            content: content
                        }
                    }
                },
                {
                    headers: {
                        Authorization: `token ${this.GITHUB_TOKEN}`,
                        Accept: 'application/vnd.github.v3+json'
                    }
                }
            );

            const gistUrl = response.data.html_url;
            console.log(`✅ [GIST] Payload Mapped: ${gistUrl}`);
            return gistUrl;
        } catch (err: any) {
            console.error("❌ [GIST] Error:", err.response?.data || err.message);
            return null;
        }
    }
}
