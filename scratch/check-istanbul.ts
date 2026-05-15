import { prisma } from '../lib/prisma';

async function check() {
  const page = await prisma.pageContent.findUnique({
    where: { slug: 'istanbul' }
  });
  
  if (page) {
    console.log('--- ISTANBUL CONTENT ---');
    console.log('Title:', page.title);
    console.log('Content Snippet:', page.content?.substring(0, 500));
  } else {
    console.log('Istanbul page not found in DB.');
  }
  process.exit();
}

check();
