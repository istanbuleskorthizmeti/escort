import { NextResponse } from "next/server";

// ⚡ VIP: SEO On-Page/Keyword Extraction Engine (Zero Dependency)
// Bu endpoint verilen bir sayfanın DOM'unu tarar (örneğin localhost'umuz veya canlı sistem),
// <h1>, <title>, meta takıları ve metindeki yoğunluğu analiz ederek asıl hedef anahtar kelimeleri bulur.

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required." }, { status: 400 });
    }

    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    console.log(`[SEOAudi] Fetching: ${url}`);

    const response = await fetch(url, {
      headers: { "User-Agent": userAgent },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `URL responded with ${response.status}` }, { status: response.status });
    }

    const html = await response.text();

    // Regex matchers
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);
    const description = descMatch ? descMatch[1].trim() : "";

    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, "").trim() : "";

    const h2s: string[] = [];
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    let match;
    while ((match = h2Regex.exec(html)) !== null) {
      const text = match[1].replace(/<[^>]+>/g, "").trim();
      if (text) h2s.push(text);
    }

    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyTextRaw = bodyMatch ? bodyMatch[1] : html;
    
    const bodyText = bodyTextRaw
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .toLowerCase();
    
    // Çok basit türkçe stop-words listesi
    const stopWords = ["ve", "ile", "için", "bir", "bu", "da", "de", "daha", "en", "çok", "gibi", "kadar", "olan", "olarak"];
    
    const words = bodyText.split(" ")
      .map((w: string) => w.replace(/[^a-z0-9ğüşıöç]/g, ""))
      .filter((w: string) => w.length > 3 && !stopWords.includes(w));

    const wordCounts: Record<string, number> = {};
    words.forEach((w: string) => {
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    });

    const extractedKeywords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);

    const aiSuggestedKeywords = [...extractedKeywords];
    if (h1) {
       aiSuggestedKeywords.push(h1.replace(/[-|]/g, "").trim());
    }

    return NextResponse.json({
      success: true,
      url,
      metrics: {
        title,
        titleLength: title.length,
        description,
        descriptionLength: description.length,
        h1,
        h2Count: h2s.length,
        wordCount: words.length
      },
      extractedKeywords: [...new Set(aiSuggestedKeywords)]
    });

  } catch (error: unknown) {
    console.error("[SEOAudi] API Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
