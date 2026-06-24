import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

const domains = ['escortvip.net', 'istanbulescort.blog', 'istanbulescort.blog'];

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to target VPS.');

    for (const domain of domains) {
      console.log(`\n🔍 Checking AMP layout output for domain: ${domain}...`);
      const cmd = `curl -s -H "Host: ${domain}" "http://localhost:3001/amp"`;
      const res = await ssh.execCommand(cmd);
      
      const hasBoilerplate = res.stdout.includes('amp-boilerplate');
      const hasInlineStyle = res.stdout.includes('style="') || res.stdout.includes("style='");
      const hasCanonical = res.stdout.includes('rel="canonical"');
      const docTypeOk = res.stdout.trim().startsWith('<!doctype html>');
      const hasAmpAttribute = res.stdout.includes('<html amp') || res.stdout.includes('<html ⚡');

      console.log(`   - Doctype Valid: ${docTypeOk ? '✅' : '❌'}`);
      console.log(`   - HTML amp attribute: ${hasAmpAttribute ? '✅' : '❌'}`);
      console.log(`   - Boilerplate Present: ${hasBoilerplate ? '✅' : '❌'}`);
      console.log(`   - Forbidden Inline Styles: ${hasInlineStyle ? '❌ FAILED' : '✅ NONE FOUND'}`);
      console.log(`   - Canonical Link Present: ${hasCanonical ? '✅' : '❌'}`);
    }

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
