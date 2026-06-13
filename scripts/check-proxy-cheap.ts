import 'dotenv/config';
import { proxyCheapService } from '../lib/seo/proxy-cheap-api';

async function check() {
  console.log('📡 Fetching Proxy-Cheap Account Proxies...');
  const proxies = await proxyCheapService.getProxies();
  console.log('📋 Account Proxies List:');
  console.log(JSON.stringify(proxies, null, 2));

  const proxyId = process.env.PROXY_CHEAP_ID || '1963310';
  console.log(`\n🔍 Checking Details for Proxy ID: ${proxyId}...`);
  const details = await proxyCheapService.getProxyDetails(proxyId);
  console.log('📋 Proxy Details:');
  console.log(JSON.stringify(details, null, 2));
}

check().catch(console.error);
