import { cities } from './lib/locations';
import { slugify } from './lib/utils';

async function validateSitemap() {
  const baseUrl = 'https://vipescorthizmeti.com';
  const urls = [];

  for (const citySlug of Object.keys(cities)) {
    const city = cities[citySlug];
    const sCity = slugify(city.name);
    urls.push(`${baseUrl}/${sCity}-escort`);
  }

  console.log(`Generated ${urls.length} city URLs.`);
  console.log('Sample:', urls[0]);
  
  // Basic XML check
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(u => `<url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;

  console.log('XML snippet:', xml.slice(0, 200));
}

validateSitemap().catch(console.error);
