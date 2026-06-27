import * as fs from 'fs';
import * as path from 'path';

// Helper to parse HTML tables into clean Markdown lists
function convertFile(filePath: string) {
  console.log(`Converting file: ${filePath}`);
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Regex to match the markdown tables with HTML tags
  // Example table format:
  // | 📸 Görsel | 👑 Esila - Premium Escort |
  // | :--- | :--- |
  // | <img src="URL" width="..." height="..." alt="..." /> | **İsim / Yaş:** ... <br /> **Durum:** ... <br /> ... |
  
  const tableRegex = /\|\s*📸\s*Görsel\s*\|\s*([^|]+)\|\s*\r?\n\|\s*:---\s*\|\s*:---\s*\|\s*\r?\n\|\s*<img\s+src="([^"]+)"[^>]*alt="([^"]+)"[^>]*\/>\s*\|\s*([^|]+)\|/g;

  let matchCount = 0;
  const newContent = content.replace(tableRegex, (match, headerText, imageUrl, altText, detailsText) => {
    matchCount++;
    const title = headerText.trim();
    
    // Clean details text (split by <br /> and clean spaces/bold markdown)
    const lines = detailsText
      .split(/<br\s*\/?>/i)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Ensure standard list item format
        if (line.startsWith('**') || line.startsWith('*')) {
          return `* ${line}`;
        }
        return `* ${line}`;
      });

    return `\n### ${title}\n![${altText}](${imageUrl})\n${lines.join('\n')}\n`;
  });

  console.log(`Replaced ${matchCount} tables in ${path.basename(filePath)}`);
  fs.writeFileSync(filePath, newContent, 'utf-8');
}

function run() {
  const file1 = 'c:\\Users\\onurk\\esc\\temp-clone-v1.0\\docs\\istanbul-escorts\\istanbul-escort.md';
  const file2 = 'c:\\Users\\onurk\\esc\\temp-clone-v1.0\\docs\\Getting Started\\getting-started.md';
  
  convertFile(file1);
  convertFile(file2);
}

run();
