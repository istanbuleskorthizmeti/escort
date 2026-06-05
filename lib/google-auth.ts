import { google } from 'googleapis';
import { OAuth2Client, JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';
import crypto from 'crypto';

/**
 * ELITE SYSTEM AUTH (INFRASTRUCTURE ENGINE)
 * Handles OAuth2 flows, token encryption, storage, and auto-refresh.
 */

const ENCRYPTION_KEY = process.env.CRM_ENCRYPTION_KEY;
const IV_LENGTH = 16;

function getKeyBuffer() {
  if (!ENCRYPTION_KEY) {
    throw new Error('CRM_ENCRYPTION_KEY is required for Google OAuth token encryption');
  }
  return Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32));
}

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', getKeyBuffer(), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', getKeyBuffer(), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

class GoogleAuthService {
  private oauthClient: OAuth2Client;
  private serviceAccountClients: JWT[] = [];
  private currentClientIndex = 0;

  constructor() {
    this.oauthClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Load all Service Accounts available in the root
    const rootDir = process.cwd();
    const files = fs.readdirSync(/*turbopackIgnore: true*/ rootDir);
    const keyFiles = files.filter(f => f.endsWith('.json') && (f.startsWith('google-key') || f.startsWith('hydra-gcp-key')));
    
    // Sort to prioritize hydra-gcp-key.json if it exists
    keyFiles.sort((a, b) => a.startsWith('hydra-gcp-key') ? -1 : 1);

    for (const keyFile of keyFiles) {
      try {
        const keyPath = path.join(/*turbopackIgnore: true*/ rootDir, keyFile);
        const keyRaw = fs.readFileSync(/*turbopackIgnore: true*/ keyPath, 'utf8');
        const keyData = JSON.parse(keyRaw);
        
        if (keyData.private_key && keyData.private_key.includes('PASTE_YOUR_DOWNLOADED_PRIVATE_KEY_HERE')) {
           console.warn(`⚠️ [AUTH] Skipping ${keyFile} because it contains a dummy/placeholder private key.`);
           continue;
        }

        // Test the key validity to prevent DECODER routines::unsupported errors during runtime
        try {
            crypto.createPrivateKey(keyData.private_key.replace(/\\n/g, '\n').replace(/\r/g, ''));
        } catch {
            console.warn(`⚠️ [AUTH] Skipping ${keyFile} because the private key is invalid or corrupted (Crypto Error).`);
            continue;
        }
        
        const subject = process.env.GOOGLE_WORKSPACE_EMAIL || undefined;
        const client = new google.auth.JWT(
          keyData.client_email,
          undefined,
          keyData.private_key.replace(/\\n/g, '\n').replace(/\r/g, ''),
          [
            'https://www.googleapis.com/auth/blogger',
            'https://www.googleapis.com/auth/webmasters',
            'https://www.googleapis.com/auth/indexing',
            'https://www.googleapis.com/auth/business.manage',
            'https://www.googleapis.com/auth/analytics',
            'https://www.googleapis.com/auth/spreadsheets'
          ],
          subject
        );
        this.serviceAccountClients.push(client);
        console.log(`🔐 [AUTH] Service Account initialized: ${keyFile} (${keyData.client_email})`);
      } catch (err) {
        console.error(`⚠️ [AUTH] Failed to initialize Service Account ${keyFile}:`, err);
      }
    }
  }

  /**
   * Generates the initial authorization URL.
   */
  getAuthUrl() {
    return this.oauthClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/webmasters',
        'https://www.googleapis.com/auth/indexing',
        'https://www.googleapis.com/auth/blogger',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/business.manage',
        'https://www.googleapis.com/auth/analytics'
      ],
    });
  }

  /**
   * Exchanges authorization code for tokens and saves them.
   */
  async handleCallback(code: string) {
    const { tokens } = await this.oauthClient.getToken(code);
    await this.saveTokens(tokens as any);
    return tokens;
  }

  /**
   * Securely saves tokens to the database.
   */
  private async saveTokens(tokens: Record<string, unknown>) {
    try {
      const existing = await this.getTokens();
      const finalTokens = {
        ...existing,
        ...tokens,
        refresh_token: tokens.refresh_token || existing?.refresh_token,
      };

      await prisma.systemSetting.upsert({
        where: { key: 'GOOGLE_OAUTH_TOKENS' },
        update: { 
          value: encrypt(JSON.stringify(finalTokens)),
          updatedAt: new Date()
        },
        create: { 
          key: 'GOOGLE_OAUTH_TOKENS', 
          value: encrypt(JSON.stringify(finalTokens)) 
        },
      });
    } catch (err) {
      console.warn("⚠️ [AUTH] Could not save tokens to database (DB down?):", err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Retrieves and decrypts tokens.
   */
  async getTokens() {
    try {
      const setting = await prisma.systemSetting.findUnique({
        where: { key: 'GOOGLE_OAUTH_TOKENS' },
      });
      if (!setting) return null;
      try {
        return JSON.parse(decrypt(setting.value));
      } catch (decryptErr) {
        console.error("❌ [AUTH] Token Decryption Failed. Key mismatch? Error:", decryptErr instanceof Error ? decryptErr.message : String(decryptErr));
        return null;
      }
    } catch (err) {
      console.error("❌ [AUTH] Failed to fetch tokens from DB:", err instanceof Error ? err.message : String(err));
      return null;
    }
  }

  /**
   * Returns an authorized Google API client, refreshing if necessary.
   */
  async getAuthorizedClient() {
    // 1. Try OAuth2 User Tokens First
    const tokens = await this.getTokens();
    
    if (tokens) {
      this.oauthClient.setCredentials(tokens);
      this.oauthClient.removeAllListeners('tokens');
      this.oauthClient.on('tokens', (newTokens) => {
        this.saveTokens(newTokens as any);
      });
      return this.oauthClient;
    }

    // 2. Try Service Account Rotation (Local JSON keys)
    if (this.serviceAccountClients.length > 0) {
      const client = this.serviceAccountClients[this.currentClientIndex];
      console.log(`🛡️ [AUTH] Using Service Account fallback: Client #${this.currentClientIndex + 1}`);
      
      this.currentClientIndex = (this.currentClientIndex + 1) % this.serviceAccountClients.length;
      return client;
    }

    // 3. Fallback to Application Default Credentials (ADC) - Perfect for Cloud Servers
    try {
      console.log(`☁️ [AUTH] Attempting Application Default Credentials (ADC) fallback...`);
      const auth = new google.auth.GoogleAuth({
        scopes: [
          'https://www.googleapis.com/auth/blogger',
          'https://www.googleapis.com/auth/webmasters',
          'https://www.googleapis.com/auth/indexing',
          'https://www.googleapis.com/auth/business.manage',
          'https://www.googleapis.com/auth/analytics',
          'https://www.googleapis.com/auth/spreadsheets'
        ]
      });
      const client = await auth.getClient();
      return client as any;
    } catch (adcErr) {
      console.warn(`⚠️ [AUTH] ADC fallback failed:`, adcErr instanceof Error ? adcErr.message : String(adcErr));
    }

    throw new Error('Google OAuth NOT initialized and no Service Account found. Visit /api/admin/auth/google/init');
  }
  /**
   * 🚀 FORCE INDEXING (GOOGLE INDEXING API)
   * Urgently requests Google to crawl a specific URL.
   */
  async forceIndexUrl(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
    try {
      const client = await this.getAuthorizedClient();
      const indexing = google.indexing({ version: 'v3', auth: client });
      
      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: type,
        },
      });
      
      console.log(`🚀 [INDEXING] Success for ${url}:`, res.data);
      return res.data;
    } catch (err: any) {
      console.error(`❌ [INDEXING] Failed for ${url}:`, err.response?.data || err.message);
      return null;
    }
  }

  /**
   * 📡 SITEMAP SUBMISSION (SEARCH CONSOLE API)
   * Notifies Google about a new sitemap for a specific domain.
   */
  async submitSitemap(siteUrl: string, sitemapUrl: string) {
    try {
      const client = await this.getAuthorizedClient();
      const searchconsole = google.searchconsole({ version: 'v1', auth: client });
      
      await searchconsole.sitemaps.submit({
        siteUrl: siteUrl,
        feedpath: sitemapUrl,
      });
      
      console.log(`📡 [SEARCH CONSOLE] Sitemap submitted: ${sitemapUrl} for ${siteUrl}`);
      return true;
    } catch (err: any) {
      console.error(`❌ [SEARCH CONSOLE] Sitemap submission failed:`, err.response?.data || err.message);
      return false;
    }
  }
}


export const googleAuth = new GoogleAuthService();
