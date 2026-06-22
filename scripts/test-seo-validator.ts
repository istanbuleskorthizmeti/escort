import { SeoValidator } from './utils/seo-validator';

async function testSeoValidator() {
  console.log('🧪 Starting SEO Validator Unit Tests...');

  const sampleText = 'İstanbul şişli escort arayanlar için en lüks şişli eskort ilanları bu adreste. Güvenilir escort buluşma deneyimi sunuyoruz.';
  const keywords = ['escort', 'şişli', 'güvenilir'];

  // Test 1: Density
  const density = SeoValidator.analyzeKeywordDensity(sampleText, keywords);
  console.log('✅ Density analysis output:', density);

  // Test 2: Schema Validation
  const validSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Şişli VIP Escort"
    }
    </script>
  `;
  const invalidSchema = `
    {
      "type": "LocalBusiness"
    }
  `;

  console.log('✅ Valid Schema Test:', SeoValidator.validateJsonLd(validSchema));
  console.log('✅ Invalid Schema Test:', SeoValidator.validateJsonLd(invalidSchema));

  // Test 3: Link Health Checking
  const links = ['https://google.com', 'https://thisurldoesnotexistforreal123.com'];
  console.log('📡 Verifying links...');
  const linkReport = await SeoValidator.verifyLinks(links);
  console.log('✅ Link Health Report:', linkReport);
}

testSeoValidator().catch(console.error);
