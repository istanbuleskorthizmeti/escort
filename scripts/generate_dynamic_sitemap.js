const fs = require('fs');
const path = require('path');

/**
 * 🗺️ SITEMAP STUB
 * This script satisfies the build requirement while the real sitemaps 
 * are served dynamically via /api/seo.
 */
function main() {
    console.log('📡 [HYDRA] Dynamic Sitemap Bridge Active');
    const publicDir = path.join(__dirname, '../public');
    
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    // Create a physical dummy if needed, though dynamic is preferred
    fs.writeFileSync(path.join(publicDir, 'sitemap-stub.xml'), '<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>');
    console.log('✅ [SITEMAP] Stub generated to satisfy build pipeline.');
}

main();
