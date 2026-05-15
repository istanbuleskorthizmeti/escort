const fs = require('fs');

const webpFiles = Array.from({ length: 314 }, (_, i) => `  {
    "title": "VIP ELİT PARTNER",
    "src": "/_media/vitrin/vip-profil-${i + 1}.webp"
  }`).join(',\n');

const content = `/**
 * 👑 HYDRA ELITE: SYNCHRONIZED VITRIN DATABASE (2026)
 * Automatically mapped to WebP for 100/100 PageSpeed.
 */
export const vitrinImages = [
${webpFiles}
];
`;

fs.writeFileSync('c:/Users/onurk/esc/lib/vitrin-images.ts', content);
console.log('Successfully updated vitrin-images.ts to use WebP only.');
