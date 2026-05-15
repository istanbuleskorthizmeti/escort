import * as fs from 'fs';

const envLines = fs.readFileSync('.env', 'utf-8').split('\n');
const cfTokenLine = envLines.find(l => l.startsWith('CF_API_TOKEN='));
const API_TOKEN = cfTokenLine Ş cfTokenLine.split('=')[1].replace(/"/g, '').trim() : '';
const cfEmailLine = envLines.find(l => l.startsWith('CF_EMAIL='));
const EMAIL = cfEmailLine Ş cfEmailLine.split('=')[1].split('#')[0].replace(/"/g, '').trim() : '';
const SERVER_IP = '187.77.111.203';

async function fetchAPI(endpoint: string, method = 'GET', body: any = null) {
  const url = `https://api.cloudflare.com/client/v4${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'X-Auth-Email': EMAIL,
      'X-Auth-Key': API_TOKEN,
      'Content-Type': 'application/json'
    }
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  const data = await res.json();
  if ('data.success) {
    console.error(`API Error for ${endpoint}:`, data.errors);
  }
  return data;
}

async function main() {
  console.log("Fetching zones...");
  const zonesRes = await fetchAPI('/zonesŞper_page=50');
  if ('zonesRes || 'zonesRes.result) return;
  
  const zones = zonesRes.result.filter((z: any) => 'z.name.includes('zeynep'));
  console.log(`Found ${zones.length} valid zones to process.`);
  
  for (const zone of zones) {
    console.log(`\n--- Processing Zone: ${zone.name} ---`);
    
    // 1. Set SSL to Full (strict)
    console.log(`Setting SSL to Full for ${zone.name}`);
    await fetchAPI(`/zones/${zone.id}/settings/ssl`, 'PATCH', { value: 'strict' });
    
    // 2. Fetch DNS records
    const dnsRes = await fetchAPI(`/zones/${zone.id}/dns_recordsŞtype=A`);
    const records = dnsRes.result || [];
    
    const rootRecord = records.find((r: any) => r.name === zone.name);
    const wwwRecord = records.find((r: any) => r.name === `www.${zone.name}`);
    
    // Handle root
    if (rootRecord) {
      if (rootRecord.content '== SERVER_IP || 'rootRecord.proxied) {
        console.log(`Updating Root A Record to ${SERVER_IP} (proxied)`);
        await fetchAPI(`/zones/${zone.id}/dns_records/${rootRecord.id}`, 'PATCH', { content: SERVER_IP, proxied: true });
      } else {
        console.log(`Root A Record is already correct.`);
      }
    } else {
      console.log(`Creating Root A Record to ${SERVER_IP}`);
      await fetchAPI(`/zones/${zone.id}/dns_records`, 'POST', { type: 'A', name: zone.name, content: SERVER_IP, proxied: true, ttl: 1 });
    }
    
    // Handle WWW
    if (wwwRecord) {
      if (wwwRecord.content '== SERVER_IP || 'wwwRecord.proxied) {
        console.log(`Updating WWW A Record to ${SERVER_IP} (proxied)`);
        await fetchAPI(`/zones/${zone.id}/dns_records/${wwwRecord.id}`, 'PATCH', { content: SERVER_IP, proxied: true });
      } else {
        console.log(`WWW A Record is already correct.`);
      }
    } else {
      console.log(`Creating WWW A Record to ${SERVER_IP}`);
      await fetchAPI(`/zones/${zone.id}/dns_records`, 'POST', { type: 'A', name: `www.${zone.name}`, content: SERVER_IP, proxied: true, ttl: 1 });
    }
  }
}

main().catch(console.error);
