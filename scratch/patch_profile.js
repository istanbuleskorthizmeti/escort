const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../app/profile/[slug]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace main image src & onError
const targetMainImage = `                 <Image \n                   src={mainImageSrc.startsWith('http') ? mainImageSrc : \`\${siteConfig.cdnUrl}\${mainImageSrc}\`} \n                   alt={\`\${domainPrefix.toUpperCase()} \${name} \${city} Escort - %100 Gerçek ve Onaylı Profil\`} \n                   title={\`\${domainPrefix.toUpperCase()} \${name} \${city} VIP\`} \n                   fill \n                   unoptimized={true} \n                   className="object-cover group-hover:scale-110 transition-transform duration-2000" \n                   priority \n                   onError={(e: any) => { \n                     if (e.target.dataset.failed) return; \n                     e.target.dataset.failed = 'true'; \n                     const fallbackIdx = (charSum % 310) + 1; \n                     e.target.src = \`\${siteConfig.cdnUrl}/_media/vitrin/vip-profil-\${fallbackIdx}.webp\`; \n                   }} \n                 />`;

// Since there could be carriage returns, let's normalize newlines to run a clean match
const normalizedContent = content.replace(/\r\n/g, '\n');

const patchedMainImage = `                 <Image 
                   src={getSeoImageUrl(mainImageSrc)} 
                   alt={\`\${domainPrefix.toUpperCase()} \${name} \${city} Escort - %100 Gerçek ve Onaylı Profil\`}
                   title={\`\${domainPrefix.toUpperCase()} \${name} \${city} VIP\`}
                   fill
                   unoptimized={true}
                   className="object-cover group-hover:scale-110 transition-transform duration-2000"
                   priority
                   onError={(e: any) => {
                     if (e.target.dataset.failed) return;
                     e.target.dataset.failed = 'true';
                     const fallbackIdx = (charSum % 310) + 1;
                     e.target.src = getSeoImageUrl(\`/_media/vitrin/vip-profil-\${fallbackIdx}.webp\`);
                   }}
                 />`;

// Let's find a more robust substring match
const searchStr = 'src={mainImageSrc.startsWith(\'http\') ? mainImageSrc : `${siteConfig.cdnUrl}${mainImageSrc}`}';
const searchFallback = 'e.target.src = `${siteConfig.cdnUrl}/_media/vitrin/vip-profil-${fallbackIdx}.webp`;';

if (normalizedContent.includes(searchStr)) {
  console.log('Found main image src string.');
  let newContent = normalizedContent.replace(searchStr, 'src={getSeoImageUrl(mainImageSrc)}');
  newContent = newContent.replace(searchFallback, 'e.target.src = getSeoImageUrl(`/_media/vitrin/vip-profil-${fallbackIdx}.webp`);');
  
  // Write back preserving CRLF if the original file had it
  const finalContent = content.includes('\r\n') ? newContent.replace(/\n/g, '\r\n') : newContent;
  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log('Successfully patched profile page main image.');
} else {
  console.error('Could not find the target strings in file.');
}
