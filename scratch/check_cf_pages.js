const https = require('https');

const CF_TOKEN = 'cfat_JwtaN2nqkC7QxGItIaAbu2nA6TyojAqHS7DWfvpse525d170';

async function apiCall(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Authorization': `Bearer ${CF_TOKEN}`,
      'Content-Type': 'application/json'
    };

    const req = https.request({
      hostname: 'api.cloudflare.com',
      path: path,
      method: method,
      headers: headers,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  try {
    const zonesPage1 = await apiCall('/client/v4/zones?per_page=50&page=1');
    const zonesPage2 = await apiCall('/client/v4/zones?per_page=50&page=2');
    console.log(`Page 1 count: ${zonesPage1.result?.length || 0}`);
    console.log(`Page 2 count: ${zonesPage2.result?.length || 0}`);
  } catch (e) {
    console.error(e);
  }
}
run();
