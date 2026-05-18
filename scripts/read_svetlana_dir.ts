import fs from 'fs';
import path from 'path';

const dir = 'C:\\Users\\onurk\\Desktop\\vitrin dorukcan\\Svetlana';

try {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    console.log('📁 Svetlana directory files:', files);
  } else {
    console.log('❌ Directory does not exist:', dir);
  }
} catch (e) {
  console.error('Error:', e);
}
