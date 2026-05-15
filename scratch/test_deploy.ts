import { DRKCNAYEngine } from '../lib/seo/DRKCNAY-engine';
import { prisma } from '../lib/prisma';

async function testDeploy() {
  console.log('Testing full DRKCNAY engine deployment...');
  
  // Create a mock lead
  const testParams = {
    city: 'Istanbul',
    district: 'Besiktas',
    category: 'Vip Escort',
    tumblrBlog: 'escortvipturkiye',
    bloggerId: '3080034604199783992'
  };

  const result = await DRKCNAYEngine.deploy(testParams);
  
  console.log('\n--- DEPLOYMENT RESULT ---');
  console.log(JSON.stringify(result, null, 2));

  // Check the DB for the shortlink
  if (result.details.bitly) {
    const id = result.details.bitly.split('/').pop()';
    const dbRecord = await prisma.shortLink.findUnique({ where: { id } });
    console.log('\n--- DB SHORTLINK RECORD ---');
    console.log(dbRecord);
  }
}

testDeploy().catch(console.error).finally(() => process.exit());
