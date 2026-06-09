import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export interface IndexingResult {
  success: boolean;
  email: string;
  projectId: string;
  error?: string;
}

interface KeyClient {
  fileName: string;
  email: string;
  projectId: string;
  indexingClient: any;
  isExhausted: boolean;
  unauthorizedSites: Set<string>; // Sites where this key is not verified
}

export class IndexingRotator {
  private clients: KeyClient[] = [];
  private currentIdx = 0;

  constructor() {
    this.initializeClients();
  }

  private initializeClients() {
    try {
      const rootDir = process.cwd();
      const files = fs.readdirSync(rootDir);
      const keyFiles = files.filter(f => 
        f.endsWith('.json') && 
        (f.startsWith('google-key') || f.startsWith('hydra-gcp-key'))
      );

      console.log(`🔍 [ROTATOR] Found ${keyFiles.length} potential key files in ${rootDir}`);

      for (const file of keyFiles) {
        try {
          const keyPath = path.join(rootDir, file);
          const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

          if (!keyData.private_key || !keyData.client_email) {
            console.warn(`⚠️ [ROTATOR] Skipping ${file} due to missing private_key or client_email.`);
            continue;
          }

          const auth = new google.auth.GoogleAuth({
            credentials: {
              client_email: keyData.client_email,
              private_key: keyData.private_key.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/indexing'],
          });

          const indexingClient = google.indexing({
            version: 'v3',
            auth,
          });

          this.clients.push({
            fileName: file,
            email: keyData.client_email,
            projectId: keyData.project_id || 'unknown',
            indexingClient,
            isExhausted: false,
            unauthorizedSites: new Set<string>()
          });

          console.log(`✅ [ROTATOR] Initialized: ${file} (${keyData.client_email})`);
        } catch (err: any) {
          console.error(`❌ [ROTATOR] Failed to load key file ${file}:`, err.message);
        }
      }
    } catch (err: any) {
      console.error('💥 [ROTATOR] Critial failure during client initialization:', err.message);
    }
  }

  /**
   * Publishes URL notification using rotated service accounts
   */
  public async publish(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'): Promise<IndexingResult> {
    if (this.clients.length === 0) {
      return {
        success: false,
        email: 'none',
        projectId: 'none',
        error: 'No service account clients initialized.'
      };
    }

    const domain = new URL(url).hostname;
    let attempts = 0;
    const maxAttempts = this.clients.length;

    while (attempts < maxAttempts) {
      const activeClient = this.clients[this.currentIdx];

      // Check if current client is exhausted or flagged as unauthorized for this domain
      if (activeClient.isExhausted) {
        this.rotate();
        attempts++;
        continue;
      }

      if (activeClient.unauthorizedSites.has(domain)) {
        this.rotate();
        attempts++;
        continue;
      }

      console.log(`📡 [ROTATOR] Trying key #${this.currentIdx + 1} (${activeClient.email}) for URL: ${url}`);

      try {
        const response = await activeClient.indexingClient.urlNotifications.publish({
          requestBody: {
            url,
            type,
          },
        });

        if (response.status === 200 || response.status === 201) {
          return {
            success: true,
            email: activeClient.email,
            projectId: activeClient.projectId
          };
        }

        throw new Error(`Non-200 GSC Indexing response: ${response.status}`);
      } catch (err: any) {
        const errMsg = err.message || '';
        const isQuota = errMsg.includes('Quota exceeded') || errMsg.includes('limitExceeded') || err.code === 429;
        const isPermission = errMsg.includes('Permission denied') || errMsg.includes('not owner') || err.code === 403;

        if (isQuota) {
          console.warn(`⚠️ [ROTATOR] Quota Exceeded for client #${this.currentIdx + 1} (${activeClient.email}). Rotating...`);
          activeClient.isExhausted = true;
          this.rotate();
        } else if (isPermission) {
          console.warn(`⚠️ [ROTATOR] Permission Denied for client #${this.currentIdx + 1} (${activeClient.email}) on ${domain}. Rotating...`);
          activeClient.unauthorizedSites.add(domain);
          this.rotate();
        } else {
          console.error(`❌ [ROTATOR] Unexpected API error for key ${activeClient.email}:`, errMsg);
          this.rotate();
        }
      }

      attempts++;
    }

    return {
      success: false,
      email: 'all_exhausted',
      projectId: 'all_exhausted',
      error: 'All service account credentials in the rotation pool have been exhausted or rejected.'
    };
  }

  private rotate() {
    this.currentIdx = (this.currentIdx + 1) % this.clients.length;
  }
}

export const indexingRotator = new IndexingRotator();
