const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace phones
    content = content.replace(/37258113650/g, '905520949245');
    content = content.replace(/\+37258113650/g, '+905520949245');
    content = content.replace(/\+905303542448/g, '+905520949245');
    
    // Replace emails
    content = content.replace(/gather@dorukcanay\.digital/g, 'info@dorukcanay.digital');
    
    // Replace domains
    content = content.replace(/iqostobacco\.online/g, 'vipescorthizmeti.com');
    
    fs.writeFileSync(filePath, content, 'utf8');
}

const files = [
    'scripts/generate_district_pdfs.js',
    'scripts/telegram-deliver-nisantasi-master.ts',
    'scripts/process_watermarks.py',
    'lib/contact-service.ts',
    'lib/crm/telegram-broadcaster.js',
    'lib/crm/telegram-broadcaster.ts',
    'lib/nuclear-seo-engine.ts',
    'components/SEO/JsonLd.tsx',
    'components/SEO/VirtualEntitySchema.tsx',
    'lib/seo-metadata.ts',
    'lib/seo/blogger.ts',
    '.env',
    '.env.example',
    'app/layout.tsx',
    'app/whatsapp/route.ts',
    'app/contact/page.tsx',
    'scripts/god-mode-gbp-submitter.ts'
];

files.forEach(f => replaceInFile(path.join(__dirname, f)));
console.log("All replacements complete locally.");
