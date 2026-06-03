import glob from 'glob'; // wait, is glob installed? Let's use fs.readdirSync recursively
import fs from 'fs';
import path from 'path';

function getFiles(dir: string, files_: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      if (name.endsWith('page.tsx') || name.endsWith('page.ts') || name.endsWith('route.ts')) {
        files_.push(name);
      }
    }
  }
  return files_;
}

console.log('--- ALL APP PAGES AND ROUTES ---');
try {
  const allFiles = getFiles(path.resolve('app'));
  for (const file of allFiles) {
    console.log(path.relative(path.resolve('.'), file));
  }
} catch (e) {
  console.error(e);
}
