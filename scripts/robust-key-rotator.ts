import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

export interface KeyConfig {
  fileName: string;
  email: string;
  projectId: string;
  indexingClient: any;
  isExhausted: boolean;
  unauthorizedSites: Set<string>;
}

export class RobustKeyRotator {
  private clients: KeyConfig[] = [];
  private currentIdx = 0;

  constructor(rootDir: string = process.cwd()) {
    this.initializeClients(rootDir);
  }

  private initializeClients(rootDir: string) {
    try {
      const files = fs.readdirSync(rootDir);
      const keyFiles = files.filter(f => 
        f.endsWith('.json') && 
        (f.startsWith('google-key') || f.startsWith('hydra-gcp-key') || f.startsWith('sovereign-spyy'))
      );

      console.log(`🔍 [ROTATOR] Found ${keyFiles.length} candidate key files in ${rootDir}`);

      for (const file of keyFiles) {
        try {
          const keyPath = path.join(rootDir, file);
          const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

          if (!keyData.private_key || !keyData.client_email) {
            console.log(`ℹ️ [ROTATOR] Skipping ${file} (missing private_key or client_email)`);
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
            unauthorizedSites: new Set()
          });

          console.log(`🔑 [ROTATOR] Initialized key: ${file} (${keyData.client_email})`);
        } catch (err: any) {
          console.error(`❌ [ROTATOR] Failed to load ${file}:`, err.message);
        }
      }
    } catch (err: any) {
      console.error(`💥 [ROTATOR] Error reading directory:`, err.message);
    }
  }

  public getClientsCount(): number {
    return this.clients.length;
  }

  public getActiveClientEmail(): string | null {
    if (this.clients.length === 0) return null;
    return this.clients[this.currentIdx].email;
  }

  public rotate() {
    if (this.clients.length === 0) return;
    this.currentIdx = (this.currentIdx + 1) % this.clients.length;
  }

  public async publish(url: string): Promise<{ success: boolean; email?: string; projectId?: string; error?: string }> {
    if (this.clients.length === 0) {
      return { success: false, error: 'No active Google service account clients loaded.' };
    }

    const domain = new URL(url).hostname;
    let siteId = domain;
    if (domain === 'sites.google.com') {
      const urlParts = url.split('/');
      if (urlParts.length >= 5) {
        siteId = `${urlParts[2]}/${urlParts[3]}/${urlParts[4]}`;
      }
    }

    let attempts = 0;
    const maxAttempts = this.clients.length;

    while (attempts < maxAttempts) {
      const activeClient = this.clients[this.currentIdx];

      if (activeClient.isExhausted || activeClient.unauthorizedSites.has(siteId)) {
        this.rotate();
        attempts++;
        continue;
      }

      try {
        console.log(`📡 [ROTATOR] Attempting publish via: ${activeClient.email} for URL: ${url}`);
        const res = await activeClient.indexingClient.urlNotifications.publish({
          requestBody: {
            url,
            type: 'URL_UPDATED',
          },
        });

        if (res.status === 200 || res.status === 201) {
          return {
            success: true,
            email: activeClient.email,
            projectId: activeClient.projectId
          };
        }
        throw new Error(`GSC Indexing API responded with status: ${res.status}`);
      } catch (err: any) {
        const errMsg = err.message || '';
        const errCode = err.code || 500;
        const isQuota = errMsg.includes('Quota exceeded') || errMsg.includes('limitExceeded') || errCode === 429;
        const isPermission = errMsg.includes('Permission denied') || errMsg.includes('not owner') || errMsg.includes('not verified');
        const isTransient = errMsg.includes('ETIMEDOUT') || errMsg.includes('ECONNRESET') || 
                            errMsg.includes('ECONNREFUSED') || errMsg.includes('ENOTFOUND') || 
                            errMsg.includes('socket hang up') || errMsg.includes('fetch failed') || 
                            errMsg.includes('timeout');

        if (isQuota) {
          console.warn(`⚠️ [ROTATOR] Quota exceeded for ${activeClient.email}. Rotating...`);
          activeClient.isExhausted = true;
          this.rotate();
        } else if (isPermission && errCode === 403) {
          console.warn(`⚠️ [ROTATOR] Permission denied for ${activeClient.email} on site: ${siteId}. Rotating...`);
          activeClient.unauthorizedSites.add(siteId);
          this.rotate();
        } else if (!isTransient) {
          console.error(`❌ [ROTATOR] Critical permanent error for ${activeClient.email}:`, errMsg);
          activeClient.isExhausted = true;
          this.rotate();
        } else {
          console.warn(`⚠️ [ROTATOR] Transient network error for ${activeClient.email}:`, errMsg);
          this.rotate();
        }
      }
      attempts++;
    }

    return {
      success: false,
      error: 'All service account credentials in the pool have been exhausted or rejected.'
    };
  }
}
