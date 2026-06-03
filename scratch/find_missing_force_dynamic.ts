import fs from 'fs';
import path from 'path';

function getFiles(dir: string, files_: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      if (name.endsWith('page.tsx')) {
        files_.push(name);
      }
    }
  }
  return files_;
}

console.log('--- SCANNING FOR MISSING FORCE-DYNAMIC ---');
const allPages = getFiles(path.resolve('app'));
for (const file of allPages) {
  const relativePath = path.relative(path.resolve('.'), file);
  // Check if file is dynamic (has brackets in path)
  if (relativePath.includes('[') && relativePath.includes(']')) {
    const content = fs.readFileSync(file, 'utf8');
    const hasForceDynamic = content.includes('force-dynamic');
    const hasForceStatic = content.includes('force-static');
    
    if (!hasForceDynamic && !hasForceStatic) {
      console.log(`❌ Missing configuration: ${relativePath}`);
    } else if (hasForceStatic) {
      console.log(`ℹ️ force-static: ${relativePath}`);
    } else {
      console.log(`✅ force-dynamic: ${relativePath}`);
    }
  }
}
