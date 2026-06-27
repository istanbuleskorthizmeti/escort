import * as fs from 'fs';

function run() {
  const filePath = "c:\\Users\\onurk\\esc\\temp-clone-v1.0\\docs\\Getting Started\\getting-started.md";
  if (!fs.existsSync(filePath)) {
    console.error("File does not exist!");
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  console.log("File length:", content.length);
  
  // Search for HTML tags
  const tags = content.match(/<[a-zA-Z0-9/]+[^>]*>/g) || [];
  console.log("HTML tags found:", tags.slice(0, 30));

  // Check if style attribute exists
  console.log("Has style attributes?", content.includes('style='));
  console.log("Has style tags?", content.includes('<style>'));
  console.log("Has unclosed br?", content.includes('<br>'));
  console.log("Has unclosed img?", content.includes('<img') && !content.includes('/>'));

  // Log first 1000 characters
  console.log("--- FIRST 800 CHARS ---");
  console.log(content.substring(0, 800));

  // Log last 800 characters
  console.log("--- LAST 800 CHARS ---");
  console.log(content.substring(content.length - 800));
}

run();
