
import * as fs from 'fs';
import * as path from 'path';

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                arrayOfFiles.push(fullPath);
            }
        }
    });
    return arrayOfFiles;
}

const targetDirs = ['app', 'lib', 'scripts'];
let totalFixed = 0;

targetDirs.forEach(dir => {
    const files = getAllFiles(dir);
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let fixed = false;

        // 1. Replace findUnique with slug_siteId
        const findUniqueRegex = /prisma\.pageContent\.findUnique\(\{\s*where:\s*\{\s*slug_siteId:\s*\{\s*slug:\s*([^,]+),\s*siteId\s*\}\s*\}\s*\}\)/g;
        if (findUniqueRegex.test(content)) {
            content = content.replace(findUniqueRegex, 'prisma.pageContent.findFirst({ where: { slug: $1, siteId } })');
            fixed = true;
        }

        // 2. More generic replacement for slug_siteId inside any findUnique
        const genericRegex = /findUnique\(\{\s*where:\s*\{\s*slug_siteId:\s*\{\s*slug:\s*([^,]+),\s*siteId\s*\}\s*\}\s*\}\)/g;
        if (genericRegex.test(content)) {
            content = content.replace(genericRegex, 'findFirst({ where: { slug: $1, siteId } })');
            fixed = true;
        }
        
        // 3. Replace siteId: siteId with siteId shorthand
        const siteIdRegex = /siteId:\s*siteId/g;
        if (siteIdRegex.test(content)) {
            content = content.replace(siteIdRegex, 'siteId');
            fixed = true;
        }

        if (fixed) {
            fs.writeFileSync(file, content);
            console.log(`✅ Fixed: ${file}`);
            totalFixed++;
        }
    });
});

console.log(`🚀 Total files sanitized: ${totalFixed}`);
