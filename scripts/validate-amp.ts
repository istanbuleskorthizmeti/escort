import amphtmlValidator from 'amphtml-validator';
import { GET } from '../app/amp/route';
import * as dotenv from 'dotenv';

dotenv.config();

async function testHost(host: string) {
  console.log(`\n🔍 Validating AMP for Host: ${host}...`);
  const req = new Request('http://localhost:3000/amp?loc=kadikoy', {
    headers: {
      host: host
    }
  });

  const response = await GET(req);
  const html = await response.text();

  const validator = await amphtmlValidator.getInstance();
  const result = validator.validateString(html);

  console.log(`📋 Validation status for ${host}: ${result.status}`);
  
  if (result.status === 'FAIL') {
    console.log(`❌ AMP Validation Failed for ${host} with ${result.errors.length} errors:`);
    for (let ii = 0; ii < result.errors.length; ii++) {
      const error = result.errors[ii];
      let msg = `line ${error.line}, col ${error.col}: ${error.message}`;
      if (error.specUrl !== null) {
        msg += ` (see ${error.specUrl})`;
      }
      console.log(`   - ${msg}`);
    }
  } else {
    console.log(`✅ AMP Validation Passed for ${host}!`);
  }
}

async function main() {
  const hosts = ['istanbulescort.blog', 'vipescorthizmeti.com', 'istanbulescdrkcn.com'];
  for (const host of hosts) {
    await testHost(host);
  }
}

main().catch(console.error);
