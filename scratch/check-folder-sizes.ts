import fs from 'fs';
import path from 'path';

function getDirSize(dir: string): number {
  let size = 0;
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const name = path.join(dir, file);
      if (file === 'node_modules' || file === '.next' || file === '.git' || file === 'dist') {
        continue;
      }
      const stat = fs.statSync(name);
      if (stat.isDirectory()) {
        size += getDirSize(name);
      } else {
        size += stat.size;
      }
    }
  } catch {}
  return size;
}

const root = process.cwd();
const children = fs.readdirSync(root);

console.log('--- DIRECTORY SIZES ---');
for (const child of children) {
  const childPath = path.join(root, child);
  if (child === 'node_modules' || child === '.next' || child === '.git' || child === 'dist') {
    continue;
  }
  try {
    const stat = fs.statSync(childPath);
    if (stat.isDirectory()) {
      const sizeMB = getDirSize(childPath) / (1024 * 1024);
      if (sizeMB > 0.1) {
        console.log(`${sizeMB.toFixed(2)} MB - ${child}/`);
      }
    } else {
      const sizeMB = stat.size / (1024 * 1024);
      if (sizeMB > 0.1) {
        console.log(`${sizeMB.toFixed(2)} MB - ${child}`);
      }
    }
  } catch {}
}
