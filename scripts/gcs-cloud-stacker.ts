import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';
import * as path from 'path';
import { istanbulCity } from '../lib/locations-registry/istanbul';

// Target credentials path
const keyPath = path.join(process.cwd(), 'hydra-gcp-key.json');
const STOPLIGHT_BASE = 'https://escort-randevu.stoplight.io/docs';

// Target Buckets Configuration (User can provide specific bucket name, fallback to a standard pattern)
const BUCKET_NAME = 'vast-falcon-495301-g5-seo-trap';

const googleSites = [
  "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort",
  "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort",
  "https://sites.google.com/dorukcanay.digital/beyoglu-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/istanbul-escort",
  "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v",
  "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026",
  "https://sites.google.com/dorukcanay.digital/silivriescort-drkcnay2026",
  "https://sites.google.com/dorukcanay.digital/grandveracasino-grandverabahis/grandvera/"
];

function slugify(text: string): string {
  if (!text) return '';
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/Ğ/g, 'g')
    .replace(/ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/ö/g, 'o')
    .replace(/Ç/g, 'c')
    .replace(/ç/g, 'c')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function uploadToGCS() {
  console.log('🧛‍♂️ [GCS CLOUD STACKING] Generating HTML Crawler-Trap for Google Cloud Storage...');
  console.log('--------------------------------------------------------------------------');

  if (!fs.existsSync(keyPath)) {
    console.error('❌ Service Account key not found (hydra-gcp-key.json). Please configure GCP credentials.');
    return;
  }

  // 1. Parse credentials to get project id
  const creds = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
  const projectId = creds.project_id;

  // Initialize Storage client with target key file
  const storage = new Storage({
    projectId: projectId,
    keyFilename: keyPath
  });

  // 2. Generate HTML Sitemap content
  let listItems = '';
  
  // Add Google Sites links
  googleSites.forEach(url => {
    const name = url.replace('https://sites.google.com/dorukcanay.digital/', '').replace(/-/g, ' ').toUpperCase();
    listItems += `      <li><a href="${url}" target="_blank">${name} Escort Portal</a></li>\n`;
  });

  // Add Stoplight locations
  for (const district of istanbulCity.districts) {
    const cleanDistrictName = district.name.replace(/\s+escort/gi, '').trim();
    const districtSlug = slugify(cleanDistrictName);
    const distUrl = `${STOPLIGHT_BASE}/istanbul-${districtSlug}-escort`;

    listItems += `      <li><a href="${distUrl}" target="_blank">İstanbul ${cleanDistrictName} Escort VIP</a></li>\n`;

    for (const neighborhood of district.neighborhoods) {
      const neighborhoodSlug = slugify(neighborhood.name);
      const neighUrl = `${STOPLIGHT_BASE}/istanbul-${districtSlug}-${neighborhoodSlug}-escort`;
      listItems += `      <li><a href="${neighUrl}" target="_blank">${cleanDistrictName} ${neighborhood.name} Escort</a></li>\n`;
    }
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>İstanbul VIP Escort & Randevu Rehberi - Local SEO Analiz</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f0f13; color: #a9b2c3; padding: 2rem; max-width: 900px; margin: 0 auto; }
    h1 { color: #f43f5e; border-bottom: 2px solid #272730; padding-bottom: 1rem; }
    ul { list-style: none; padding: 0; }
    li { margin: 0.5rem 0; padding: 0.5rem; background: #181824; border-radius: 6px; }
    a { color: #38bdf8; text-decoration: none; font-weight: bold; }
    a:hover { text-decoration: underline; color: #f43f5e; }
  </style>
</head>
<body>
  <h1>📍 İstanbul VIP Escort Local SEO Indexing Index</h1>
  <p>Entity relational indexing verification records page hosted on Google Cloud Storage authority networks.</p>
  <ul>
${listItems}
  </ul>
</body>
</html>`.trim();

  const tempHtmlPath = path.join(process.cwd(), 'gcs-crawler-trap.html');
  fs.writeFileSync(tempHtmlPath, htmlContent);
  console.log('✅ Temporary HTML sitemap file created.');

  // 3. Attempt file upload
  try {
    const targetBucket = storage.bucket(BUCKET_NAME);
    
    // Check if bucket exists, create if not
    const [exists] = await targetBucket.exists();
    if (!exists) {
      console.log(`📡 Bucket '${BUCKET_NAME}' does not exist. Creating bucket in project '${projectId}'...`);
      await storage.createBucket(BUCKET_NAME, {
        location: 'US', // Multi-region US/EU
        storageClass: 'STANDARD'
      });
      console.log(`✅ Bucket '${BUCKET_NAME}' created successfully.`);
    }

    console.log(`🚀 Uploading gcs-crawler-trap.html to '${BUCKET_NAME}'...`);
    
    // Upload file
    await targetBucket.upload(tempHtmlPath, {
      destination: 'index.html',
      metadata: {
        contentType: 'text/html',
        cacheControl: 'no-cache, no-store, must-revalidate'
      }
    });

    // Disable Public Access Prevention (PAP) on bucket if enforced
    try {
      await targetBucket.setMetadata({
        iamConfiguration: {
          publicAccessPrevention: 'inherited',
        },
      });
      console.log('🔓 Public Access Prevention disabled/inherited.');
    } catch (papErr: any) {
      console.log('⚠️ Failed to disable PAP metadata:', papErr.message);
    }

    // Make the file public using IAM Policy for Uniform Bucket-level Access
    try {
      await targetBucket.file('index.html').makePublic();
      console.log('🔓 File ACL set to public successfully.');
    } catch (makePubErr: any) {
      console.log('⚠️ standard ACL makePublic failed, trying IAM policy fallback...');
      try {
        const [policy] = await targetBucket.iam.getPolicy({ requestedPolicyVersion: 3 });
        policy.bindings = policy.bindings || [];
        const role = 'roles/storage.objectViewer';
        const member = 'allUsers';

        let binding = policy.bindings.find((b: any) => b.role === role);
        if (binding) {
          if (!binding.members.includes(member)) {
            binding.members.push(member);
          }
        } else {
          policy.bindings.push({
            role: role,
            members: [member]
          });
        }
        await targetBucket.iam.setPolicy(policy);
        console.log('🔓 Uniform IAM policy set to public successfully.');
      } catch (iamErr: any) {
        console.warn('⚠️ GCS Bucket Uniform IAM policy blocked by GCP Organization Policies (publicAccessPrevention).');
        console.log('💡 Note: The file was uploaded, but the organization policy (PAP) prevents public link sharing.');
        throw iamErr;
      }
    }

    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/index.html`;
    console.log('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬');
    console.log('🏆 [SUCCESS] CLOUD STACKING PAGE DEPLOYED!');
    console.log(`🔗 Target URL: ${publicUrl}`);
    console.log('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬');

    // Trigger immediate IndexNow ping for the GCS URL
    console.log('📡 Sending IndexNow signal for the Google Cloud Storage bucket link...');
    const indexNowUrl = `${BING_INDEX_NOW}?url=${encodeURIComponent(publicUrl)}&key=${INDEX_NOW_KEY}`;
    await axios.get(indexNowUrl);
    console.log('✅ IndexNow notified.');

  } catch (err: any) {
    console.error('❌ Upload operation failed:', err.message);
    console.warn('⚠️ GCS bucket validation/access failed. Please ensure the GCP user has Storage Admin permissions.');
  }

  // Clean up
  fs.rmSync(tempHtmlPath, { force: true });
}

uploadToGCS().catch(console.error);
