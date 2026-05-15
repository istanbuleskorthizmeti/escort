const fs = require('fs');

const file = 'lib/crm/telegram.ts';
if (fs.existsSync(file)) {
  let text = fs.readFileSync(file, 'utf8');
  
  // Fix implicit any
  text = text.replace(/\bl =>/g, '(l: any) =>');
  text = text.replace(/\bp =>/g, '(p: any) =>');
  text = text.replace(/\bi =>/g, '(i: any) =>');
  text = text.replace(/\bd =>/g, '(d: any) =>');
  
  // Fix bot possibly null safely
  text = text.replace(/bot\./g, 'bot?.');
  text = text.replace(/redditbot\?\./g, 'redditBot.');
  
  fs.writeFileSync(file, text);
  console.log('Fixed safely in telegram.ts');
}
