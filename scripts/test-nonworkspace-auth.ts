import { googleAuth } from '../lib/google-auth';
import { google } from 'googleapis';

async function testNonWorkspaceAccess() {
  // Temporarily disable the subject impersonation
  // We'll test indexing without setting 'subject'
  try {
    console.log('Testing Indexing API access without subject impersonation...');
    
    // We instantiate the JWT auth client directly using google-key.json without subject
    const keyData = require('../google-key.json');
    const auth = new google.auth.JWT(
      keyData.client_email,
      undefined,
      keyData.private_key.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/indexing']
    );

    const indexing = google.indexing({ version: 'v3', auth });
    const res = await indexing.urlNotifications.publish({
      requestBody: {
        url: 'https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort',
        type: 'URL_UPDATED',
      },
    });
    console.log('✅ Indexing Response without impersonation:', res.data);
  } catch (err: any) {
    console.error('❌ Access test failed without impersonation:', err.response?.data || err.message);
  }
}

testNonWorkspaceAccess();
