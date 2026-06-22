import { GET } from '../app/amp/route';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const req = new Request('http://localhost:3000/amp?loc=kadikoy', {
    headers: {
      host: 'istanbulescort.blog'
    }
  });

  const response = await GET(req);
  const html = await response.text();
  console.log("HTML LENGTH:", html.length);
  
  // Check for duplicates
  const canonicalCount = (html.match(/rel=["']canonical["']/g) || []).length;
  const charsetCount = (html.match(/charset=/g) || []).length;
  const viewportCount = (html.match(/name=["']viewport["']/g) || []).length;
  const scriptCount = (html.match(/<script/g) || []).length;
  const styleCount = (html.match(/<style/g) || []).length;

  console.log("Canonical tags:", canonicalCount);
  console.log("Charset tags:", charsetCount);
  console.log("Viewport tags:", viewportCount);
  console.log("Script tags:", scriptCount);
  console.log("Style tags:", styleCount);

  // Print first 500 chars and last 500 chars
  console.log("\n--- HEAD SECTION ---");
  console.log(html.slice(0, 1000));
  
  console.log("\n--- FOOTER SECTION ---");
  console.log(html.slice(-1000));
}

main().catch(console.error);
