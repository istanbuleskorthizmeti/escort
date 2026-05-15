import { NextResponse } from "next/server";

// ⚡ VIP: SEO Rank Tracker Engine (Zero-Dependency Scraper logic)
// Fetches Google TR SERP for a given keyword and finds our domain.

export const runtime = "nodejs";
export const maxDuration = 300; // Allow 5 mins for timeout resilience if needed

export async function POST(req: Request) {
  try {
    const { keyword, targetDomain = "escortvip" } = await req.json();

    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required." }, { status: 400 });
    }

    // Modern Chrome User-Agent to avoid early blocking
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    // Build the query url. We ask for 100 results so we can check deep rankings.
    const searchUrl = `https://www.google.com.tr/search?q=${encodeURIComponent(keyword)}&num=100&gl=tr&hl=tr`;

    console.log(`[RankTracker] Fetching: ${searchUrl}`);

    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": userAgent,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Google responded with ${response.status}` }, { status: 500 });
    }

    const html = await response.text();

    let rank = -1;
    let rankUrl = "";
    const competitors: string[] = [];
    
    // RegEx string matching for Zero Dependency
    // Basic extraction of search results assuming Google uses <a> tags with urls
    const linkRegex = /<a[^>]+href="(https?:\/\/([^"]+))"/gi;
    let match;
    let currentPosition = 1;
    
    const seenDomains = new Set();
    
    // Filter out obvious noise
    const isNoise = (url: string) => url.includes('google.com') || url.includes('w3.org') || url.includes('youtube.com');

    while ((match = linkRegex.exec(html)) !== null) {
      const fullUrl = match[1];
      const domain = match[2].split('/')[0];

      if (isNoise(domain)) continue;
      
      // Skip duplicate results from same domain
      if (seenDomains.has(domain)) continue;
      seenDomains.add(domain);

      if (currentPosition <= 3 && !competitors.includes(domain)) {
        competitors.push(domain);
      }

      if (fullUrl.toLowerCase().includes(targetDomain.toLowerCase()) && rank === -1) {
        rank = currentPosition;
        rankUrl = fullUrl;
      }

      currentPosition++;
    }

    return NextResponse.json({
      success: true,
      keyword,
      rank: rank > 0 ? rank : "100+",
      url: rankUrl,
      topCompetitors: competitors,
      timestamp: new Date().toISOString(),
      searchedUrl: searchUrl
    });

  } catch (error: any) {
    console.error("[RankTracker] API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
