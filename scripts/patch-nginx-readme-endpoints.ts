import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '31.97.79.34',
      port: 22,
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('✅ Connected to VPS.');

    const filePath = '/etc/nginx/sites-available/escortvip';
    console.log(`Reading remote file: ${filePath}`);
    const catRes = await ssh.execCommand(`cat ${filePath}`);
    if (catRes.code !== 0) {
      console.error('❌ Failed to read nginx configuration:', catRes.stderr);
      return;
    }

    let configContent = catRes.stdout;

    // Locate the first server block, and insert our specific static location overrides for sitemap-readme.xml and feed-readme.xml
    const targetPattern = 'location / {';
    
    const replacement = `    # ⚡ ReadMe Static Sitemap and RSS Overrides
    location = /sitemap-readme.xml {
        alias /var/www/escortvip/public/sitemap-readme.xml;
        default_type application/xml;
        access_log off;
        expires off;
        add_header Cache-Control "public, no-transform, max-age=3600" always;
        add_header X-Served-By "Hydra-Static-Engine" always;
    }

    location = /feed-readme.xml {
        alias /var/www/escortvip/public/feed-readme.xml;
        default_type application/xml;
        access_log off;
        expires off;
        add_header Cache-Control "public, no-transform, max-age=3600" always;
        add_header X-Served-By "Hydra-Static-Engine" always;
    }

    location / {`;

    if (!configContent.includes(targetPattern)) {
      console.error('❌ Could not locate the target injection point in escortvip');
      return;
    }

    console.log('🔄 Modifying configuration...');
    // Replace only once
    configContent = configContent.replace(targetPattern, replacement);

    // Save configuration back
    const base64Content = Buffer.from(configContent).toString('base64');
    const writeRes = await ssh.execCommand(`echo "${base64Content}" | base64 -d > ${filePath}`);
    
    if (writeRes.code === 0) {
      console.log('✅ Successfully updated remote sovereign-hydra.conf.');
      
      console.log('🧹 Purging cache and reloading nginx service...');
      const reloadRes = await ssh.execCommand('rm -rf /var/cache/nginx/* && nginx -t && systemctl reload nginx');
      console.log(reloadRes.stdout || reloadRes.stderr);
      console.log('🎉 Nginx refresh complete!');
    } else {
      console.error('❌ Failed to write back the config file:', writeRes.stderr);
    }

  } catch (err: any) {
    console.error('❌ Error updating nginx config:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
