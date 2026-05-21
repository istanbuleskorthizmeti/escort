import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

async function auditKey(fileName: string, keyPath: string) {
  console.log(`\n🔍 [AUDIT] Testing Google Service Account Key: ${fileName}...`);
  try {
    const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    
    // Create Auth client
    const auth = new google.auth.JWT(
      keyData.client_email,
      undefined,
      keyData.private_key.replace(/\\n/g, '\n'),
      [
        'https://www.googleapis.com/auth/blogger',
        'https://www.googleapis.com/auth/webmasters.readonly',
        'https://www.googleapis.com/auth/analytics.readonly'
      ]
    );

    console.log(`📋 Client Email: ${keyData.client_email}`);
    console.log(`🆔 Project ID: ${keyData.project_id}`);

    const auditResults: Record<string, string> = {};

    // 1. Test Search Console API
    try {
      console.log('📡 Testing Search Console (GSC) API...');
      const sc = google.searchconsole({ version: 'v1', auth });
      const sites = await sc.sites.list({});
      const siteList = sites.data.siteEntry || [];
      auditResults['Search Console'] = `ENABLED ✅ (${siteList.length} verified properties found)`;
      console.log(`   └─ Found ${siteList.length} sites:`, siteList.map(s => s.siteUrl).join(', ') || 'None');
    } catch (err: any) {
      auditResults['Search Console'] = `DISABLED/UNAUTHORIZED ❌ (${err.message})`;
    }

    // 2. Test Blogger API
    try {
      console.log('📝 Testing Blogger API...');
      const blogger = google.blogger({ version: 'v3', auth });
      const blogs = await blogger.blogs.listByUser({ userId: 'self' });
      const blogList = blogs.data.items || [];
      auditResults['Blogger API'] = `ENABLED ✅ (${blogList.length} blogs connected)`;
      console.log(`   └─ Found ${blogList.length} blogs:`, blogList.map(b => b.name).join(', ') || 'None');
    } catch (err: any) {
      auditResults['Blogger API'] = `DISABLED/UNAUTHORIZED ❌ (${err.message})`;
    }

    // 3. Test Google Analytics API
    try {
      console.log('📊 Testing Google Analytics (GA4) Admin API...');
      const analytics = google.analytics({ version: 'v3', auth });
      const accounts = await analytics.management.accounts.list({});
      const accountList = accounts.data.items || [];
      auditResults['Google Analytics'] = `ENABLED ✅ (${accountList.length} accounts connected)`;
      console.log(`   └─ Found ${accountList.length} accounts:`, accountList.map(a => a.name).join(', ') || 'None');
    } catch (err: any) {
      auditResults['Google Analytics'] = `DISABLED/UNAUTHORIZED ❌ (${err.message})`;
    }

    console.log(`✨ [AUDIT SUMMARY] ${fileName}:`);
    console.table(auditResults);
    
    return {
      fileName,
      clientEmail: keyData.client_email,
      projectId: keyData.project_id,
      results: auditResults
    };
  } catch (err: any) {
    console.error(`💥 Failed to audit ${fileName}:`, err.message);
    return null;
  }
}

async function run() {
  const rootDir = process.cwd();
  const files = fs.readdirSync(rootDir);
  const keyFiles = files.filter(f => (f.endsWith('.json') || f.endsWith('.bak')) && (f.includes('google-key') || f.includes('hydra-gcp-key') || f.includes('sovereign-spyy')));

  console.log(`🔮 Starting Multi-Account Google API Audit... Found ${keyFiles.length} keys.`);
  
  const summaries = [];
  for (const file of keyFiles) {
    const summary = await auditKey(file, path.join(rootDir, file));
    if (summary) summaries.push(summary);
  }

  console.log('\n🌟 ==================== GLOBAL AUDIT REPORT ====================');
  console.log(JSON.stringify(summaries, null, 2));
}

run();
