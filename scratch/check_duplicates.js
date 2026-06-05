const fs = require('fs');
const content = fs.readFileSync('c:/Users/onurk/esc/scratch/external_home.html', 'utf8');

function showMeta(name) {
  const regex = new RegExp('<meta[^>]*' + name + '[^>]*>', 'gi');
  const matches = content.match(regex) || [];
  console.log(`${name}: ${matches.length} matches`);
  matches.forEach(m => console.log('  -', m));
}

function showLink(rel) {
  const regex = new RegExp('<link[^>]*' + rel + '[^>]*>', 'gi');
  const matches = content.match(regex) || [];
  console.log(`${rel}: ${matches.length} matches`);
  matches.forEach(m => console.log('  -', m));
}

showMeta('charSet');
showMeta('viewport');
showMeta('theme-color');
showLink('canonical');
showLink('amphtml');
