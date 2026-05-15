const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'lib/vitrin-images.ts');
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/"\/vitrin\//g, '"/_media/vitrin/');
fs.writeFileSync(file, content);
console.log('Fixed media paths in vitrin-images.ts');
