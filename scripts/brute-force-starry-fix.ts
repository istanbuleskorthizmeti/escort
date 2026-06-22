import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function bruteForceFix() {
  const filePath = path.join(process.cwd(), 'google-key-starry.json');
  const keyData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const originalPrivateKey = keyData.private_key;
  
  // We know Line 18 is 65 characters instead of 64.
  // Content: hhoZoFQYrewKBgQCJrPc1xQ+0ImUXqrhpahYE0eV34VahqPX4ZgghdLoKoR+itP4s
  const lineToFix = 'hhoZoFQYrewKBgQCJrPc1xQ+0ImUXqrhpahYE0eV34VahqPX4ZgghdLoKoR+itP4s';
  
  console.log(`Brute-forcing Line 18 characters subtraction...`);
  
  for (let i = 0; i < lineToFix.length; i++) {
    // Construct a candidate line 18 by removing character at index i
    const candidateLine18 = lineToFix.slice(0, i) + lineToFix.slice(i + 1);
    
    // Reconstruct the full private key
    const pkCleaned = originalPrivateKey
      .replace(lineToFix, candidateLine18);
    
    try {
      const key = crypto.createPrivateKey(pkCleaned);
      console.log(`🎉 SUCCESS! Found valid key by removing character at index ${i} (${lineToFix[i]}):`);
      console.log(`   Candidate Line 18: ${candidateLine18}`);
      
      // Save it!
      keyData.private_key = pkCleaned;
      fs.writeFileSync(filePath, JSON.stringify(keyData, null, 2));
      console.log('💾 Corrected key saved to google-key-starry.json');
      return;
    } catch (e) {
      // Failed, try next character
    }
  }
  
  console.error('❌ Brute-force character removal from Line 18 failed to produce a valid key.');
}

bruteForceFix();
