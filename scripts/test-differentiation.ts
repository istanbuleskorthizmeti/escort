import { SpintaxEngine } from '../lib/seo/spintax-engine';

function testDifferentiation() {
  const host = "vipescorthizmeti.com";
  const loc1 = "sile";
  const loc2 = "silivri";
  const loc3 = "kadikoy";

  console.log("=== RUNNING GEO-SEO DIFFERENTIATION TESTS ===");

  const content1 = SpintaxEngine.generateMonsterContent(loc1, host);
  const content2 = SpintaxEngine.generateMonsterContent(loc2, host);
  const content3 = SpintaxEngine.generateMonsterContent(loc3, host);

  // Check unresolved brackets
  const checkBrackets = (text: string, label: string) => {
    const hasUnresolved = text.includes('{') || text.includes('}');
    if (hasUnresolved) {
      console.log(`❌ [${label}] Contains unresolved spintax brackets!`);
    } else {
      console.log(`✅ [${label}] No unresolved brackets.`);
    }
  };

  checkBrackets(content1, loc1);
  checkBrackets(content2, loc2);
  checkBrackets(content3, loc3);

  // Check unique title headers
  const getHeader = (text: string) => {
    const match = text.match(/<h2[^>]*>(.*?)<\/h2>/);
    return match ? match[1] : "NOT FOUND";
  };

  const h1 = getHeader(content1);
  const h2 = getHeader(content2);
  const h3 = getHeader(content3);

  console.log(`\nHeader for ${loc1}: "${h1}"`);
  console.log(`Header for ${loc2}: "${h2}"`);
  console.log(`Header for ${loc3}: "${h3}"`);

  if (h1 !== h2 && h2 !== h3 && h1 !== h3) {
    console.log("✅ [HEADERS] All location headers are uniquely spun!");
  } else {
    console.log("❌ [HEADERS] Header collision detected!");
  }

  // Check similarity: count common sentences or simple length/first paragraph differences
  const getFirstParagraph = (text: string) => {
    const match = text.match(/<p class="mb-6[^>]*>(.*?)<\/p>/);
    return match ? match[1] : "NOT FOUND";
  };

  const p1 = getFirstParagraph(content1);
  const p2 = getFirstParagraph(content2);
  const p3 = getFirstParagraph(content3);

  console.log(`\nFirst paragraph for ${loc1}: "${p1.substring(0, 120)}..."`);
  console.log(`First paragraph for ${loc2}: "${p2.substring(0, 120)}..."`);
  console.log(`First paragraph for ${loc3}: "${p3.substring(0, 120)}..."`);

  if (p1 !== p2 && p2 !== p3 && p1 !== p3) {
    console.log("✅ [TEXT BODY] All first paragraphs are 100% unique!");
  } else {
    console.log("❌ [TEXT BODY] First paragraph collision detected!");
  }

  // Validate presence of specific landmarks
  const hasLandmark = (text: string, landmarks: string[]) => {
    return landmarks.some(l => text.toLowerCase().includes(l.toLowerCase()));
  };

  const sileLandmarks = ["şile limanı", "şile kalesi", "ağva", "kumbaba", "şile feneri"];
  const kadikoyLandmarks = ["moda", "caddebostan", "bağdat caddesi", "fenerbahçe", "suadiye", "bostancı", "göztepe", "acıbadem"];

  const hasSileL = hasLandmark(content1, sileLandmarks);
  const hasKadikoyL = hasLandmark(content3, kadikoyLandmarks);

  console.log(`\nLandmark verification for ${loc1}: ${hasSileL ? "✅ Found" : "❌ Not Found"}`);
  console.log(`Landmark verification for ${loc3}: ${hasKadikoyL ? "✅ Found" : "❌ Not Found"}`);

  // Total word counts
  const wordCount = (text: string) => text.split(/\s+/).length;
  console.log(`\nWord counts:`);
  console.log(`- ${loc1}: ${wordCount(content1)} words`);
  console.log(`- ${loc2}: ${wordCount(content2)} words`);
  console.log(`- ${loc3}: ${wordCount(content3)} words`);

  console.log("=== DIFFERENTIATION TEST COMPLETED ===");
}

testDifferentiation();
