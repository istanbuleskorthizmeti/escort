import amphtmlValidator from 'amphtml-validator';
import { GET } from '../app/amp/route';
import { DOMAIN_MATRIX } from '../config/domains';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const validator = await amphtmlValidator.getInstance();
  const moneySites = DOMAIN_MATRIX.filter(d => d.role === 'MONEY_SITE');

  console.log(`🚀 Starting AMP Validation for all ${moneySites.length} MONEY_SITE domains...`);
  
  let failedCount = 0;
  let passedCount = 0;

  for (const site of moneySites) {
    const host = site.host;
    const req = new Request('http://localhost:3000/amp?loc=kadikoy', {
      headers: {
        host: host
      }
    });

    try {
      const response = await GET(req);
      const html = await response.text();
      const result = validator.validateString(html);

      if (result.status === 'FAIL') {
        failedCount++;
        console.log(`❌ AMP Validation FAILED for ${host} (${site.theme} theme):`);
        for (let ii = 0; ii < result.errors.length; ii++) {
          const error = result.errors[ii];
          console.log(`   - line ${error.line}, col ${error.col}: ${error.message}`);
        }
      } else {
        passedCount++;
        console.log(`✅ ${host} passed.`);
      }
    } catch (err: any) {
      failedCount++;
      console.log(`💥 Error generating AMP HTML for ${host}: ${err.message}`);
    }
  }

  console.log(`\n📊 SUMMARY:`);
  console.log(`   - Total Tested: ${moneySites.length}`);
  console.log(`   - Passed: ${passedCount}`);
  console.log(`   - Failed: ${failedCount}`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    console.log('\n🎉 ALL DOMAINS PASSED AMP VALIDATION PERFECTLY!');
  }
}

main().catch(console.error);
