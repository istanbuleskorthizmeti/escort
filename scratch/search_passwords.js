const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
        searchDir(fullPath);
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.md') || file.endsWith('.txt')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('dorukcanay.digital') || content.includes('info@dorukcanay')) {
            console.log(`Match in ${fullPath}:`);
            const lines = content.split('\n');
            lines.forEach((line, idx) => {
              if (line.includes('dorukcanay.digital') || line.includes('info@') || line.includes('pass') || line.includes('key')) {
                console.log(`  L${idx+1}: ${line.trim().substring(0, 150)}`);
              }
            });
          }
        } catch (e) {}
      }
    }
  }
}

searchDir(process.cwd());
