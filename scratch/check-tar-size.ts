import fs from 'fs';
import path from 'path';

function getFiles(dir: string, filesList: { path: string, size: number }[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (file === 'node_modules' || file === '.next' || file === '.git' || file === 'dist') {
      continue;
    }
    try {
      const stat = fs.statSync(name);
      if (stat.isDirectory()) {
        getFiles(name, filesList);
      } else {
        filesList.push({ path: name, size: stat.size });
      }
    } catch {}
  }
  return filesList;
}

const allFiles = getFiles(process.cwd());
allFiles.sort((a, b) => b.size - a.size);

console.log('--- TOP 20 LARGEST FILES IN WORKSPACE ---');
for (const f of allFiles.slice(0, 20)) {
  console.log(`${(f.size / (1024 * 1024)).toFixed(2)} MB - ${f.path}`);
}
