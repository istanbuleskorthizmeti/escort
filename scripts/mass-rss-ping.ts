import axios from 'axios';
import { DOMAIN_MATRIX } from '../config/domains';

const pingServices = [
  { name: 'Pingomatic', url: 'http://rpc.pingomatic.com/' },
  { name: 'Twingly', url: 'http://rpc.twingly.com/' },
  { name: 'Blo.gs', url: 'http://ping.blo.gs/' }
];

async function sendRpcPing(serviceUrl: string, serviceName: string, feedUrl: string, siteName: string) {
  const xmlPayload = `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.ping</methodName>
  <params>
    <param>
      <value>${siteName}</value>
    </param>
    <param>
      <value>${feedUrl}</value>
    </param>
  </params>
</methodCall>`.trim();

  try {
    const response = await axios.post(serviceUrl, xmlPayload, {
      headers: { 'Content-Type': 'text/xml' },
      timeout: 6000
    });
    return { success: true, status: response.status };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

async function sendGetPing(engineUrl: string, feedUrl: string) {
  try {
    const url = `${engineUrl}${encodeURIComponent(feedUrl)}`;
    const response = await axios.get(url, { timeout: 6000 });
    return { success: true, status: response.status };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

async function pingDomain(host: string) {
  const feedUrl = `https://${host}/feed.xml`;
  const siteName = `${host.split('.')[0].toUpperCase()} VIP Escort`;

  console.log(`\n──────────────────────────────────────────`);
  console.log(`📡 PING BLAST FOR: ${host}`);
  console.log(`🔗 Feed URL: ${feedUrl}`);

  // 1. HTTP GET Sitemaps Pings
  const googleRes = await sendGetPing('https://www.google.com/webmasters/tools/ping?sitemap=', feedUrl);
  console.log(`   🌐 Google Sitemap Ping: ${googleRes.success ? `✅ OK (${googleRes.status})` : `❌ Fail (${googleRes.error})`}`);

  const bingRes = await sendGetPing('https://www.bing.com/webmaster/ping.aspx?siteMap=', feedUrl);
  console.log(`   🌐 Bing Sitemap Ping: ${bingRes.success ? `✅ OK (${bingRes.status})` : `❌ Fail (${bingRes.error})`}`);

  // 2. IndexNow Ping
  const indexNowKey = '8f7c9e0a2b4d6f8a0c2e4f6a8b0d2e4f';
  const indexNowUrl = `https://www.bing.com/indexnow?url=${encodeURIComponent(feedUrl)}&key=${indexNowKey}`;
  try {
    const indexNowRes = await axios.get(indexNowUrl, { timeout: 6000 });
    console.log(`   🌐 IndexNow Feed Ping: ${indexNowRes.status === 200 ? '✅ OK (200)' : `❌ Fail (${indexNowRes.status})`}`);
  } catch (err: any) {
    console.log(`   🌐 IndexNow Feed Ping: ❌ Fail (${err.message})`);
  }

  // 3. XML-RPC Directory Pings
  for (const service of pingServices) {
    const res = await sendRpcPing(service.url, service.name, feedUrl, siteName);
    console.log(`   🔌 RPC ${service.name}: ${res.success ? `✅ Pinged (${res.status})` : `❌ Error (${res.error})`}`);
  }
}

async function startPingBlast() {
  console.log('🧛‍♂️ [MASS RSS PING BLAST] Initiating fleet-wide RSS feed pinging...');
  console.log(`📋 Total configured target domains in matrix...`);

  const targets = DOMAIN_MATRIX.filter(d => d.role === 'MONEY_SITE' || d.role === 'SATELLITE');
  console.log(`🔥 Target count: ${targets.length} domains`);

  // Run domains sequentially with small pause to prevent connection timeouts/IP blocks
  for (const target of targets) {
    try {
      await pingDomain(target.host);
    } catch (e: any) {
      console.error(`💥 Failed pinging domain ${target.host}:`, e.message);
    }
    // Respect rate limits of pinging engines
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  console.log('\n🏆 [SUCCESS] Mass RSS Ping Blast completed successfully!');
}

startPingBlast().catch(console.error);
