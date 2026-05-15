import { google } from 'googleapis';
import fs from 'fs';
import readline from 'readline';

/**
 * ☠️ GOOGLE BUSINESS ENGINE (GOD MODE)
 * Official OAuth 2.0 integration for Google Business Profile API.
 * Manages locations, stealth-posts, media, and reviews autonomously.
 */
export class GoogleBusinessEngine {
  private static readonly SCOPES = [
    'https://www.googleapis.com/auth/business.manage'
  ];
  private static readonly TOKEN_PATH = 'token.json';
  
  // These will be loaded from a credentials.json file you download from Google Cloud
  private static readonly CREDENTIALS_PATH = 'credentials.json';

  /**
   * Initializes the OAuth2 client. If no token exists, triggers the CLI login flow.
   */
  public static async authenticate() {
    if (!fs.existsSync(this.CREDENTIALS_PATH)) {
      console.error(`❌ [GBP ENGINE] Missing ${this.CREDENTIALS_PATH}.`);
      console.log(`   👉 Lütfen Google Cloud Console'dan bir OAuth Client ID oluşturup bilgilerini 'credentials.json' adıyla ana dizine kaydet.`);
      return null;
    }

    const credentials = JSON.parse(fs.readFileSync(this.CREDENTIALS_PATH, 'utf-8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    if (fs.existsSync(this.TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(this.TOKEN_PATH, 'utf-8'));
      oAuth2Client.setCredentials(token);
      console.log(`✅ [GBP ENGINE] Authenticated successfully using existing token.`);
      return oAuth2Client;
    } else {
      return await this.getNewToken(oAuth2Client);
    }
  }

  /**
   * Prompts the user to log in via the browser and paste the code back here.
   */
  private static async getNewToken(oAuth2Client: any) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });
    console.log('\n======================================================');
    console.log('🚨 BOTA İZİN VERMEN GEREKİYOR 🚨');
    console.log('Aşağıdaki linke tıkla, Google hesabınla giriş yap ve sana verilen KODU buraya yapıştır:');
    console.log(authUrl);
    console.log('======================================================\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question('Kodu buraya yapıştır (Enter\'a bas): ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err: any, token: any) => {
          if (err) {
            console.error('❌ [GBP ENGINE] Error retrieving access token', err);
            return resolve(null);
          }
          oAuth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          fs.writeFileSync(this.TOKEN_PATH, JSON.stringify(token));
          console.log(`✅ [GBP ENGINE] Token stored to ${this.TOKEN_PATH}`);
          resolve(oAuth2Client);
        });
      });
    });
  }

  /**
   * (Module 1/6) Fetch all locations (businesses) managed by this account.
   */
  public static async listLocations(auth: any) {
    // Note: The specific MyBusiness API requires specialized discovery or REST calls 
    // depending on the exact googleapis version, using standard GET requests as fallback.
    const mybusinessbusinessinformation = google.mybusinessbusinessinformation({ version: 'v1', auth });
    
    try {
      console.log(`⏳ [GBP ENGINE] Fetching account details...`);
      const mybusinessaccountmanagement = google.mybusinessaccountmanagement({ version: 'v1', auth });
      const accountsRes = await mybusinessaccountmanagement.accounts.list();
      const accounts = accountsRes.data.accounts;

      if (!accounts || accounts.length === 0) {
        console.log('⚠️ [GBP ENGINE] No accounts found.');
        return [];
      }

      const accountName = accounts[0].name; // Use the first account
      if (!accountName) {
        console.warn('⚠️ [GBP ENGINE] Primary account name is missing.');
        return [];
      }
      console.log(`⏳ [GBP ENGINE] Fetching locations for account: ${accountName}`);

      const locationsRes = await mybusinessbusinessinformation.accounts.locations.list({
        parent: accountName,
        readMask: 'name,title,storeCode,latlng'
      });

      const locations = locationsRes.data.locations || [];
      console.log(`✅ [GBP ENGINE] Found ${locations.length} locations.`);
      return locations;

    } catch (e: any) {
       console.error(`❌ [GBP ENGINE] Failed to list locations:`, e.message);
       return [];
    }
  }

  /**
   * (Module 5/6) Creates a cloaked "Local Post" on the Map to boost SEO silently.
   */
  public static async createCloakedPost(auth: any, locationName: string, targetUrl: string) {
    // The endpoint is usually mybusiness.googleapis.com/v4/{locationName}/localPosts
    // Implementing via raw fetch to ensure compatibility if types are missing
    try {
      const cloakedText = `Haftanın yorgunluğunu atmak için uzman terapistlerimizle rahatlayın. Sefaköy bölgesindeki en seçkin ve özel hizmetlerimiz için randevu almayı unutmayın. Daha fazla detay ve online randevu için sitemizi ziyaret edebilirsiniz.\n\nRandevu: ${targetUrl}`;
      
      console.log(`\n🕵️ [GBP ENGINE] Injecting cloaked SEO post into ${locationName}...`);
      
      const tokenObj = await auth.getAccessToken();
      const response = await fetch(`https://mybusiness.googleapis.com/v4/${locationName}/localPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenObj.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          languageCode: 'tr',
          summary: cloakedText,
          callToAction: {
            actionType: 'LEARN_MORE',
            url: targetUrl
          }
        })
      });

      if (response.ok) {
        console.log(`✅ [GBP ENGINE] Cloaked Post injected successfully! (SEO Power +1)`);
        return true;
      } else {
        const err = await response.json();
        console.error(`❌ [GBP ENGINE] Failed to inject post:`, JSON.stringify(err));
        return false;
      }
    } catch (e: any) {
      console.error(`❌ [GBP ENGINE] Error during post injection:`, e.message);
      return false;
    }
  }
}

// Support running this script standalone for testing OAuth
if (require.main === module) {
  GoogleBusinessEngine.authenticate().then(auth => {
    if (auth) {
        GoogleBusinessEngine.listLocations(auth).then(() => {
           console.log("\n🚀 [GOD MODE] Google Business Engine is ready for deployment.");
           process.exit(0);
        });
    }
  });
}
