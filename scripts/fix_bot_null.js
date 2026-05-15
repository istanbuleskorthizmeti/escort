const fs = require('fs');

const file = 'lib/crm/telegram.ts';
if (fs.existsSync(file)) {
  let text = fs.readFileSync(file, 'utf8');
  
  // Fix implicit any
  text = text.replace(/l => /g, '(l: any) => ');
  text = text.replace(/p => /g, '(p: any) => ');
  
  // Fix bot possibly null
  text = text.replace(/\bbot\./g, 'bot?.');
  
  fs.writeFileSync(file, text);
  console.log('Fixed bot null in telegram.ts');
}
