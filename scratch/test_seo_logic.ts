import { generateLocationMetadata } from '../lib/seo-metadata';
import { generateSitemapResponse } from '../lib/seo/sitemap-generator';
import { DOMAIN_MATRIX } from '../config/domains';

async function test() {
  console.log('--- Testing SEO Silo & Canonical Isolation Protocol ---');

  // Test Case 1: District matches target district of the satellite domain
  console.log('\n1. Testing Esenyurt page on esenyurtescorthizmeti.shop (Expected: Indexed, Canonical to self):');
  const meta1 = generateLocationMetadata({
    city: 'istanbul',
    cityName: 'İstanbul',
    district: 'esenyurt',
    districtName: 'Esenyurt',
    domain: 'esenyurtescorthizmeti.shop'
  });
  console.log('  Canonical URL:', meta1.alternates?.canonical);
  console.log('  Robots Indexable:', meta1.robots);

  // Test Case 2: District mismatch (Beşiktaş page on Esenyurt satellite domain)
  console.log('\n2. Testing Beşiktaş page on esenyurtescorthizmeti.shop (Expected: Noindexed, Canonical to besiktasescorthizmeti.shop):');
  const meta2 = generateLocationMetadata({
    city: 'istanbul',
    cityName: 'İstanbul',
    district: 'besiktas',
    districtName: 'Beşiktaş',
    domain: 'esenyurtescorthizmeti.shop'
  });
  console.log('  Canonical URL:', meta2.alternates?.canonical);
  console.log('  Robots Indexable:', meta2.robots);

  // Test Case 3: District mismatch without dedicated satellite (e.g. Kağıthane on Esenyurt satellite)
  console.log('\n3. Testing Kağıthane page on esenyurtescorthizmeti.shop (Expected: Noindexed, Canonical to istanbulescort.blog):');
  const meta3 = generateLocationMetadata({
    city: 'istanbul',
    cityName: 'İstanbul',
    district: 'kagithane',
    districtName: 'Kağıthane',
    domain: 'esenyurtescorthizmeti.shop'
  });
  console.log('  Canonical URL:', meta3.alternates?.canonical);
  console.log('  Robots Indexable:', meta3.robots);

  // Test Case 4: City page on district-specific satellite domain (e.g. /istanbul on Esenyurt satellite)
  console.log('\n4. Testing City page on esenyurtescorthizmeti.shop (Expected: Noindexed, Canonical to istanbulescort.blog):');
  const meta4 = generateLocationMetadata({
    city: 'istanbul',
    cityName: 'İstanbul',
    domain: 'esenyurtescorthizmeti.shop'
  });
  console.log('  Canonical URL:', meta4.alternates?.canonical);
  console.log('  Robots Indexable:', meta4.robots);
}

test().catch(console.error);
