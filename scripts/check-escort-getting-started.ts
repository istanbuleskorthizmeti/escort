import * as fs from 'fs';

function run() {
  const filePath = "c:\\Users\\onurk\\esc\\temp-clone-escort\\docs\\Getting Started\\getting-started.md";
  if (!fs.existsSync(filePath)) {
    console.error("File does not exist!");
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  console.log("File length:", content.length);
  
  console.log("Has style attributes?", content.includes('style='));
  console.log("Has style tags?", content.includes('<style>'));
  console.log("Has unclosed br?", content.includes('<br>'));
  console.log("Has unclosed img?", content.includes('<img') && !content.includes('/>'));
  console.log("Has div tags?", content.includes('<div') || content.includes('</div>'));

  // Let's print any tag that matches '<'
  const tags = content.match(/<[a-zA-Z0-9/:-]+[^>]*>/g) || [];
  console.log("All tags found:", tags);
}

run();
