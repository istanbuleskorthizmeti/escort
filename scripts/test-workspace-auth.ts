import { GoogleAuthService } from './google-auth-service-test';
import { googleAuth } from '../lib/google-auth';
import { google } from 'googleapis';

async function testWorkspaceAccess() {
  try {
    const client = await googleAuth.getAuthorizedClient();
    console.log('✅ Obtained authorized client.');
    
    // Check if it is a JWT client or OAuth2
    if ('email' in client) {
      console.log('Client Email:', (client as any).email);
      console.log('Subject (Workspace Email impersonation):', (client as any).subject);
    }
    
    console.log('Testing Indexing API access for one Google Sites URL...');
    const indexing = google.indexing({ version: 'v3', auth: client });
    const res = await indexing.urlNotifications.publish({
      requestBody: {
        url: 'https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort',
        type: 'URL_UPDATED',
      },
    });
    console.log('Indexing Response:', res.data);
  } catch (err: any) {
    console.error('❌ Access test failed:', err.response?.data || err.message);
  }
}

testWorkspaceAccess();
