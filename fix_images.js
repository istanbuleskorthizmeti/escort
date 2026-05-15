const fs = require('fs');
const file = 'c:/Users/onurk/esc/lib/vitrin-images.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/"\/vitrin\//g, '"/_media/vitrin/');
fs.writeFileSync(file, content);
console.log('Fixed media paths in vitrin-images.ts');
