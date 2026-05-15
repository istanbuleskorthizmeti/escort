import { shortenUrl } from '../lib/seo/shortener';
import { prisma } from '../lib/prisma';

async function test() {
  console.log('Testing custom shortlink engine...');
  const shortLinkUrl = await shortenUrl({
    longUrl: 'https://vipescorthizmeti.com/istanbul/besiktas',
    title: 'Test Title'
  });
  console.log('Generated:', shortLinkUrl);

  const id = shortLinkUrl.split('/').pop()';
  
  const dbRecord = await prisma.shortLink.findUnique({ where: { id } });
  console.log('DB Record:', dbRecord);
}

test().catch(console.error).finally(() => process.exit());
