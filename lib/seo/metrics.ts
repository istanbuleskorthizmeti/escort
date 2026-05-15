/**
 * DRKCNAY ELITE: SEO METRICS ENGINE
 * Tracks Domain Authority (Open PageRank) and Bitly Click Analytics.
 */

const OPR_API_URL = "https://openpagerank.com/api/v1.0/getPageRank";
const BITLY_ANALYTICS_URL = (id: string) => `https://api-ssl.bitly.com/v4/bitlinks/${id}/clicks/summary`;

export interface DomainMetrics {
  rank: string | number;
  score: number;
  status: string;
}

export interface ClickMetrics {
  total_clicks: number;
  unit: string;
}

/**
 * Fetches Open PageRank for a domain.
 * Requires OPEN_PAGERANK_KEY in .env
 */
export async function getDomainOtorite(domain: string): Promise<DomainMetrics> {
  const apiKey = process.env.OPEN_PAGERANK_KEY;
  
  if (!apiKey) {
    console.warn("⚠️ [METRICS] OPEN_PAGERANK_KEY missing. Returning placeholder.");
    return { rank: "N/A", score: 0, status: "No API Key" };
  }

  try {
    const response = await fetch(`${OPR_API_URL}?domains[]=${domain}`, {
      headers: { 'API-OPR': apiKey }
    });

    if (!response.ok) throw new Error(`OPR Error: ${response.statusText}`);

    const data = await response.json();
    const result = data.response?.[0];

    return {
      rank: result?.rank || "N/A",
      score: parseFloat(result?.page_rank_decimal || "0"),
      status: "Success"
    };
  } catch (error) {
    console.error("❌ [METRICS] Failed to fetch OPR:", error);
    return { rank: "Error", score: 0, status: "Failed" };
  }
}

/**
 * Fetches Bitly click summary for a specific shortlink ID.
 */
export async function getBitlyClicks(bitlinkId: string): Promise<ClickMetrics> {
  const token = process.env.BITLY_ACCESS_TOKEN;

  if (!token) {
    return { total_clicks: 0, unit: "error" };
  }

  try {
    const response = await fetch(BITLY_ANALYTICS_URL(bitlinkId), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) return { total_clicks: 0, unit: "failed" };

    const data = await response.json();
    return {
      total_clicks: data.total_clicks || 0,
      unit: data.unit || "day"
    };
  } catch (error) {
    console.error("❌ [METRICS] Bitly Analytics Error:", error);
    return { total_clicks: 0, unit: "error" };
  }
}
