import fs from 'fs';
import path from 'path';

function getFiles(dir: string, list: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    const stat = fs.statSync(name);
    if (stat.isDirectory()) {
      getFiles(name, list);
    } else {
      list.push(`${(stat.size / (1024 * 1024)).toFixed(2)} MB - ${name}`);
    }
  }
  return list;
}

const files = getFiles(path.join(process.cwd(), 'public'));
files.sort((a, b) => parseFloat(b) - parseFloat(a));

console.log('--- LARGEST FILES IN public/ ---');
for (const f of files.slice(0, 20)) {
  console.log(f);
}
