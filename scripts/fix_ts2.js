const fs = require('fs');

function rep(file, search, replace) {
  if (fs.existsSync(file)) {
    const text = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file, text.replace(search, replace));
    console.log('Fixed', file);
  }
}

rep('app/api/admin/health/route.ts', /(a) =>/g, '(a: any) =>');
rep('app/api/admin/stats/route.ts', /(group) =>/g, '(group: any) =>');
rep('app/api/admin/stats/route.ts', /(log) =>/g, '(log: any) =>');
rep('app/api/seo/route.ts', /(p) =>/g, '(p: any) =>');
rep('app/go/[id]/route.ts', /catch\(err =>/g, 'catch((err: any) =>');
rep('app/whatsapp/route.ts', /catch\(err =>/g, 'catch((err: any) =>');
rep('lib/ad-service.ts', /(ad) =>/g, '(ad: any) =>');
rep('lib/contact-service.ts', /(s) =>/g, '(s: any) =>');
rep('lib/crm/telegram.ts', /(l) =>/g, '(l: any) =>');
rep('lib/crm/telegram.ts', /(p) =>/g, '(p: any) =>');
