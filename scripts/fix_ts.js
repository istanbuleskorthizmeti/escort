const fs = require('fs');
const files = [
  'app/api/admin/health/route.ts',
  'app/api/admin/stats/route.ts',
  'app/api/crm/submit/route.ts',
  'app/api/crm/webhook/route.ts',
  'app/api/seo/route.ts',
  'app/go/[id]/route.ts',
  'app/whatsapp/route.ts',
  'components/Admin/RankTrackerTable.tsx',
  'lib/ad-service.ts',
  'lib/contact-service.ts',
  'lib/seo/performance-report.ts',
  'lib/crm/telegram.ts'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    
    // Fix implicitly any parameters
    const params = ['a', 'b', 'acc', 'lead', 'group', 'log', 'tx', 'p', 'err', 'comp', 'idx', 's', 'd', 'i', 'l'];
    
    params.forEach(p => {
      const regex1 = new RegExp(`\\(${p}\\)`, 'g');
      content = content.replace(regex1, `(${p}: any)`);
      
      const regex2 = new RegExp(`\\(${p}, `, 'g');
      content = content.replace(regex2, `(${p}: any, `);
      
      const regex3 = new RegExp(`, ${p}\\)`, 'g');
      content = content.replace(regex3, `, ${p}: any)`);
      
      const regex4 = new RegExp(`, ${p}, `, 'g');
      content = content.replace(regex4, `, ${p}: any, `);
    });

    // Replace bot. with bot?. in telegram.ts
    if (f.includes('telegram.ts')) {
      content = content.replace(/bot\./g, 'bot?.');
    }

    fs.writeFileSync(f, content);
    console.log('Fixed', f);
  }
});
