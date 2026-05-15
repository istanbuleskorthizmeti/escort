const fs = require('fs');
const envPath = '/var/www/escortvip/.env';
if (fs.existsSync(envPath)) {
    let env = fs.readFileSync(envPath, 'utf8');
    env = env.replace(/PREMIUM_PROXY_URL=.*/, 'PREMIUM_PROXY_URL="http://z7z72SCVOLwvNvd:ZHki15R6pVOMI9r@82.41.250.74:45246"');
    
    // Also update PROXY_CHEAP API keys if they exist, or append them
    if (env.includes('PROXY_CHEAP_API_KEY')) {
        env = env.replace(/PROXY_CHEAP_API_KEY=.*/, 'PROXY_CHEAP_API_KEY="019db944-2da7-7f03-8bbc-14e0ab56acf7"');
        env = env.replace(/PROXY_CHEAP_API_SECRET=.*/, 'PROXY_CHEAP_API_SECRET="019db944-2da7-7f03-8bbc-14e0ac131668"');
    }
    
    fs.writeFileSync(envPath, env);
    console.log('Successfully updated .env with new proxy and keys.');
} else {
    console.error('File not found: ' + envPath);
}
