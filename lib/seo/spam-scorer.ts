import * as cheerio from 'cheerio';

export interface SpamAnalysisResult {
  url?: string;
  totalCharacters: number;
  wordCount: number;
  h1: string;
  metaDescription: string;
  blackHatMetrics: {
    hiddenElementsCount: number;
    keywordStuffingScore: number;
  };
  whiteHatMetrics: {
    eeatLogisticsScore: number;
  };
  finalSpamProbability: number; // 0 to 100
  verdict: 'SAFE_WHITE_HAT' | 'SUSPICIOUS' | 'TOXIC_BLACK_HAT';
}

export const SpamScorerService = {
  analyzeHTML(htmlContent: string, targetUrl?: string): SpamAnalysisResult {
    const $ = cheerio.load(htmlContent);

    // 1. Basic Metadata Extraction
    const h1 = $('h1').text().trim() || 'H1 Bulunamadı';
    const metaDescription = $('meta[name="description"]').attr('content') || 'Meta Description Bulunamadı';
    
    // Clean text extraction from body (remove scripts/styles)
    $('script, style, noscript').remove();
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim().toLowerCase();
    
    const totalCharacters = bodyText.length;
    const words = bodyText.split(' ').filter(w => w.length > 2);
    const wordCount = words.length;

    // 2. Black-Hat Metrics (Hidden Elements & Stuffing)
    // Finding elements trying to hide from the user
    const hiddenElements = $('.sr-only, .opacity-0, .invisible, [style*="display: none"], [style*="opacity: 0"]').length;
    
    // Check for extreme keyword stuffing of 'escort'/'eskort'
    const spamKeywords = ['escort', 'eskort', 'partner', 'bayan'];
    let spamKeywordOccurrences = 0;
    spamKeywords.forEach(kw => {
      const regex = new RegExp(kw, 'g');
      const matches = bodyText.match(regex);
      if (matches) spamKeywordOccurrences += matches.length;
    });

    // Ratio of spam keywords to total words (e.g. > 5% is usually considered keyword stuffing)
    const keywordStuffingRatio = wordCount > 0 ? (spamKeywordOccurrences / wordCount) * 100 : 0;
    const keywordStuffingScore = Math.min(100, keywordStuffingRatio * 10); // Scale 10% ratio to 100 score

    // 3. White-Hat / Semantic Camouflage Metrics (EEAT & Logistics)
    const b2bKeywords = ['transfer', 'lojistik', 'şoför', 'vip', 'karşılama', 'havalimanı', 'marina', 'zırhlı', 'concierge'];
    let b2bKeywordOccurrences = 0;
    b2bKeywords.forEach(kw => {
      const regex = new RegExp(kw, 'g');
      const matches = bodyText.match(regex);
      if (matches) b2bKeywordOccurrences += matches.length;
    });

    // Score based on B2B keyword density
    const eeatLogisticsScore = Math.min(100, b2bKeywordOccurrences * 5); // 20 occurrences gives 100%

    // 4. Calculate Final Probability
    // Hidden elements are heavily penalized (+30 points per hidden element block)
    let spamProbability = (hiddenElements * 30) + keywordStuffingScore;
    
    // Good B2B semantic presence reduces the spam probability
    spamProbability -= (eeatLogisticsScore * 0.5);

    // Normalize between 0 and 100
    spamProbability = Math.max(0, Math.min(100, spamProbability));

    let verdict: 'SAFE_WHITE_HAT' | 'SUSPICIOUS' | 'TOXIC_BLACK_HAT' = 'SUSPICIOUS';
    if (spamProbability > 70) verdict = 'TOXIC_BLACK_HAT';
    else if (spamProbability < 30 && eeatLogisticsScore > 20) verdict = 'SAFE_WHITE_HAT';

    return {
      url: targetUrl,
      totalCharacters,
      wordCount,
      h1,
      metaDescription,
      blackHatMetrics: {
        hiddenElementsCount: hiddenElements,
        keywordStuffingScore: Number(keywordStuffingScore.toFixed(2)),
      },
      whiteHatMetrics: {
        eeatLogisticsScore: Number(eeatLogisticsScore.toFixed(2)),
      },
      finalSpamProbability: Number(spamProbability.toFixed(2)),
      verdict
    };
  }
};
