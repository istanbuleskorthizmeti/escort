import { generateGodModeOmniContent } from './lib/ai-seo';

async function test() {
  const content = await generateGodModeOmniContent({
    city: 'İstanbul',
    host: 'sisliescort.shop'
  });
  console.log("TITLE:", content.wordpress.title);
  console.log("CONTENT LENGTH:", content.wordpress.content.length);
  console.log("CONTENT PREVIEW:", content.wordpress.content.substring(0, 500));
}

test().catch(console.error);
